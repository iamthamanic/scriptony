import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GoogleLoginButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ loading, setLoading }) => {
  const { t } = useTranslation();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Log auth settings on component mount for debugging
  useEffect(() => {
    console.log("Current URL origin:", window.location.origin);
    console.log("Current full URL:", window.location.href);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorDetails(null);
      
      // Generate the redirect URL based on the current origin
      // This is where users will be sent AFTER successful authentication
      const redirectTo = window.location.origin;
      console.log("Starting Google login with redirect URL:", redirectTo);
      
      // Log hostname information for debugging
      console.log("Current hostname:", window.location.hostname);
      console.log("Current domain:", window.location.origin);
      
      // Important: Supabase will handle the callback internally through:
      // https://suvxmnrnldfhfwxvkntv.supabase.co/auth/v1/callback
      // We just need to specify where to go after the whole flow completes
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          scopes: 'email profile',
          queryParams: {
            prompt: 'select_account', // Force account selection even when already signed in
            access_type: 'offline',   // Get refresh token for server side use
          }
        }
      });
      
      if (error) {
        console.error("Google Login Error:", error);
        setErrorDetails(`${error.message || 'Unknown error'}`);
        toast.error(`${t('auth.error.google')}: ${error.message}`);
      } else if (!data.url) {
        console.error("Google Login Failed: No redirect URL returned");
        setErrorDetails('No redirect URL returned');
        toast.error(t('auth.error.google'));
      } else {
        console.log("Redirecting to Google auth URL:", data.url);
        
        // Parse the URL for debugging information
        try {
          const urlObj = new URL(data.url);
          console.log("Auth flow URL:", data.url);
          console.log("Auth URL host:", urlObj.host);
          console.log("Auth URL pathname:", urlObj.pathname);
          
          // Log all query parameters for debugging
          console.log("Auth URL parameters:");
          urlObj.searchParams.forEach((value, key) => {
            // Don't log the entire token for security reasons
            if (key === 'access_token' || key === 'refresh_token') {
              console.log(`Query param: ${key} = [TOKEN HIDDEN]`);
            } else {
              console.log(`Query param: ${key} = ${value}`);
            }
          });
          
          // Redirect to Google's authentication page
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
      // Keep loading true if we're redirecting, set to false only if there was an error
      if (errorDetails) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full">
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
        <div className="mt-2 text-destructive text-sm">
          <p>Connection error: {errorDetails}</p>
          <p className="text-xs mt-1">Please verify Google OAuth settings in your Google Cloud Console.</p>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
