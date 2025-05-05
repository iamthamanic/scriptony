import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mcpClient } from '@/utils/mcpClient';
import { CheckIcon, AlertTriangleIcon, PlayIcon, RefreshCwIcon, ClockIcon, PlusIcon, XIcon, CheckCircleIcon } from 'lucide-react';

interface TestAction {
  type: string;
  target?: string;
  value?: string;
  customCode?: string;
  name?: string;
}

interface TestAssertion {
  type: string;
  target?: string;
  expected?: string;
  customCode?: string;
  name?: string;
}

interface TestDefinition {
  id: string;
  name: string;
  feature_id: string;
  test_type: string;
  priority: string;
  is_auto_generated: boolean;
  created_at: string;
  updated_at: string;
  actions?: TestAction[];
  assertions?: TestAssertion[];
  route?: string;
}

interface TestScreenshot {
  id: string;
  test_result_id: string;
  screenshot_url: string;
  step_name?: string;
}

interface TestResult {
  id: string;
  test_id: string;
  status: 'passed' | 'failed' | 'pending' | 'error';
  error_message?: string;
  execution_time?: number;
  created_at: string;
  test_screenshots?: TestScreenshot[];
}

interface FeatureRegistry {
  id: string;
  name: string;
  type: string;
  test_status: 'tested' | 'untested' | 'in_progress';
  created_at: string;
}

interface CoverageSummary {
  features: {
    total: number;
    tested: number;
    untested: number;
    inProgress: number;
  };
  testResults: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
  };
}

const TestStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'passed':
      return <Badge className="bg-green-500"><CheckIcon className="mr-1 h-3 w-3" /> Passed</Badge>;
    case 'failed':
      return <Badge variant="destructive"><XIcon className="mr-1 h-3 w-3" /> Failed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><ClockIcon className="mr-1 h-3 w-3" /> Pending</Badge>;
    case 'error':
      return <Badge variant="destructive"><AlertTriangleIcon className="mr-1 h-3 w-3" /> Error</Badge>;
    case 'untested':
      return <Badge variant="outline" className="border-gray-500 text-gray-500">Untested</Badge>;
    case 'tested':
      return <Badge variant="outline" className="border-green-500 text-green-500"><CheckCircleIcon className="mr-1 h-3 w-3" /> Tested</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="border-blue-500 text-blue-500"><RefreshCwIcon className="mr-1 h-3 w-3" /> In Progress</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const TestDashboard: React.FC = () => {
  const [tests, setTests] = useState<TestDefinition[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [features, setFeatures] = useState<FeatureRegistry[]>([]);
  const [coverage, setCoverage] = useState<CoverageSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tests
      const testsResponse = await mcpClient.execute('testing.listTests');
      if (testsResponse.success) {
        setTests(testsResponse.data || []);
      }

      // Fetch results for the last 20 test runs
      const resultsResponse = await mcpClient.execute('testing.getTestResults', { limit: 20 });
      if (resultsResponse.success) {
        setResults(resultsResponse.data || []);
      }

      // Fetch coverage summary
      const coverageResponse = await mcpClient.execute('testing.getTestCoverageSummary');
      if (coverageResponse.success) {
        setCoverage(coverageResponse.data);
      }

    } catch (error) {
      console.error('Error fetching test data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load test data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const runTest = async (testId: string) => {
    setRunningTest(testId);
    try {
      const response = await mcpClient.execute('testing.runTest', { testId });
      
      if (response.success) {
        toast({
          title: 'Test Completed',
          description: `Test ${response.data.testResult.status === 'passed' ? 'passed' : 'failed'} in ${response.data.testResult.executionTime}ms`,
          variant: response.data.testResult.status === 'passed' ? 'default' : 'destructive'
        });
        
        // Refresh results after running a test
        fetchData();
      } else {
        toast({
          title: 'Test Failed',
          description: response.error || 'An unknown error occurred',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error running test:', error);
      toast({
        title: 'Error',
        description: 'Failed to run test. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setRunningTest(null);
    }
  };

  const runAllTests = async () => {
    try {
      setLoading(true);
      const response = await mcpClient.execute('testing.runAllTests');
      
      if (response.success) {
        toast({
          title: 'All Tests Completed',
          description: `${response.data.passedTests} passed, ${response.data.failedTests} failed out of ${response.data.totalTests} tests`,
          variant: response.data.failedTests === 0 ? 'default' : 'destructive'
        });
        
        // Refresh results after running all tests
        fetchData();
      } else {
        toast({
          title: 'Tests Failed',
          description: response.error || 'An unknown error occurred',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error running all tests:', error);
      toast({
        title: 'Error',
        description: 'Failed to run all tests. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTest = async (featureId: string) => {
    try {
      const response = await mcpClient.execute('testing.generateTestForFeature', { featureId });
      
      if (response.success) {
        toast({
          title: 'Test Generated',
          description: `Successfully generated test: ${response.data.name}`,
        });
        
        // Refresh data after generating a test
        fetchData();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to generate test',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate test. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getTestResult = (testId: string) => {
    return results.find(result => result.test_id === testId);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ScriptonyTestBot Dashboard</CardTitle>
          <CardDescription>
            Automated test management for Scriptony features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center py-8">Loading test data...</div>}
          
          {!loading && coverage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Feature Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Features: {coverage.features.total}</span>
                        <span>{Math.round((coverage.features.tested / coverage.features.total) * 100) || 0}% covered</span>
                      </div>
                      <Progress value={(coverage.features.tested / coverage.features.total) * 100 || 0} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Tested</div>
                        <div className="text-2xl font-semibold text-green-500">{coverage.features.tested}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Untested</div>
                        <div className="text-2xl font-semibold text-red-500">{coverage.features.untested}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">In Progress</div>
                        <div className="text-2xl font-semibold text-blue-500">{coverage.features.inProgress}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Test Results (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Executions: {coverage.testResults.total}</span>
                        <span>{Math.round((coverage.testResults.passed / coverage.testResults.total) * 100) || 0}% passing</span>
                      </div>
                      <Progress value={(coverage.testResults.passed / coverage.testResults.total) * 100 || 0} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Passed</div>
                        <div className="text-2xl font-semibold text-green-500">{coverage.testResults.passed}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Failed</div>
                        <div className="text-2xl font-semibold text-red-500">{coverage.testResults.failed}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Pending</div>
                        <div className="text-2xl font-semibold text-yellow-500">{coverage.testResults.pending}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <Tabs defaultValue="tests">
            <TabsList className="mb-4">
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="results">Recent Results</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Test Definitions</h3>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchData}
                    disabled={loading}
                  >
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={runAllTests}
                    disabled={loading || tests.length === 0}
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Run All Tests
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-[400px] border rounded-md">
                {tests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <p className="text-muted-foreground mb-2">No tests defined yet</p>
                    <Button variant="outline" size="sm" onClick={fetchData}>
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {tests.map(test => {
                      const result = getTestResult(test.id);
                      return (
                        <div 
                          key={test.id} 
                          className={`p-4 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors ${selectedTest === test.id ? 'bg-accent' : ''}`}
                          onClick={() => setSelectedTest(test.id === selectedTest ? null : test.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{test.name}</h4>
                              <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                                <Badge variant="outline">{test.test_type}</Badge>
                                <Badge variant="outline" className={
                                  test.priority === 'critical' ? 'border-red-500 text-red-500' :
                                  test.priority === 'high' ? 'border-orange-500 text-orange-500' :
                                  test.priority === 'low' ? 'border-blue-500 text-blue-500' :
                                  'border-gray-500 text-gray-500'
                                }>
                                  {test.priority}
                                </Badge>
                                {test.is_auto_generated && (
                                  <Badge variant="outline" className="border-purple-500 text-purple-500">Auto-generated</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {result && <TestStatusBadge status={result.status} />}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  runTest(test.id);
                                }}
                                disabled={runningTest === test.id}
                              >
                                {runningTest === test.id ? (
                                  <>
                                    <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                                    Running...
                                  </>
                                ) : (
                                  <>
                                    <PlayIcon className="h-4 w-4 mr-2" />
                                    Run
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {selectedTest === test.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium mb-2">Actions</h5>
                                  {test.actions?.length > 0 ? (
                                    <ul className="space-y-2">
                                      {test.actions.map((action: any, index: number) => (
                                        <li key={index} className="text-sm">
                                          <span className="font-medium">{action.name || action.type}: </span>
                                          {action.target && <span className="text-muted-foreground">Target: {action.target}</span>}
                                          {action.value && <span className="text-muted-foreground ml-2">Value: {action.value}</span>}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No actions defined</p>
                                  )}
                                </div>
                                
                                <div>
                                  <h5 className="font-medium mb-2">Assertions</h5>
                                  {test.assertions?.length > 0 ? (
                                    <ul className="space-y-2">
                                      {test.assertions.map((assertion: any, index: number) => (
                                        <li key={index} className="text-sm">
                                          <span className="font-medium">{assertion.name || assertion.type}: </span>
                                          {assertion.target && <span className="text-muted-foreground">Target: {assertion.target}</span>}
                                          {assertion.expected && <span className="text-muted-foreground ml-2">Expected: {assertion.expected}</span>}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No assertions defined</p>
                                  )}
                                </div>
                              </div>
                              
                              {result && (
                                <div className="mt-4 pt-4 border-t">
                                  <h5 className="font-medium mb-2">Latest Result</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Status</p>
                                      <p><TestStatusBadge status={result.status} /></p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Execution Time</p>
                                      <p>{result.execution_time ? `${result.execution_time}ms` : 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Run At</p>
                                      <p>{new Date(result.created_at).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  
                                  {result.error_message && (
                                    <Alert variant="destructive" className="mt-4">
                                      <AlertTriangleIcon className="h-4 w-4" />
                                      <AlertTitle>Error</AlertTitle>
                                      <AlertDescription>
                                        {result.error_message}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                  
                                  {result.test_screenshots && result.test_screenshots.length > 0 && (
                                    <div className="mt-4">
                                      <h6 className="font-medium mb-2">Screenshots</h6>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.test_screenshots.map(screenshot => (
                                          <div key={screenshot.id} className="border rounded-md overflow-hidden">
                                            <img 
                                              src={screenshot.screenshot_url} 
                                              alt={screenshot.step_name || 'Test screenshot'} 
                                              className="w-full h-auto"
                                            />
                                            {screenshot.step_name && (
                                              <div className="p-2 text-sm bg-muted">
                                                {screenshot.step_name}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="results">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Test Results</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] border rounded-md">
                {results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <p className="text-muted-foreground mb-2">No test results yet</p>
                    <Button variant="outline" size="sm" onClick={fetchData}>
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {results.map(result => {
                      const test = tests.find(t => t.id === result.test_id);
                      return (
                        <div key={result.id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{test?.name || 'Unknown Test'}</h4>
                              <p className="text-sm text-muted-foreground">
                                Run at {new Date(result.created_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TestStatusBadge status={result.status} />
                              {result.execution_time && (
                                <Badge variant="outline">{result.execution_time}ms</Badge>
                              )}
                            </div>
                          </div>
                          
                          {result.error_message && (
                            <Alert variant="destructive" className="mt-4">
                              <AlertTriangleIcon className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>
                                {result.error_message}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {result.test_screenshots && result.test_screenshots.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <h5 className="font-medium mb-2">Screenshots</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.test_screenshots.map(screenshot => (
                                  <div key={screenshot.id} className="border rounded-md overflow-hidden">
                                    <img 
                                      src={screenshot.screenshot_url} 
                                      alt={screenshot.step_name || 'Test screenshot'} 
                                      className="w-full h-auto"
                                    />
                                    {screenshot.step_name && (
                                      <div className="p-2 text-sm bg-muted">
                                        {screenshot.step_name}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="features">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Feature Registry</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] border rounded-md">
                {features.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <p className="text-muted-foreground mb-2">No features registered yet</p>
                    <p className="text-sm text-muted-foreground">
                      Features will be detected automatically as they are used in the app
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {features.map(feature => (
                      <div key={feature.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{feature.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{feature.type}</Badge>
                              <TestStatusBadge status={feature.test_status} />
                            </div>
                          </div>
                          <div>
                            {feature.test_status === 'untested' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleGenerateTest(feature.id)}
                              >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Generate Test
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
          </div>
          <Button onClick={fetchData} disabled={loading}>
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestDashboard;
