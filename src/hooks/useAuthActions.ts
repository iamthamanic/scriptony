
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorContext } from '@/contexts/ErrorContext';

/**
 * Custom hook to provide authentication actions (sign out, etc.)
 */
export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const { addError } = useErrorContext();

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
      addError({
        message: "Sign Out Error",
        details: `Failed to sign out: ${error.message}`,
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signOut,
    loading
  };
};
