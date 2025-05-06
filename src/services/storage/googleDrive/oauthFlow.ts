
import { customSupabase } from "@/integrations/supabase/customClient";
import { updateDriveSettings } from "../userStorage";
import { 
  GOOGLE_AUTH_URL,
  GOOGLE_TOKEN_URL, 
  CLIENT_ID, 
  CLIENT_SECRET, 
  REDIRECT_URI, 
  SCOPES, 
  generateRandomString,
  safeJsonParse
} from './utils';
import { createOrFindScriptonyMainFolder, createOrFindScriptonySubfolder } from './folders';
import { toast } from 'sonner';

export interface DriveConnectionResponse {
  success: boolean;
  message: string;
  email?: string;
  folder?: {
    id: string;
    name: string;
  };
  error?: {
    code: string;
    details: string;
  };
}

/**
 * Initiates the Google Drive OAuth flow
 */
export const connectToGoogleDrive = (): void => {
  try {
    console.log("Starting Google Drive OAuth flow...");
    console.log("Redirect URI:", REDIRECT_URI);
    
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
    
    console.log("Generated OAuth URL:", authUrl.toString());
    
    window.location.href = authUrl.toString();
  } catch (error) {
    console.error("Error initiating Google Drive connection:", error);
    toast.error("Fehler bei der Verbindung mit Google Drive", {
      description: "Bitte versuche es erneut oder kontaktiere den Support."
    });
  }
};

/**
 * Handles the OAuth callback from Google Drive
 */
export const handleDriveOAuthCallback = async (
  code: string, 
  state: string
): Promise<DriveConnectionResponse> => {
  console.log("Handling Google Drive OAuth callback...");
  console.log("Code received (length):", code.length);
  
  const savedState = localStorage.getItem('driveOAuthState');
  if (!savedState || savedState !== state) {
    return { 
      success: false, 
      message: 'Sicherheitsfehler: State-Parameter stimmt nicht überein' 
    };
  }
  
  try {
    // Exchange code for tokens
    console.log("Exchanging authorization code for tokens...");
    console.log("Token URL:", GOOGLE_TOKEN_URL);
    console.log("Redirect URI for token exchange:", REDIRECT_URI);
    
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
    
    console.log("Token response status:", tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange error:", errorText);
      
      // Try to parse error as JSON if possible
      let errorDetails = "Unknown error";
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error_description || errorJson.error || errorText;
      } catch (e) {
        errorDetails = errorText;
      }
      
      return {
        success: false,
        message: `Token-Austausch fehlgeschlagen (${tokenResponse.status})`,
        error: {
          code: `HTTP_${tokenResponse.status}`,
          details: errorDetails
        }
      };
    }
    
    const tokenData = await safeJsonParse(tokenResponse);
    console.log("Token received, expires_in:", tokenData.expires_in);
    
    if (!tokenData.access_token) {
      console.error("No access token received:", tokenData);
      return {
        success: false,
        message: "Kein Access-Token erhalten",
        error: {
          code: "NO_ACCESS_TOKEN",
          details: JSON.stringify(tokenData)
        }
      };
    }
    
    // Get user info to display account email
    console.log("Fetching user info...");
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      console.error("User info fetch failed:", userInfoResponse.status);
      return {
        success: false,
        message: 'Fehler beim Abrufen der Nutzerinformationen',
        error: {
          code: `USER_INFO_HTTP_${userInfoResponse.status}`,
          details: await userInfoResponse.text()
        }
      };
    }
    
    const userInfo = await safeJsonParse(userInfoResponse);
    console.log("User email retrieved:", userInfo.email);
    
    // Create main Scriptony folder in Drive
    console.log("Creating/finding Scriptony folder...");
    const scriptonyFolder = await createOrFindScriptonyMainFolder(tokenData.access_token);
    console.log("Scriptony folder:", scriptonyFolder);
    
    // Create Projects subfolder
    console.log("Creating/finding Projects subfolder...");
    const projectsFolder = await createOrFindScriptonySubfolder(
      tokenData.access_token,
      scriptonyFolder.id,
      'Projekte'
    );
    console.log("Projects folder:", projectsFolder);
    
    // Save tokens and folder info to database
    console.log("Saving drive settings to database...");
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
    
    console.log("Google Drive connection successful!");
    return {
      success: true,
      message: 'Erfolgreich mit Google Drive verbunden',
      email: userInfo.email,
      folder: scriptonyFolder,
    };
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unbekannter Fehler';
      
    return {
      success: false,
      message: `Fehler bei der Verbindung mit Google Drive: ${errorMessage}`,
      error: {
        code: "OAUTH_PROCESS_ERROR",
        details: errorMessage
      }
    };
  } finally {
    // Clean up state from localStorage
    localStorage.removeItem('driveOAuthState');
  }
};
