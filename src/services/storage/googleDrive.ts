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
 * Creates or finds the main Scriptony folder in Google Drive
 */
const createOrFindScriptonyMainFolder = async (accessToken: string): Promise<{ id: string; name: string }> => {
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
 * Creates or finds a subfolder within the Scriptony folder
 */
const createOrFindScriptonySubfolder = async (
  accessToken: string,
  parentFolderId: string,
  folderName: string
): Promise<{ id: string; name: string }> => {
  try {
    // First, check if the folder already exists
    const searchResponse = await fetch(
      `${GOOGLE_API_URL}/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!searchResponse.ok) {
      throw new Error(`Failed to search for ${folderName} folder`);
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
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId]
      }),
    });
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create ${folderName} folder`);
    }
    
    const createdFolder = await createResponse.json();
    
    return {
      id: createdFolder.id,
      name: createdFolder.name,
    };
  } catch (error) {
    console.error(`Error with Drive folder ${folderName}:`, error);
    throw error;
  }
};

/**
 * Creates a project folder in Google Drive
 */
export const createProjectFolder = async (
  projectName: string,
  accessToken: string
): Promise<{ id: string; name: string; path: string }> => {
  // First get settings to find the projects folder
  const settings = await getUserDriveSettings();
  
  if (!settings?.drive_folder_id) {
    throw new Error('Google Drive not connected');
  }
  
  // Find "Projekte" folder
  const projectsFolder = await createOrFindScriptonySubfolder(
    accessToken,
    settings.drive_folder_id,
    'Projekte'
  );
  
  // Create project folder with sanitized name
  const safeName = projectName.replace(/[^a-z0-9äöüß\s-]/gi, '') || 'Untitled';
  
  const folder = await createOrFindScriptonySubfolder(
    accessToken,
    projectsFolder.id,
    safeName
  );
  
  return {
    id: folder.id,
    name: folder.name,
    path: `Scriptony/Projekte/${safeName}`
  };
};

/**
 * Uploads a file to Google Drive in the specified project folder
 */
export const uploadFileToDrive = async (
  file: File,
  projectId: string,
  projectName: string
): Promise<{fileId: string, fileUrl: string, filePath: string}> => {
  try {
    // First, check if we have a valid token
    const settings = await getUserDriveSettings();
    
    if (!settings?.drive_access_token) {
      throw new Error('Google Drive is not connected. Please connect your Google Drive account.');
    }
    
    let accessToken = settings.drive_access_token;
    
    // Check if token is expired and refresh if needed
    if (settings.drive_token_expiry && new Date(settings.drive_token_expiry) <= new Date()) {
      if (!settings.drive_refresh_token) {
        throw new Error('Google Drive token expired and cannot be refreshed. Please reconnect your account.');
      }
      
      const refreshResult = await refreshDriveToken(settings.drive_refresh_token);
      accessToken = refreshResult.access_token;
    }
    
    // Create or find project folder
    const projectFolder = await createProjectFolder(projectName, accessToken);
    
    // Upload file to the project folder
    const metadata = {
      name: file.name,
      parents: [projectFolder.id],
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
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
    
    // Store file reference in database - using raw SQL insert since the type isn't defined yet
    await storeFileReference({
      user_id: settings.user_id,
      project_id: projectId,
      file_name: file.name,
      file_type: file.type,
      drive_file_id: uploadedFile.id,
      drive_url: uploadedFile.webViewLink,
      folder_path: projectFolder.path
    });
    
    return {
      fileId: uploadedFile.id,
      fileUrl: uploadedFile.webViewLink,
      filePath: `${projectFolder.path}/${file.name}`
    };
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    throw error;
  }
};

/**
 * Store file reference in database
 */
const storeFileReference = async (fileData: {
  user_id: string;
  project_id?: string;
  file_name: string;
  file_type: string;
  drive_file_id: string;
  drive_url: string;
  folder_path: string;
}): Promise<void> => {
  try {
    // Use raw insert query instead of the from() method with type checking
    const { error } = await customSupabase.rpc('insert_stored_file', {
      p_user_id: fileData.user_id,
      p_project_id: fileData.project_id,
      p_file_name: fileData.file_name,
      p_file_type: fileData.file_type,
      p_drive_file_id: fileData.drive_file_id,
      p_drive_url: fileData.drive_url,
      p_folder_path: fileData.folder_path
    });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error storing file reference:', error);
    // Don't throw here - if DB storage fails, we still want the file upload to succeed
  }
};

/**
 * Gets the user's Google Drive settings
 */
const getUserDriveSettings = async () => {
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
