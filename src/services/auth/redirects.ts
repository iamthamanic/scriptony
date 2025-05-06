
/**
 * Common utilities for OAuth redirects in both authentication systems
 */

// Configuration flags
const USE_FIXED_REDIRECTS = true; // Keep this true to use fixed redirects

// Domain configuration for different environments
const LOVABLE_DOMAINS = ['lovable.dev', 'lovable.app'];
const LOCAL_DOMAINS = ['localhost', '127.0.0.1'];
const SCRIPTONY_DOMAINS = ['app.scriptony.de', 'preview.scriptony.de', 'admin.scriptony.de'];

// Environment detection
export const isLocalDevelopment = (): boolean => {
  return LOCAL_DOMAINS.some(domain => window.location.hostname === domain || 
                                      window.location.hostname.includes(domain));
};

export const isLovableEnvironment = (): boolean => {
  return LOVABLE_DOMAINS.some(domain => window.location.hostname.includes(domain));
};

export const isScriptonyDomain = (): boolean => {
  return SCRIPTONY_DOMAINS.some(domain => window.location.hostname === domain);
};

/**
 * Get the actual fixed redirect URI for Google Drive OAuth
 * 
 * For Google Cloud Console configuration, use these URLs:
 * - If testing locally: http://localhost:5173/account?tab=storage
 * - For Lovable: https://your-project-name.lovable.dev/account?tab=storage
 * - For Scriptony: https://app.scriptony.de/account?tab=storage
 */
export const getDriveRedirectURI = (): string => {
  // With USE_FIXED_REDIRECTS enabled, we return environment-specific URLs
  if (!USE_FIXED_REDIRECTS) {
    // Only used when flag is disabled - returns dynamic URL
    return `${window.location.origin}/account?tab=storage`;
  }

  // Local development - fixed URL for localhost testing
  if (isLocalDevelopment()) {
    // For local testing with vite default port
    return 'http://localhost:5173/account?tab=storage';
  }
  
  // Scriptony custom domains
  if (isScriptonyDomain()) {
    // Use the actual domain for Scriptony environments
    return `${window.location.origin}/account?tab=storage`;
  }
  
  // Lovable environment (preview/production)
  if (isLovableEnvironment()) {
    // Use the actual origin as fixed URL within Lovable environments
    return `${window.location.origin}/account?tab=storage`;
  }
  
  // Fallback to current origin if environment can't be determined
  return `${window.location.origin}/account?tab=storage`;
};

/**
 * Get the actual fixed redirect URI for Supabase Auth
 * 
 * For Google Cloud Console configuration, use these URLs:
 * - If testing locally: http://localhost:5173/auth
 * - For Lovable: https://your-project-name.lovable.dev/auth
 * - For Scriptony: https://app.scriptony.de/auth
 */
export const getAuthRedirectURI = (): string => {
  // With USE_FIXED_REDIRECTS enabled, we return environment-specific URLs
  if (!USE_FIXED_REDIRECTS) {
    // Only used when flag is disabled - returns dynamic URL
    return `${window.location.origin}/auth`;
  }

  // Local development - fixed URL for localhost testing
  if (isLocalDevelopment()) {
    // For local testing with vite default port
    return 'http://localhost:5173/auth';
  }
  
  // Scriptony custom domains
  if (isScriptonyDomain()) {
    // Use the actual domain for Scriptony environments
    return `${window.location.origin}/auth`;
  }
  
  // Lovable environment (preview/production)
  if (isLovableEnvironment()) {
    // Use the actual origin as fixed URL within Lovable environments
    return `${window.location.origin}/auth`;
  }
  
  // Fallback to current origin if environment can't be determined
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
  isScriptony: boolean;
  fixedRedirects: boolean;
  originUrl: string;
  driveRedirectUrl: string;
  authRedirectUrl: string;
} => {
  const isLocal = isLocalDevelopment();
  const isLovable = isLovableEnvironment();
  const isScriptony = isScriptonyDomain();
  
  let type = "unknown";
  if (isLocal) {
    type = "local development";
  } else if (isScriptony) {
    type = "Scriptony production";
  } else if (isLovable) {
    type = "Lovable environment";
  }
  
  return {
    type,
    hostname: window.location.hostname,
    isLocal,
    isLovable,
    isScriptony,
    fixedRedirects: USE_FIXED_REDIRECTS,
    originUrl: window.location.origin,
    driveRedirectUrl: getDriveRedirectURI(),
    authRedirectUrl: getAuthRedirectURI()
  };
};
