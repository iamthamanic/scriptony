
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Check if we're in development mode
const isDevelopmentMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('devMode') || window.location.hostname.includes('lovableproject.com');
};

export const useRedirectUnauthenticated = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const devMode = isDevelopmentMode();

  useEffect(() => {
    if (!loading && !user && !devMode) {
      navigate('/landing', { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location.pathname, devMode]);

  return { user, loading, devMode };
};
