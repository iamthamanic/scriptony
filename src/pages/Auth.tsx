
import React from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';
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

  return <AuthContainer />;
};

export default Auth;
