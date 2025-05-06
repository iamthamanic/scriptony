
/**
 * Utility to check if the application is running in development mode
 * with the development flag enabled
 */
export const isDevelopmentMode = (): boolean => {
  // Check for the devMode URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hasDevModeParam = urlParams.has('devMode');
  
  // Check if we're on localhost or a development domain
  const isLocalhost = window.location.hostname === 'localhost';
  
  // Check for Lovable domains
  const isLovableDomain = window.location.hostname.includes('lovable.app');
  const isPreviewDomain = window.location.hostname.includes('preview');
  
  // Check for additional development domains
  const isCustomDevDomain = window.location.hostname.includes('lovableproject.com');
  
  // Logging for debugging purposes
  console.log('Development mode check:', {
    hostname: window.location.hostname,
    hasDevModeParam,
    isLocalhost,
    isLovableDomain,
    isPreviewDomain,
    isCustomDevDomain
  });
  
  // Return true if any of the conditions are met
  return hasDevModeParam || isLocalhost || isLovableDomain || isPreviewDomain || isCustomDevDomain;
};

/**
 * Get a mock user for development mode
 * This creates a complete mock of the Supabase User type with all required properties,
 * but uses a valid user ID from the database to avoid foreign key constraint violations
 */
export const getDevModeUser = () => {
  return {
    // Using a valid user ID that exists in the database to avoid foreign key constraint violations
    // This is specifically for development purposes only
    id: "a56da893-d5ca-43d6-818a-4caff9159139",
    email: "dev@example.com",
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { name: "Development User" },
    aud: "authenticated",
    role: "authenticated",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    factors: null,
    phone: null,
    phone_confirmed_at: null,
    email_confirmed_at: new Date().toISOString()
  };
};
