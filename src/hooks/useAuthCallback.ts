
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to handle OAuth callbacks
 * Detects and processes authentication callback parameters
 */
export const useAuthCallback = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Additional logging for debugging OAuth flows
    console.log("======== AUTH CALLBACK DEBUGGING INFO ========");
    console.log("Current URL:", window.location.href);
    console.log("URL hash:", window.location.hash);
    console.log("URL search:", window.location.search);
    console.log("==========================================");
    
    // If URL has hash parameters or specific query parameters, we might be in an OAuth callback
    if (window.location.hash || 
        window.location.search.includes('access_token') || 
        window.location.search.includes('error')) {
      console.log("Detected potential OAuth callback parameters");
      setLoading(true);
      
      handleOAuthCallback();
    }
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Check for error parameter which might indicate a problem with the OAuth flow
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (errorParam) {
        console.error("OAuth error details:", errorParam, errorDescription);
        setAuthError(`Google login error: ${errorDescription || errorParam}`);
        toast.error(`${t('auth.error.oauth')}: ${errorDescription || errorParam}`);
        setLoading(false);
        return;
      }
      
      // Let Supabase handle the hash fragment or query parameters
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("OAuth callback processing error:", error);
        setAuthError(`OAuth processing error: ${error.message}`);
        toast.error(t('auth.error.oauth'));
      } else if (data.session) {
        console.log("OAuth login successful, redirecting to home");
        toast.success(t('auth.loginSuccess'));
        navigate('/');
      } else {
        console.log("OAuth callback received but no session established");
        setAuthError("Login completed but no user session was created");
      }
    } catch (err: any) {
      console.error("Error processing OAuth response:", err);
      setAuthError(`OAuth processing failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    authError,
    setAuthError
  };
};
