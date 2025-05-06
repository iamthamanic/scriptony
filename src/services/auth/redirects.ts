
/**
 * Common utilities for OAuth redirects in both authentication systems
 */

// Configuration flags
const USE_FIXED_REDIRECTS = true; // Set to false to revert to dynamic URLs if needed

// Environment detection
export const isLocalDevelopment = (): boolean => {
  return window.location.hostname === "localhost" || 
         window.location.hostname === "127.0.0.1";
};

export const isLovableEnvironment = (): boolean => {
  return window.location.hostname.includes('lovable.dev') || 
         window.location.hostname.includes('lovable.app');
};

/**
 * Get the fixed redirect URI for Google Drive OAuth
 */
export const getDriveRedirectURI = (): string => {
  if (!USE_FIXED_REDIRECTS) {
    return `${window.location.origin}/account?tab=storage`;
  }

  // Local development
  if (isLocalDevelopment()) {
    return `${window.location.origin}/account?tab=storage`;
  }
  
  // Lovable environment (preview/production)
  if (isLovableEnvironment()) {
    return `${window.location.origin}/account?tab=storage`;
  }
  
  // Fallback to current origin
  return `${window.location.origin}/account?tab=storage`;
};

/**
 * Get the fixed redirect URI for Supabase Auth
 */
export const getAuthRedirectURI = (): string => {
  if (!USE_FIXED_REDIRECTS) {
    return `${window.location.origin}/auth`;
  }

  // Local development
  if (isLocalDevelopment()) {
    return `${window.location.origin}/auth`;
  }
  
  // Lovable environment (preview/production)
  if (isLovableEnvironment()) {
    return `${window.location.origin}/auth`;
  }
  
  // Fallback to current origin
  return `${window.location.origin}/auth`;
};

/**
 * Get environment information for diagnostics
 */
export const getEnvironmentInfo = (): {
  type: string;
  hostname: string;
  isLocal: boolean;
  isLovable: boolean;
} => {
  const isLocal = isLocalDevelopment();
  const isLovable = isLovableEnvironment();
  
  let type = "unknown";
  if (isLocal) {
    type = "local development";
  } else if (isLovable) {
    type = "Lovable environment";
  }
  
  return {
    type,
    hostname: window.location.hostname,
    isLocal,
    isLovable
  };
};

