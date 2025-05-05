
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

/**
 * Validates an API key against stored tokens in the database
 */
export async function validateApiKey(req: Request): Promise<{ valid: boolean, scopes?: any[] }> {
  // Get the Authorization header
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For backward compatibility, check if the MCP_SECRET is set
    const secretKey = Deno.env.get('MCP_SECRET');
    
    if (secretKey) {
      // If the MCP_SECRET environment variable exists, validate against that for backward compatibility
      const apiKey = authHeader?.split(' ')[1];
      if (apiKey === secretKey) {
        return { valid: true, scopes: ['*'] }; // Allow all scopes for legacy key
      }
    }
    
    return { valid: false };
  }

  // Extract the API key
  const token = authHeader.split(' ')[1];
  
  // Check against database tokens
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Find token in database
    const { data, error } = await supabase
      .from('mcp_tokens')
      .select('scopes, is_active, expires_at, user_id, call_count')
      .eq('token', token)
      .single();
    
    if (error || !data) {
      console.error('Token validation error:', error || 'Token not found');
      return { valid: false };
    }
    
    // Check if token is active
    if (!data.is_active) {
      console.error('Token is deactivated');
      return { valid: false };
    }
    
    // Check if token is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.error('Token is expired');
      return { valid: false };
    }
    
    // Update last used and increment call count
    await supabase
      .from('mcp_tokens')
      .update({ 
        last_used_at: new Date().toISOString(),
        call_count: data.call_count + 1
      })
      .eq('token', token);
    
    return { valid: true, scopes: data.scopes };
    
  } catch (err) {
    console.error('Error validating token:', err);
    return { valid: false };
  }
}
