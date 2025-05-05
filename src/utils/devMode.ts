
/**
 * Utility to check if the application is running in development mode
 * with the development flag enabled
 */
export const isDevelopmentMode = (): boolean => {
  // Always return true to enable development mode
  return true;
  
  // Previous implementation (commented out)
  // const urlParams = new URLSearchParams(window.location.search);
  // return urlParams.has('devMode') || window.location.hostname.includes('lovableproject.com');
};

/**
 * Get a mock user for development mode
 * This creates a complete mock of the Supabase User type with all required properties
 */
export const getDevModeUser = () => {
  return {
    id: "00000000-0000-0000-0000-000000000000",
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
