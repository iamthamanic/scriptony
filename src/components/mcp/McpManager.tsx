
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mcpClient } from '@/utils/mcpClient';
import { CodeIcon, KeyIcon, ServerIcon } from 'lucide-react';

interface Function {
  name: string;
  description: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required?: boolean;
    enum?: string[];
  }>;
}

interface Manifest {
  app_name: string;
  version: string;
  functions: Function[];
}

const McpManager: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [loadingManifest, setLoadingManifest] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionArgs, setFunctionArgs] = useState<Record<string, any>>({});
  const [executeResult, setExecuteResult] = useState<any>(null);
  const [executing, setExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchManifest = async () => {
    setLoadingManifest(true);
    setError(null);
    
    try {
      const response = await mcpClient.getManifest();
      
      if (response.success && response.data) {
        setManifest(response.data);
      } else {
        setError(response.error || 'Failed to fetch manifest');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoadingManifest(false);
    }
  };
  
  const fetchStatus = async () => {
    setLoadingStatus(true);
    setError(null);
    
    try {
      const response = await mcpClient.getStatus();
      
      if (response.success && response.data) {
        setStatus(response.data);
      } else {
        setError(response.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoadingStatus(false);
    }
  };
  
  useEffect(() => {
    fetchManifest();
    fetchStatus();
  }, []);
  
  useEffect(() => {
    mcpClient.setApiKey(apiKey);
  }, [apiKey]);
  
  const handleFunctionSelect = (name: string) => {
    setSelectedFunction(name);
    setFunctionArgs({});
    setExecuteResult(null);
  };
  
  const handleArgChange = (name: string, value: any) => {
    setFunctionArgs(prev => ({ ...prev, [name]: value }));
  };
  
  const executeFunction = async () => {
    if (!selectedFunction) return;
    
    setExecuting(true);
    setError(null);
    
    try {
      const response = await mcpClient.execute(selectedFunction, functionArgs);
      setExecuteResult(response);
      
      if (!response.success) {
        setError(response.error || 'Function execution failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setExecuting(false);
    }
  };
  
  const selectedFunctionDetails = manifest?.functions.find(f => f.name === selectedFunction);
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ServerIcon className="mr-2" size={24} />
            MCP Manager
          </CardTitle>
          <CardDescription>
            Model Context Protocol (MCP) interface for ScriptBuddy
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="api-key" className="flex items-center mb-2">
              <KeyIcon className="mr-2" size={16} />
              API Key
            </Label>
            <div className="flex gap-2">
              <Input 
                id="api-key"
                type="password"
                placeholder="Enter your MCP_SECRET API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Set as MCP_SECRET environment variable in Supabase Edge Functions
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="functions">
            <TabsList className="mb-4">
              <TabsTrigger value="functions">Functions</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="functions">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-[500px] flex flex-col">
                  <CardHeader>
                    <CardTitle>Available Functions</CardTitle>
                    <CardDescription>
                      {manifest ? `${manifest.functions.length} functions available` : 'Loading...'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-1">
                        {loadingManifest ? (
                          <p className="text-center py-4 text-muted-foreground">Loading functions...</p>
                        ) : manifest ? (
                          <Accordion type="single" collapsible className="w-full">
                            {manifest.functions
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((func) => {
                                const [namespace, name] = func.name.split('.');
                                return (
                                  <AccordionItem value={func.name} key={func.name}>
                                    <AccordionTrigger className="text-sm">
                                      <span className="font-mono">
                                        <span className="text-muted-foreground">{namespace}.</span>
                                        <span className="font-semibold">{name}</span>
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <p className="text-sm mb-2">{func.description}</p>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFunctionSelect(func.name)}
                                      >
                                        Select
                                      </Button>
                                    </AccordionContent>
                                  </AccordionItem>
                                );
                            })}
                          </Accordion>
                        ) : (
                          <p className="text-center py-4 text-muted-foreground">Failed to load functions</p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fetchManifest}
                      disabled={loadingManifest}
                      className="w-full"
                    >
                      Refresh Functions
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="md:col-span-2 h-[500px] flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      {selectedFunction ? (
                        <span className="font-mono">{selectedFunction}</span>
                      ) : (
                        'Select a function'
                      )}
                    </CardTitle>
                    <CardDescription>
                      {selectedFunctionDetails?.description || 'Choose a function from the list to execute'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-auto">
                    {selectedFunctionDetails ? (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Parameters</h3>
                        <ScrollArea className="h-[200px] pr-4">
                          {Object.entries(selectedFunctionDetails.parameters).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No parameters required</p>
                          ) : (
                            <div className="space-y-4">
                              {Object.entries(selectedFunctionDetails.parameters).map(([name, param]) => (
                                <div key={name} className="space-y-2">
                                  <Label htmlFor={`param-${name}`} className="flex items-center">
                                    <span className="font-mono">{name}</span>
                                    {param.required && (
                                      <span className="ml-2 text-red-500 text-xs">Required</span>
                                    )}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">{param.description}</p>
                                  
                                  {param.enum ? (
                                    <select
                                      id={`param-${name}`}
                                      className="w-full p-2 border rounded"
                                      value={functionArgs[name] || ''}
                                      onChange={(e) => handleArgChange(name, e.target.value)}
                                    >
                                      <option value="">Select {name}</option>
                                      {param.enum.map((value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <Input
                                      id={`param-${name}`}
                                      type={param.type === 'number' ? 'number' : 'text'}
                                      placeholder={`Enter ${name}`}
                                      value={functionArgs[name] || ''}
                                      onChange={(e) => handleArgChange(
                                        name, 
                                        param.type === 'number' ? Number(e.target.value) : e.target.value
                                      )}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                        
                        <div className="pt-4">
                          <Button
                            onClick={executeFunction}
                            disabled={executing || !apiKey}
                            className="w-full"
                          >
                            {executing ? 'Executing...' : 'Execute Function'}
                          </Button>
                        </div>
                        
                        {executeResult && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Result</h3>
                            <div className="bg-muted rounded-md p-3 overflow-auto max-h-[200px]">
                              <pre className="text-xs whitespace-pre-wrap">
                                {JSON.stringify(executeResult, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <CodeIcon size={32} className="mx-auto mb-2" />
                          <p>Select a function from the list to get started</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>MCP Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingStatus ? (
                    <p className="text-center py-4 text-muted-foreground">Loading status...</p>
                  ) : status ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Status</h3>
                          <p className="text-sm">{status.status}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Timestamp</h3>
                          <p className="text-sm">{status.timestamp}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Available Functions</h3>
                        <ScrollArea className="h-[200px] border rounded-md p-3">
                          <ul className="space-y-1">
                            {status.functions?.map((func: string) => (
                              <li key={func} className="text-sm font-mono">{func}</li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">Failed to load status</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={fetchStatus}
                    disabled={loadingStatus}
                    className="w-full"
                  >
                    Refresh Status
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default McpManager;
