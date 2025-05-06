
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

// Define the corsHeaders here instead of importing them
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-dev-mode',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Check for development mode
const isDevMode = () => {
  const devModeHeader = Deno.env.get('X_DEV_MODE') === 'true';
  return devModeHeader;
};

// Create Supabase client headers
const getHeaders = () => {
  const headers: Record<string, string> = { 'X-Client-Info': 'supabase-edge-function' };
  
  // Add development mode header if enabled
  if (isDevMode()) {
    headers['x-dev-mode'] = 'true';
    console.log("Development mode headers applied to Supabase admin client");
  }
  
  return headers;
};

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: getHeaders(),
    },
  }
);
