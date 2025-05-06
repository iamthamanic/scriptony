
import { updateDriveSettings } from "../userStorage";
import { GOOGLE_TOKEN_URL, getClientId, getClientSecret, safeJsonParse } from './utils';
import { toast } from 'sonner';

/**
 * Refreshes the Google Drive access token
 */
export const refreshDriveToken = async (refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> => {
  try {
    const clientId = await getClientId('drive');
    const clientSecret = await getClientSecret('drive');
    
    console.log("Refreshing token with client ID:", clientId.substring(0, 8) + "...");
    
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token refresh error:", errorText);
      
      // Try to parse error JSON if possible
      let errorDetails = "Unknown error";
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error_description || errorJson.error || errorText;
      } catch (e) {
        errorDetails = errorText;
      }
      
      toast.error(`Failed to refresh token: ${errorDetails}`);
      throw new Error(`Failed to refresh token: ${response.status} ${errorDetails}`);
    }
    
    const data = await safeJsonParse(response);
    console.log("Token refreshed successfully, expires in:", data.expires_in);
    
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
