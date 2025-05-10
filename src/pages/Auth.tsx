
import React from 'react';
import AuthContainer from '@/components/auth/AuthContainer';
import { useAuth } from '@/hooks/useAuthState';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <AuthContainer 
      title="Welcome"
      description="Sign in to your account to continue"
      footer={null}
    >
      <div className="space-y-4">
        {/* Auth form content will be rendered here */}
        <p className="text-muted-foreground text-center">
          Please sign in or register to continue
        </p>
      </div>
    </AuthContainer>
  );
};

export default Auth;
