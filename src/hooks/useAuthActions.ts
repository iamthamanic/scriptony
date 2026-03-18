import { useCallback } from "react";
import { authApi } from "@/api";
import { useToast } from "./use-toast";

export function useAuthActions() {
  const { toast } = useToast();

  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await authApi.signOut();
      if (error) {
        throw new Error(error.message);
      }
      toast.success("Abmeldung erfolgreich");
    } catch (error: unknown) {
      console.error("Error signing out:", error);
      const errorMessage = error instanceof Error ? error.message : "Abmeldung fehlgeschlagen";
      toast.error(errorMessage);
    }
  }, [toast]);

  const handlePasswordReset = useCallback(async (email: string) => {
    try {
      const { error } = await authApi.resetPassword(email);
      if (error) {
        throw new Error(error.message);
      }
      toast.success("Passwort-Reset-Link sent");
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      const errorMessage = error instanceof Error ? error.message : "Passwort-Reset fehlgeschlagen";
      toast.error(errorMessage);
    }
  }, [toast]);

  return {
    handleSignOut,
    handlePasswordReset,
  };
}
