
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { validateApiKey } from '../_shared/auth.ts';
import { router } from './router.ts';
import { generateManifest } from './manifest.ts';

console.log('MCP API endpoint started');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Return manifest for /manifest endpoint
    if (path === 'manifest') {
      // Check if token is provided to filter functions
      const authResult = req.headers.get('Authorization') 
        ? await validateApiKey(req) 
        : { valid: true, scopes: undefined };
      
      // Generate manifest, optionally filtering by scopes
      const manifest = await generateManifest(authResult.scopes);
      
      return new Response(JSON.stringify(manifest), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Check API key for execute endpoint
    if (path === 'execute') {
      // Validate the API key before proceeding
      const authResult = await validateApiKey(req);
      
      if (!authResult.valid) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized access. Invalid API key.' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        );
      }

      // Parse request body
      const { function: functionName, args } = await req.json();
      
      if (!functionName) {
        return new Response(
          JSON.stringify({ error: 'Function name is required' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

      // Check if function is in allowed scopes
      const scopes = authResult.scopes || [];
      const hasWildcardAccess = scopes.includes('*');
      
      if (!hasWildcardAccess && !scopes.includes(functionName)) {
        return new Response(
          JSON.stringify({ 
            error: `Access denied. Token does not have permission to execute '${functionName}'` 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403 
          }
        );
      }

      // Log the function call
      console.log(`MCP function call: ${functionName}`, args);

      // Route to the appropriate function
      const result = await router.executeFunction(functionName, args || {});
      
      // Return the result
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Handle status endpoint
    if (path === 'status') {
      const status = {
        status: 'online',
        functions: router.listFunctions(),
        timestamp: new Date().toISOString()
      };
      
      return new Response(JSON.stringify(status), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Handle unknown endpoints
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404 
      }
    );
  } catch (error) {
    console.error('MCP API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
