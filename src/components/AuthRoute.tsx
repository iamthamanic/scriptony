
import React, { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isDevelopmentMode } from "@/utils/devMode";
import { toast } from "sonner";

interface AuthRouteProps {
  children: ReactNode;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const devMode = isDevelopmentMode();
  
  // Show notification when dev mode is active
  useEffect(() => {
    if (devMode && !loading && !user) {
      toast.info("Development Mode: Authentication bypassed", {
        id: "dev-mode-auth",
        duration: 5000
      });
    }
  }, [devMode, loading, user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Lädt...</div>;
  }

  // In development mode, allow access without authentication
  if (devMode) {
    console.log("Development mode: Bypassing authentication check");
    return <>{children}</>;
  }

  // In production or when not in dev mode, require authentication
  if (!user) {
    console.log("Authentication required: Redirecting to auth page");
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export const PublicOnlyRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const devMode = isDevelopmentMode();
  
  // In development mode, redirect to home if on public route
  useEffect(() => {
    if (devMode && location.pathname === "/auth") {
      console.log("Development mode: Automatically redirecting from auth page to home");
      navigate('/');
    }
  }, [devMode, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Lädt...</div>;
  }

  // Allow authenticated users to access public routes in dev mode for testing
  if (devMode) {
    console.log("Development mode: Allowing access to public route");
    return <>{children}</>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
