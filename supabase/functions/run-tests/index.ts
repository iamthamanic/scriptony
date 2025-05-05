
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: { 'X-Client-Info': 'supabase-edge-function' },
    },
  }
);

// Response headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Basic helper for running a test by ID
async function runTest(testId: string) {
  // Fetch the test definition
  const { data: test, error: testError } = await supabaseAdmin
    .from('test_definitions')
    .select('*')
    .eq('id', testId)
    .single();
    
  if (testError) throw testError;
  
  if (!test) {
    throw new Error(`Test with ID ${testId} not found`);
  }
  
  // Create an initial test result entry
  const { data: testResult, error: resultError } = await supabaseAdmin
    .from('test_results')
    .insert({
      test_id: testId,
      status: 'pending',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (resultError) throw resultError;
  
  // Mock test execution (will be replaced with real test execution later)
  console.log(`Executing test: ${test.name} (${test.test_type})`);
  
  // For demo purposes: 70% pass rate
  const executionResult = {
    success: Math.random() > 0.3,
    executionTime: Math.floor(Math.random() * 5000) + 100,
    errorMessage: null
  };
  
  if (!executionResult.success) {
    executionResult.errorMessage = 'Mock error: Test failed during execution';
  }
  
  // Update the test result
  const { error: updateError } = await supabaseAdmin
    .from('test_results')
    .update({
      status: executionResult.success ? 'passed' : 'failed',
      error_message: executionResult.errorMessage,
      execution_time: executionResult.executionTime,
      metadata: { 
        executedAt: new Date().toISOString(),
        browserInfo: 'Scheduled Test - Mock Browser',
        deviceInfo: 'Edge Function'
      }
    })
    .eq('id', testResult.id);
    
  if (updateError) throw updateError;
  
  // For demo purposes, create a mock screenshot if the test failed
  if (!executionResult.success) {
    await supabaseAdmin
      .from('test_screenshots')
      .insert({
        test_result_id: testResult.id,
        screenshot_url: 'https://via.placeholder.com/800x600?text=Scheduled+Test+Error',
        step_name: 'Error occurred during automated test run'
      });
  }
  
  return {
    testId,
    testName: test.name,
    status: executionResult.success ? 'passed' : 'failed',
    executionTime: executionResult.executionTime,
    errorMessage: executionResult.errorMessage
  };
}

async function runAllTests() {
  // Get all tests
  const { data: tests, error } = await supabaseAdmin
    .from('test_definitions')
    .select('id, name, priority');
    
  if (error) throw error;
  
  const results = [];
  let passedCount = 0;
  let failedCount = 0;
  
  // Run each test
  for (const test of tests) {
    try {
      const result = await runTest(test.id);
      results.push(result);
      
      if (result.status === 'passed') {
        passedCount++;
      } else {
        failedCount++;
      }
    } catch (err) {
      console.error(`Error running test ${test.name}:`, err);
      results.push({
        testId: test.id,
        testName: test.name,
        status: 'error',
        errorMessage: err.message
      });
      failedCount++;
    }
  }
  
  // Create a log entry for the entire run
  await supabaseAdmin
    .from('test_run_logs')
    .insert({
      run_date: new Date().toISOString(),
      total_tests: tests.length,
      passed_tests: passedCount,
      failed_tests: failedCount,
      is_scheduled: true
    });
  
  return {
    timestamp: new Date().toISOString(),
    totalTests: tests.length,
    passedTests: passedCount,
    failedTests: failedCount,
    results
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  try {
    // Authentication check (optional for cron jobs)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader && req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Run all tests
    console.log('Starting scheduled test run: ' + new Date().toISOString());
    const results = await runAllTests();
    console.log('Completed test run. Results:', results);
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error during test run:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
