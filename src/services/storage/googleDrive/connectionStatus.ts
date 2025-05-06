
import { customSupabase } from "@/integrations/supabase/customClient";
import { getCurrentUser } from "../../worlds/worldOperations/utils";

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
