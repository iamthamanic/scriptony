
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isDevelopmentMode } from "@/utils/devMode";

interface AuthRouteProps {
  children: ReactNode;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const devMode = isDevelopmentMode();

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
  const devMode = isDevelopmentMode();

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
