
import { updateDriveSettings } from "../userStorage";
import { GOOGLE_TOKEN_URL, CLIENT_ID, CLIENT_SECRET } from './utils';

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
