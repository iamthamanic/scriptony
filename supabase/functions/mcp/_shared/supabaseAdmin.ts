
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
import { corsHeaders } from './cors.ts';

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
      headers: { 'X-Client-Info': 'supabase-edge-function' },
    },
  }
);

// Export the corsHeaders for convenience
export { corsHeaders };
