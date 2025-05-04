
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to check if the user is already logged in
 * Redirects to home if a session exists
 */
export const useSessionCheck = () => {
  const [loading, setLoading] = useState(false); 
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
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
    
    checkUser();
  }, [navigate, t]);

  return {
    loading,
    authError,
    setLoading,
    setAuthError
  };
};
