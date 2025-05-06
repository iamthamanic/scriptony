
// Base URLs and constants
export const GOOGLE_API_URL = 'https://www.googleapis.com/drive/v3';
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Google OAuth credentials
// These would typically come from environment variables 
// For development purposes we're using direct values
export const CLIENT_ID = '455373172517-jvu8nvr2kal1ovtdsei9plefp6qstvd5.apps.googleusercontent.com';
export const CLIENT_SECRET = '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';
export const REDIRECT_URI = window.location.origin + '/account?tab=storage';
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
