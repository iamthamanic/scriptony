
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isDevelopmentMode } from '@/utils/devMode';

export const useRedirectUnauthenticated = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const devMode = isDevelopmentMode();

  useEffect(() => {
    // If user is not logged in and we're not in dev mode, redirect to auth page
    if (!loading && !user && !devMode) {
      console.log('Redirecting to auth page, no user found and not in dev mode');
      navigate('/auth', { state: { from: location.pathname } });
    }
    
    // If we're in development mode and not authenticated, log it but don't redirect
    if (!loading && !user && devMode) {
      console.log('Development mode active: allowing access without authentication');
    }
  }, [user, loading, navigate, location.pathname, devMode]);

  return { user, loading, devMode };
};
