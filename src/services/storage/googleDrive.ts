
import { customSupabase } from "@/integrations/supabase/customClient";
import { getCurrentUser } from "../worlds/worldOperations/utils";
import { createTimeout } from "../worlds/worldOperations/utils";
import { updateDriveSettings } from "./userStorage";

// Base URL for Google API
const GOOGLE_API_URL = 'https://www.googleapis.com/drive/v3';
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// These would typically be environment variables or secrets
// For this implementation, they are hardcoded for simplicity
const CLIENT_ID = ''; // TO REPLACE WITH ACTUAL CLIENT ID
const CLIENT_SECRET = ''; // TO REPLACE WITH ACTUAL CLIENT SECRET
const REDIRECT_URI = window.location.origin + '/account?tab=storage';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'].join(' ');

export interface DriveConnectionResponse {
  success: boolean;
  message: string;
  email?: string;
  folder?: {
    id: string;
    name: string;
  };
}

/**
 * Initiates the Google Drive OAuth flow
 */
export const connectToGoogleDrive = (): void => {
  const state = generateRandomString(16);
  localStorage.setItem('driveOAuthState', state);
  
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', SCOPES);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  
  window.location.href = authUrl.toString();
};

/**
 * Handles the OAuth callback from Google Drive
 */
export const handleDriveOAuthCallback = async (
  code: string, 
  state: string
): Promise<DriveConnectionResponse> => {
  const savedState = localStorage.getItem('driveOAuthState');
  if (!savedState || savedState !== state) {
    return { 
      success: false, 
      message: 'Sicherheitsfehler: State-Parameter stimmt nicht überein' 
    };
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }
    
    const tokenData = await tokenResponse.json();
    
    // Get user info to display account email
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    const userInfo = await userInfoResponse.json();
    
    // Create or find Scriptony folder in Drive
    const folder = await createOrFindScriptonyFolder(tokenData.access_token);
    
    // Save tokens and folder info to database
    await updateDriveSettings({
      drive_access_token: tokenData.access_token,
      drive_refresh_token: tokenData.refresh_token,
      drive_token_expiry: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      drive_account_email: userInfo.email,
      drive_folder_id: folder.id,
      drive_folder_name: folder.name,
    });
    
    return {
      success: true,
      message: 'Erfolgreich mit Google Drive verbunden',
      email: userInfo.email,
      folder: folder,
    };
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return {
      success: false,
      message: `Fehler bei der Verbindung mit Google Drive: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
    };
  } finally {
    // Clean up state from localStorage
    localStorage.removeItem('driveOAuthState');
  }
};

/**
 * Creates or finds the Scriptony folder in Google Drive
 */
const createOrFindScriptonyFolder = async (accessToken: string): Promise<{ id: string; name: string }> => {
  try {
    // First, check if the folder already exists
    const searchResponse = await fetch(
      `${GOOGLE_API_URL}/files?q=name='Scriptony' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!searchResponse.ok) {
      throw new Error('Failed to search for Scriptony folder');
    }
    
    const searchData = await searchResponse.json();
    
    if (searchData.files && searchData.files.length > 0) {
      // Folder already exists, return the first match
      return {
        id: searchData.files[0].id,
        name: searchData.files[0].name,
      };
    }
    
    // Folder doesn't exist, create it
    const createResponse = await fetch(`${GOOGLE_API_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Scriptony',
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    
    if (!createResponse.ok) {
      throw new Error('Failed to create Scriptony folder');
    }
    
    const createdFolder = await createResponse.json();
    
    return {
      id: createdFolder.id,
      name: createdFolder.name,
    };
  } catch (error) {
    console.error('Error with Drive folder:', error);
    throw error;
  }
};

/**
 * Uploads a file to Google Drive
 */
export const uploadFileToDrive = async (
  file: File, 
  folderId: string, 
  accessToken: string
): Promise<string> => {
  try {
    const metadata = {
      name: file.name,
      parents: [folderId],
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: form,
      }
    );
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to Drive');
    }
    
    const uploadedFile = await uploadResponse.json();
    return uploadedFile.id;
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    throw error;
  }
};

/**
 * Refreshes the Google Drive access token
 */
export const refreshDriveToken = async (refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> => {
  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    
    // Update token in database
    await updateDriveSettings({
      drive_access_token: data.access_token,
      drive_token_expiry: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    });
    
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

/**
 * Helper function to generate a random string for state parameter
 */
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
