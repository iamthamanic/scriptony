import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { toast } from "sonner";
import { authApi, apiClient } from "../api";

export function useOAuthCallback() {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const hasCallback = Boolean(code && state);

    if (hasCallback) {
      handleOAuthCallback(code!, state!);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleOAuthCallback(code: string, state: string) {
    setProcessing(true);
    setError(null);
    setErrorDetails(null);

    try {
      const { data, error } = await authApi.handleOAuthCallback(code, state);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Store token and update API client
        localStorage.setItem("token", data.token);
        apiClient.setToken(data.token);

        toast.success("Anmeldung erfolgreich!", {
          description: `Willkommen zurück, ${data.user.username}!`,
        });

        // Redirect to home page
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      console.error("OAuth callback error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError("OAuth Verarbeitung fehlgeschlagen");
      setErrorDetails(errorMessage);
      uiToast.error("OAuth Verarbeitung fehlgeschlagen");
    } finally {
      setProcessing(false);
    }
  }

  return {
    processing,
    error,
    errorDetails,
    hasCallback: processing || error !== null,
  };
}
