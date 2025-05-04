import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import AuthContainer from '@/components/auth/AuthContainer';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import AuthSwitcher from '@/components/auth/AuthSwitcher';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    // Additional logging for debugging OAuth flows
    console.log("======== AUTH PAGE DEBUGGING INFO ========");
    console.log("Current URL:", window.location.href);
    console.log("URL hash:", window.location.hash);
    console.log("URL search:", window.location.search);
    console.log("Location state:", location.state);
    console.log("==========================================");
    
    // Check if state has mode parameter to determine login or register
    if (location.state?.mode === 'login') {
      setIsLogin(true);
      setIsPasswordReset(false);
    } else if (location.state?.mode === 'register') {
      setIsLogin(false);
      setIsPasswordReset(false);
    } else if (location.state?.mode === 'reset') {
      setIsPasswordReset(true);
      setIsLogin(false);
    }
    
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        // Show loading state
        setLoading(true);
        setAuthError(null);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Auth page - checking session:", session ? "User logged in" : "No session");
        
        if (error) {
          console.error("Error checking session:", error);
          setAuthError(`Session check error: ${error.message}`);
        } else if (session) {
          console.log("User is already logged in, redirecting to home");
          toast.info(t('auth.alreadyLoggedIn'));
          navigate('/');
        }
      } catch (error: any) {
        console.error("Error checking authentication:", error);
        setAuthError(`Authentication check failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    // Check for hash fragment that indicates OAuth response
    const handleOAuthCallback = async () => {
      // If URL has hash parameters or specific query parameters, we might be in an OAuth callback
      if (window.location.hash || window.location.search.includes('access_token') || window.location.search.includes('error')) {
        console.log("Detected potential OAuth callback parameters");
        setLoading(true);
        
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
      } else {
        checkUser();
      }
    };
    
    handleOAuthCallback();
  }, [location.state, navigate, t]);

  const toggleMode = () => {
    if (isPasswordReset) {
      setIsPasswordReset(false);
      setIsLogin(true);
    } else {
      setIsLogin(!isLogin);
    }
    setAuthError(null); // Clear errors when switching modes
  };

  const togglePasswordReset = () => {
    setIsPasswordReset(!isPasswordReset);
    setAuthError(null); // Clear errors when switching modes
  };

  const getAuthTitle = () => {
    if (isPasswordReset) {
      return t('auth.forgotPassword');
    } else if (isLogin) {
      return t('common.welcome');
    } else {
      return t('common.createAccount');
    }
  };

  const getAuthDescription = () => {
    if (isPasswordReset) {
      return t('auth.enterEmailForReset');
    } else if (isLogin) {
      return t('common.loginTo');
    } else {
      return t('common.joinCommunity');
    }
  };

  const renderAuthContent = () => {
    if (isPasswordReset) {
      return (
        <PasswordResetForm 
          loading={loading} 
          setLoading={setLoading} 
          onSuccess={() => {
            setIsPasswordReset(false);
            setIsLogin(true);
            setAuthError(null);
          }}
        />
      );
    }

    return (
      <div className="space-y-4">
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        <GoogleLoginButton loading={loading} setLoading={setLoading} />
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-xs text-muted-foreground">
              {t('common.or')}
            </span>
          </div>
        </div>

        {isLogin ? (
          <LoginForm 
            loading={loading} 
            setLoading={setLoading} 
            onForgotPassword={togglePasswordReset} 
          />
        ) : (
          <RegisterForm 
            loading={loading} 
            setLoading={setLoading} 
            onSuccess={() => {
              setIsLogin(true);
              setAuthError(null);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <AuthContainer
      title={getAuthTitle()}
      description={getAuthDescription()}
      footer={
        <AuthSwitcher 
          isLogin={isLogin} 
          isPasswordReset={isPasswordReset} 
          onToggle={toggleMode}
        />
      }
    >
      {renderAuthContent()}
    </AuthContainer>
  );
};

export default Auth;
