
/**
 * Utility to check if the application is running in development mode
 * with the development flag enabled
 */
export const isDevelopmentMode = (): boolean => {
  // Check if URL has a development mode parameter or if we're on the development domain
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('devMode') || window.location.hostname.includes('lovableproject.com');
};

/**
 * Get a mock user for development mode
 */
export const getDevModeUser = () => {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    email: "dev@example.com",
    role: "authenticated",
    aud: "authenticated"
  };
};
