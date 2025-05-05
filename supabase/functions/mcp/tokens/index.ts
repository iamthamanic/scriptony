
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../../_shared/cors.ts';

// Generate a random API key
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return 'mcp_' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get JWT from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid Authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const jwt = authHeader.split(' ')[1];
    
    // Verify the JWT and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    // Create a new token
    if (action === 'create' && req.method === 'POST') {
      const { name, scopes = [], expiresIn } = await req.json();
      
      // Validate required fields
      if (!name) {
        return new Response(
          JSON.stringify({ error: 'Token name is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Generate token and preview
      const token = generateToken();
      const tokenPreview = token.slice(-6);
      
      // Calculate expiry date if provided
      let expiresAt = null;
      if (expiresIn) {
        const now = new Date();
        if (expiresIn === '7days') {
          expiresAt = new Date(now.setDate(now.getDate() + 7));
        } else if (expiresIn === '1month') {
          expiresAt = new Date(now.setMonth(now.getMonth() + 1));
        } else if (expiresIn === '6months') {
          expiresAt = new Date(now.setMonth(now.getMonth() + 6));
        }
      }

      // Insert the token into the database
      const { data, error } = await supabase
        .from('mcp_tokens')
        .insert({
          user_id: user.id,
          name,
          token,
          token_preview: tokenPreview,
          scopes,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating token:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create token' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          token: token, // Only sent once when created
          data: {
            id: data.id,
            name: data.name,
            token_preview: data.token_preview,
            created_at: data.created_at,
            expires_at: data.expires_at,
            scopes: data.scopes,
            is_active: data.is_active,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
      );
    }

    // List tokens for the current user
    if (action === 'list' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('mcp_tokens')
        .select('id, name, token_preview, created_at, expires_at, scopes, is_active, call_count, last_used_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error listing tokens:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to retrieve tokens' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Update token (toggle active status)
    if (action === 'update' && req.method === 'POST') {
      const { id, is_active } = await req.json();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Token ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // First verify the token belongs to the user
      const { data: tokenCheck, error: checkError } = await supabase
        .from('mcp_tokens')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (checkError || !tokenCheck) {
        return new Response(
          JSON.stringify({ error: 'Token not found or you do not have permission' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Update the token
      const { data, error } = await supabase
        .from('mcp_tokens')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating token:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update token' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Delete a token
    if (action === 'delete' && req.method === 'DELETE') {
      const { id } = await req.json();

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Token ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // First verify the token belongs to the user
      const { data: tokenCheck, error: checkError } = await supabase
        .from('mcp_tokens')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (checkError || !tokenCheck) {
        return new Response(
          JSON.stringify({ error: 'Token not found or you do not have permission' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Delete the token
      const { error } = await supabase
        .from('mcp_tokens')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting token:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to delete token' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Unsupported action
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    );
  } catch (error) {
    console.error('MCP token management error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
