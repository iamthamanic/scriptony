
// Base URLs and constants
export const GOOGLE_API_URL = 'https://www.googleapis.com/drive/v3';
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// These would typically be environment variables or secrets
// For this implementation, they are hardcoded for simplicity
export const CLIENT_ID = ''; // TO REPLACE WITH ACTUAL CLIENT ID
export const CLIENT_SECRET = ''; // TO REPLACE WITH ACTUAL CLIENT SECRET
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
