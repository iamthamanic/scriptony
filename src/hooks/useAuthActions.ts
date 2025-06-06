
import { useState } from "react";
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";

/**
 * Custom hook to provide authentication actions (sign out, etc.)
 */
export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    try {
      setLoading(true);
      await customSupabase.auth.signOut();
      toast.success("Successfully signed out");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return {
    signOut,
    loading
  };
};
