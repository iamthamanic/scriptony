
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

interface AuthContentProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  isLogin: boolean;
  isPasswordReset: boolean;
  togglePasswordReset: () => void;
  onAuthSuccess: () => void;
}

const AuthContent: React.FC<AuthContentProps> = ({
  loading,
  setLoading,
  authError,
  setAuthError,
  isLogin,
  isPasswordReset,
  togglePasswordReset,
  onAuthSuccess
}) => {
  const { t } = useTranslation();

  if (isPasswordReset) {
    return (
      <PasswordResetForm 
        loading={loading} 
        setLoading={setLoading} 
        onSuccess={() => {
          onAuthSuccess();
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
            onAuthSuccess();
            setAuthError(null);
          }}
        />
      )}
    </div>
  );
};

export default AuthContent;
