
import { customSupabase } from "@/integrations/supabase/customClient";
import { getCurrentUser } from "../../worlds/worldOperations/utils";
import { updateDriveSettings } from "../userStorage";
import { 
  GOOGLE_AUTH_URL,
  GOOGLE_TOKEN_URL, 
  CLIENT_ID, 
  CLIENT_SECRET, 
  REDIRECT_URI, 
  SCOPES, 
  generateRandomString 
} from './utils';
import { createOrFindScriptonyMainFolder, createOrFindScriptonySubfolder } from './folders';

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
    
    // Create main Scriptony folder in Drive
    const scriptonyFolder = await createOrFindScriptonyMainFolder(tokenData.access_token);
    
    // Create Projects subfolder
    const projectsFolder = await createOrFindScriptonySubfolder(
      tokenData.access_token,
      scriptonyFolder.id,
      'Projekte'
    );
    
    // Save tokens and folder info to database
    await updateDriveSettings({
      drive_access_token: tokenData.access_token,
      drive_refresh_token: tokenData.refresh_token,
      drive_token_expiry: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      drive_account_email: userInfo.email,
      drive_folder_id: scriptonyFolder.id,
      drive_folder_name: scriptonyFolder.name,
      storage_provider: 'googleDrive',
      is_connected: true
    });
    
    return {
      success: true,
      message: 'Erfolgreich mit Google Drive verbunden',
      email: userInfo.email,
      folder: scriptonyFolder,
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
 * Gets the user's Google Drive settings
 */
export const getUserDriveSettings = async () => {
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await customSupabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (error) {
    console.error("Error fetching user drive settings:", error);
    throw error;
  }
  
  return data;
};

/**
 * Check if user has connected Google Drive
 */
export const isDriveConnected = async (): Promise<boolean> => {
  try {
    const settings = await getUserDriveSettings();
    return !!(settings?.drive_account_email && settings?.drive_folder_id);
  } catch (error) {
    console.error('Error checking Drive connection:', error);
    return false;
  }
};

/**
 * Get the Google Drive connection status with details
 */
export const getDriveConnectionStatus = async (): Promise<{
  connected: boolean;
  email?: string;
  folderName?: string;
}> => {
  try {
    const settings = await getUserDriveSettings();
    const connected = !!(settings?.drive_account_email && settings?.drive_folder_id);
    
    return {
      connected,
      email: settings?.drive_account_email,
      folderName: settings?.drive_folder_name
    };
  } catch (error) {
    console.error('Error getting Drive connection status:', error);
    return { connected: false };
  }
};
