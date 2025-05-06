
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    // Path parameter to determine which credentials to return
    const { service } = await req.json();

    let clientId: string | null;
    let clientSecret: string | null;

    // Determine which credentials to return based on service parameter
    if (service === "auth") {
      // Google Auth credentials
      clientId = "1021623717075-t1ugq54l5omei2nn73a63r7vlae2cggk.apps.googleusercontent.com";
      clientSecret = "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";
    } else {
      // Default to Google Drive credentials
      clientId = "336644646972-6ku9cjco0scifhu85qnmgquh8o6gj10c.apps.googleusercontent.com";
      clientSecret = "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";
    }

    if (!clientId || !clientSecret) {
      throw new Error("Google OAuth credentials are not configured");
    }

    // Return the credentials as JSON
    return new Response(
      JSON.stringify({
        clientId,
        clientSecret,
        status: "success",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        status: "error",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
