
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AuthContainer from '@/components/auth/AuthContainer';
import AuthContent from '@/components/auth/AuthContent';
import AuthSwitcher from '@/components/auth/AuthSwitcher';

import { useAuthState } from '@/hooks/useAuthState';
import { useAuthCallback } from '@/hooks/useAuthCallback';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import { isDevelopmentMode } from '@/utils/devMode';
import { toast } from 'sonner';

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Auth mode state management (login, register, password reset)
  const { isLogin, isPasswordReset, toggleMode, togglePasswordReset } = useAuthState();
  
  // Process OAuth callbacks if present in URL
  const callbackHandler = useAuthCallback();

  // Check if user is already logged in
  const sessionHandler = useSessionCheck();
  
  // Check if we're in development mode
  useEffect(() => {
    const devMode = isDevelopmentMode();
    if (devMode) {
      toast.info("Development Mode: Redirecting to home page");
      navigate('/');
    }
  }, [navigate]);
  
  // Combine state from hooks
  const [loading, setLoading] = useState(
    callbackHandler.loading || sessionHandler.loading
  );
  const [authError, setAuthError] = useState<string | null>(
    callbackHandler.authError || sessionHandler.authError
  );

  // Success handler for forms
  const handleAuthSuccess = () => {
    // Switch back to login after registration or password reset
    if (!isLogin) {
      toggleMode();
    }
    setAuthError(null);
  };

  // Get title and description based on current auth mode
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
      <AuthContent
        loading={loading}
        setLoading={setLoading}
        authError={authError}
        setAuthError={setAuthError}
        isLogin={isLogin}
        isPasswordReset={isPasswordReset}
        togglePasswordReset={togglePasswordReset}
        onAuthSuccess={handleAuthSuccess}
      />
    </AuthContainer>
  );
};

export default Auth;
