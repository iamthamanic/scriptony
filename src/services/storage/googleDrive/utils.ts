
// Base URLs and constants
export const GOOGLE_API_URL = 'https://www.googleapis.com/drive/v3';
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Google OAuth credentials from Supabase secrets
// We will use the values from the environment variables set in Supabase
import { customSupabase } from "@/integrations/supabase/customClient";

// Client IDs and secrets will be retrieved from Supabase secrets at runtime
// Use fallbacks for development purposes only
let cachedCredentials: { clientId: string; clientSecret: string } | null = null;

/**
 * Retrieve OAuth credentials from Supabase secrets
 * This function caches the credentials to avoid unnecessary API calls
 */
export const getOAuthCredentials = async (service: 'auth' | 'drive' = 'drive'): Promise<{ clientId: string; clientSecret: string }> => {
  if (cachedCredentials) {
    return cachedCredentials;
  }
  
  try {
    // Attempt to fetch credentials from Supabase secrets
    const { data, error } = await customSupabase.functions.invoke('get-oauth-credentials', {
      body: { service }
    });
    
    if (error) {
      console.error('Error fetching OAuth credentials:', error);
      throw error;
    }
    
    if (data?.clientId && data?.clientSecret) {
      cachedCredentials = {
        clientId: data.clientId,
        clientSecret: data.clientSecret
      };
      return cachedCredentials;
    }
    
    throw new Error('Invalid credentials received from secrets');
  } catch (error) {
    console.error('Failed to get OAuth credentials:', error);
    
    // Fallback depending on service
    const fallbackCredentials = service === 'auth'
      ? {
          clientId: '1021623717075-t1ugq54l5omei2nn73a63r7vlae2cggk.apps.googleusercontent.com',
          clientSecret: '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'
        }
      : {
          clientId: '336644646972-6ku9cjco0scifhu85qnmgquh8o6gj10c.apps.googleusercontent.com',
          clientSecret: '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'
        };
    
    console.warn('Using fallback OAuth credentials. This should only happen in development.');
    
    cachedCredentials = fallbackCredentials;
    
    return cachedCredentials;
  }
};

// Export async function to get CLIENT_ID
export const getClientId = async (service: 'auth' | 'drive' = 'drive'): Promise<string> => {
  const credentials = await getOAuthCredentials(service);
  return credentials.clientId;
};

// Export async function to get CLIENT_SECRET
export const getClientSecret = async (service: 'auth' | 'drive' = 'drive'): Promise<string> => {
  const credentials = await getOAuthCredentials(service);
  return credentials.clientSecret;
};

// Export constants for backward compatibility (will be deprecated)
export const CLIENT_ID = '336644646972-6ku9cjco0scifhu85qnmgquh8o6gj10c.apps.googleusercontent.com';
export const CLIENT_SECRET = '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';

// Import the redirect URI function from our new redirects utility
import { getDriveRedirectURI } from '@/services/auth/redirects';

// More reliable redirect URI handling
export const getRedirectURI = (): string => {
  return getDriveRedirectURI();
};

// Export REDIRECT_URI for backward compatibility
export const REDIRECT_URI = getRedirectURI();

export const SCOPES = ['https://www.googleapis.com/auth/drive.file'].join(' ');

/**
 * Helper function to generate a random string for state parameter
 */
export const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Helper to safely handle JSON parsing with error handling
 */
export const safeJsonParse = async (response: Response): Promise<any> => {
  try {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON response:', text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
    }
  } catch (e) {
    console.error('Failed to read response text:', e);
    throw new Error('Could not read API response');
  }
};
