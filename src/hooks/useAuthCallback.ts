
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";

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
    
    // Check for possible error parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (errorParam) {
      console.error("OAuth error detected in URL:", errorParam, errorDescription);
      
      // Check for specific error types
      if (errorDescription?.includes('connection refused') || errorParam.includes('connection_refused')) {
        const errorMessage = `Google Login Error: Connection refused. This could be due to network issues, firewall settings, or incorrect configuration.`;
        setAuthError(errorMessage);
        toast.error(errorMessage);
      } else {
        setAuthError(`Google login error: ${errorDescription || errorParam}`);
        toast.error(`${t('auth.error.oauth')}: ${errorDescription || errorParam}`);
      }
      
      setLoading(false);
      return;
    }
    
    // If URL has hash parameters or specific query parameters, we might be in an OAuth callback
    if (window.location.hash || 
        window.location.search.includes('access_token') || 
        window.location.search.includes('code')) {
      console.log("Detected potential OAuth callback parameters");
      setLoading(true);
      
      handleOAuthCallback();
    }
  }, []);

  const handleOAuthCallback = async () => {
    try {
      console.log("Processing OAuth callback...");
      
      // Test connectivity to Supabase before proceeding
      try {
        const response = await fetch("https://suvxmnrnldfhfwxvkntv.supabase.co/auth/v1/health");
        console.log("Supabase health check:", response.ok ? "SUCCESS" : "FAILED", response.status);
        
        if (!response.ok) {
          throw new Error(`Supabase health check failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Supabase connectivity error:", error);
      }
      
      // Let Supabase handle the hash fragment or query parameters
      const { data, error } = await customSupabase.auth.getSession();
      
      console.log("Session check result:", data ? "Session data received" : "No session data");
      if (error) {
        console.error("OAuth callback processing error:", error);
        
        // Provide more specific error messages
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          setAuthError(`Network connection issue: Unable to reach authentication service. Please check your internet connection and try again.`);
        } else {
          setAuthError(`OAuth processing error: ${error.message}`);
        }
        
        toast.error(t('auth.error.oauth'));
      } else if (data.session) {
        console.log("OAuth login successful, redirecting to home");
        console.log("User email:", data.session.user?.email);
        console.log("Auth provider:", data.session.user?.app_metadata?.provider);
        toast.success(t('auth.loginSuccess'));
        navigate('/');
      } else {
        console.log("OAuth callback received but no session established");
        setAuthError("Login completed but no user session was created");
        
        // This might be a case where user needs to try again
        toast.error(t('auth.error.noSession'));
      }
    } catch (err: any) {
      console.error("Error processing OAuth response:", err);
      
      // Customized error message for connection refused
      if (err.message?.includes('connection refused') || err.message?.includes('Network Error')) {
        setAuthError(`Connection to authentication service failed. This could be due to network issues or incorrect configuration.`);
      } else {
        setAuthError(`OAuth processing failed: ${err.message}`);
      }
      
      toast.error(`${t('auth.error.oauth')}: ${err.message || 'Unknown error'}`);
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
