
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to manage authentication state (login, register, password reset)
 */
export const useAuthState = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const location = useLocation();

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
  }, [location.state]);

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

  return {
    isLogin,
    isPasswordReset,
    toggleMode,
    togglePasswordReset
  };
};
