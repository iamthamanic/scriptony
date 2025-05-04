
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GoogleLoginButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Define a custom response type to handle both fetch Response and error case
interface CustomResponse {
  ok: boolean;
  status: string | number;
  statusText: string;
  type?: string; // Make type optional since our custom response may not have it
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ loading, setLoading }) => {
  const { t } = useTranslation();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [currentURL, setCurrentURL] = useState<string>("");
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);
  const [connectionTestResult, setConnectionTestResult] = useState<string | null>(null);
  
  // Capture initial URL
  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  // Log auth settings on component mount for debugging
  useEffect(() => {
    console.log("======== GOOGLE AUTH DEBUGGING INFO ========");
    console.log("Current URL origin:", window.location.origin);
    console.log("Current full URL:", window.location.href);
    console.log("Current path:", window.location.pathname);
    console.log("Supabase project URL: https://suvxmnrnldfhfwxvkntv.supabase.co");
    console.log("Supabase callback URL: https://suvxmnrnldfhfwxvkntv.supabase.co/auth/v1/callback");
    console.log("==========================================");

    // Test connectivity to Google and Supabase domains
    testConnectivity();
  }, []);
  
  const testConnectivity = async () => {
    try {
      // Test connection to Supabase
      let supabaseResponse: CustomResponse;
      try {
        const response = await fetch("https://suvxmnrnldfhfwxvkntv.supabase.co/auth/v1/health", {
          method: "GET",
          mode: 'cors',
        });
        supabaseResponse = response;
      } catch (error) {
        supabaseResponse = { 
          ok: false, 
          status: "network-error", 
          statusText: error instanceof Error ? error.message : String(error) 
        };
      }
      
      console.log("Supabase connectivity test:", 
        supabaseResponse.ok ? "SUCCESS" : "FAILED", 
        supabaseResponse.status || "network-error"
      );

      // Test connection to Google
      let googleResponse: CustomResponse;
      try {
        const response = await fetch("https://accounts.google.com/favicon.ico", {
          method: "GET",
          mode: 'no-cors', // Using no-cors since we just want to check if the connection works
        });
        googleResponse = response;
      } catch (error) {
        googleResponse = { 
          ok: false, 
          status: "network-error", 
          statusText: error instanceof Error ? error.message : String(error) 
        };
      }
      
      // For no-cors mode, we can't access response properties directly
      // But if we got here without an error, the request likely completed
      const googleSuccess = googleResponse.ok || (googleResponse as Response).type === 'opaque';
      console.log("Google connectivity test completed:", googleSuccess ? "SUCCESS (opaque response)" : "FAILED");
      
      setConnectionTestResult(`Supabase: ${supabaseResponse.ok ? "OK" : "Failed"}, Google: ${googleSuccess ? "OK" : "Failed"}`);
    } catch (error) {
      console.error("Connectivity test error:", error);
      setConnectionTestResult(`Connectivity test error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorDetails(null);
      
      console.log("======== STARTING GOOGLE LOGIN PROCESS ========");
      console.log("Browser location:", window.location.href);
      
      // We'll try to detect potential CORS issues
      console.log("Testing if we have connectivity to Supabase and Google...");
      await testConnectivity();
      
      // Explicitly set redirectTo to ensure consistent behavior across environments
      const redirectUrl = `${window.location.origin}/auth`;
      console.log("Setting explicit redirectTo URL:", redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          scopes: 'email profile',
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          }
        }
      });
      
      if (error) {
        console.error("Google Login Error Details:", error);
        let errorMessage = error.message || 'Unknown error';
        
        // Provide more specific error messages for common issues
        if (errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Connection to authentication service failed. Possible CORS issue.';
        } else if (errorMessage.includes('redirect_uri_mismatch')) {
          errorMessage = 'Redirect URL mismatch. Check Google Console configuration.';
        } else if (errorMessage.includes('invalid_client')) {
          errorMessage = 'Invalid client configuration. Verify Google API credentials.';
        } else if (errorMessage.includes('unauthorized_client')) {
          errorMessage = 'Unauthorized client. Verify domain authorization in Google Console.';
        } else if (error.status === 401 || errorMessage.includes('401')) {
          errorMessage = 'Authorization failed (401). Check API credentials and domain verification.';
        } else if (errorMessage.includes('Network Error') || errorMessage.includes('connection refused')) {
          errorMessage = 'Network connection to authentication provider failed. Check your connection and firewall settings.';
        }
        
        setErrorDetails(errorMessage);
        toast.error(`${t('auth.error.google')}: ${errorMessage}`);
      } else if (!data.url) {
        console.error("Google Login Failed: No redirect URL returned");
        setErrorDetails('No redirect URL returned from authentication service');
        toast.error(t('auth.error.google'));
      } else {
        console.log("======== GOOGLE AUTH URL RECEIVED ========");
        
        // URL debugging information
        try {
          const urlObj = new URL(data.url);
          console.log("Auth URL host:", urlObj.host);
          console.log("Auth URL pathname:", urlObj.pathname);
          console.log("Auth URL search:", urlObj.search);
          
          // Log all params except sensitive tokens
          console.log("Auth URL parameters:");
          urlObj.searchParams.forEach((value, key) => {
            if (key === 'access_token' || key === 'refresh_token') {
              console.log(`Query param: ${key} = [TOKEN HIDDEN]`);
            } else {
              console.log(`Query param: ${key} = ${value}`);
            }
          });
          
          // Log specifically if redirect_uri parameter is present
          const redirectUri = urlObj.searchParams.get('redirect_uri');
          if (redirectUri) {
            console.log("Found redirect_uri in auth URL:", redirectUri);
          } else {
            console.log("No redirect_uri parameter found in auth URL");
          }
          
          console.log("Redirecting to Google authentication URL now...");
          
          // Redirect to Google auth URL
          window.location.href = data.url;
        } catch (e) {
          console.error("Could not parse URL:", e);
          setErrorDetails(`URL parsing error: ${e instanceof Error ? e.message : String(e)}`);
          toast.error(`${t('auth.error.google')}: URL parsing error`);
        }
      }
    } catch (error: any) {
      console.error("Google Login Exception:", error);
      setErrorDetails(`Exception: ${error.message || 'Unknown error'}`);
      toast.error(`${t('auth.error.google')}: ${error.message || 'Unknown error'}`);
    } finally {
      if (errorDetails) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <Button 
        variant="outline" 
        className="w-full flex items-center gap-2" 
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {loading ? t('common.loadingEllipsis') : t('common.continueWithGoogle')}
      </Button>
      
      {errorDetails && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Google Login Error</AlertTitle>
          <AlertDescription className="text-sm">
            {errorDetails}
            <p className="mt-2 text-xs">
              Please verify Google OAuth settings in Google Cloud Console and Supabase.
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-1 text-xs"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
            >
              {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {errorDetails && showDebugInfo && (
        <div className="mt-2 p-3 bg-muted/50 rounded-md border text-xs font-mono overflow-x-auto space-y-1">
          <p><strong>Current URL:</strong> {currentURL}</p>
          <p><strong>Redirect URL:</strong> {window.location.origin}/auth</p>
          <p><strong>Supabase Project:</strong> suvxmnrnldfhfwxvkntv.supabase.co</p>
          {connectionTestResult && (
            <p><strong>Connection Test:</strong> {connectionTestResult}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            This debugging information may be helpful for configuration troubleshooting.
          </p>
          <div className="mt-4 p-2 bg-background rounded border border-destructive/40">
            <p className="font-semibold text-destructive">Google connection refused error</p>
            <p className="mt-1">
              This error often occurs when there are network issues or incorrect configuration between 
              your application and Google's authentication servers. Please check:
            </p>
            <ol className="list-decimal pl-4 mt-2 space-y-1">
              <li>Your network connection and firewall settings</li>
              <li>That the Google OAuth Consent Screen is properly configured</li>
              <li>That the Google OAuth Client ID and Secret are correctly set in Supabase</li>
              <li>That all required domains are authorized in Google Cloud Console</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
