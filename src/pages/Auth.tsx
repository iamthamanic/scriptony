
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Separator } from "@/components/ui/separator";

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
  const { t } = useTranslation();
  
  useEffect(() => {
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
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    
    checkUser();
  }, [location.state, navigate]);

  const toggleMode = () => {
    if (isPasswordReset) {
      setIsPasswordReset(false);
      setIsLogin(true);
    } else {
      setIsLogin(!isLogin);
    }
  };

  const togglePasswordReset = () => {
    setIsPasswordReset(!isPasswordReset);
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
          }}
        />
      );
    }

    return (
      <div className="space-y-4">
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
            onSuccess={() => setIsLogin(true)}
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
