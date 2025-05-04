
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface GoogleLoginButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ loading, setLoading }) => {
  const { t } = useTranslation();

  // Log auth settings on component mount for debugging
  useEffect(() => {
    console.log("Current URL origin:", window.location.origin);
    console.log("Current full URL:", window.location.href);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // Generate the redirect URL based on the current origin
      const redirectTo = `${window.location.origin}/`;
      console.log("Starting Google login with redirect URL:", redirectTo);
      
      // Log hostname information for debugging
      console.log("Current hostname:", window.location.hostname);
      console.log("Is localhost:", window.location.hostname === 'localhost');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            prompt: 'select_account', // Force account selection even when already signed in
            access_type: 'offline',   // Get refresh token for server side use
          }
        }
      });
      
      if (error) {
        console.error("Google Login Error:", error);
        toast.error(`${t('auth.error.google')}: ${error.message}`);
      } else if (!data.url) {
        console.error("Google Login Failed: No redirect URL returned");
        toast.error(t('auth.error.google'));
      } else {
        console.log("Redirecting to Google auth URL:", data.url);
        
        // Parse the URL to check the redirect_uri parameter
        try {
          const urlObj = new URL(data.url);
          const redirectUri = urlObj.searchParams.get('redirect_uri');
          console.log("Parsed redirect_uri from URL:", redirectUri);
        } catch (e) {
          console.error("Could not parse URL:", e);
        }
        
        // Force redirect using window.location for more reliable navigation
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Google Login Exception:", error);
      toast.error(`${t('auth.error.google')}: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center gap-2" 
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {loading ? t('common.loadingEllipsis') : t('common.continueWithGoogle')}
    </Button>
  );
};

export default GoogleLoginButton;
