
import { customSupabase } from "@/integrations/supabase/customClient";
import { getCurrentUser } from "../worlds/worldOperations/utils";
import { UserStorageSettings } from "./types";

/**
 * Fetches the user's storage settings
 */
export const getUserStorageSettings = async (): Promise<UserStorageSettings | null> => {
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await customSupabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (error) {
    console.error("Error fetching user storage settings:", error);
    return null;
  }
  
  // Add is_connected field with a default value if it's missing
  const result: UserStorageSettings = {
    ...data,
    is_connected: Boolean(data.is_connected)
  } as UserStorageSettings;
  
  return result;
};

/**
 * Updates Google Drive integration settings
 */
export const updateDriveSettings = async (
  settings: Partial<Pick<UserStorageSettings, 
    'drive_folder_id' | 'drive_folder_name' | 
    'drive_account_email' | 'drive_access_token' | 
    'drive_refresh_token' | 'drive_token_expiry' |
    'storage_provider' | 'is_connected'
  >>
): Promise<UserStorageSettings | null> => {
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await customSupabase
    .from('user_settings')
    .update({ 
      ...settings,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating drive settings:", error);
    return null;
  }
  
  // Add is_connected field with a default value if it's missing
  const result: UserStorageSettings = {
    ...data,
    is_connected: Boolean(data.is_connected)
  } as UserStorageSettings;
  
  return result;
};

/**
 * Disconnects Google Drive integration - but only sets connection state to false
 * keeping the tokens for potential reconnection
 */
export const disconnectGoogleDrive = async (): Promise<UserStorageSettings | null> => {
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await customSupabase
    .from('user_settings')
    .update({ 
      is_connected: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error disconnecting Google Drive:", error);
    return null;
  }
  
  // Ensure is_connected has a value (should be false at this point)
  const result: UserStorageSettings = {
    ...data,
    is_connected: false
  } as UserStorageSettings;
  
  return result;
};

/**
 * Creates default storage settings for a new user
 * if not already created by the database trigger
 */
export const createDefaultStorageSettings = async (): Promise<UserStorageSettings | null> => {
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  // First check if settings already exist
  const { data: existingSettings } = await customSupabase
    .from('user_settings')
    .select('id')
    .eq('user_id', user.id)
    .single();
    
  if (existingSettings?.id) {
    return getUserStorageSettings();
  }
  
  // Create new settings
  const { data, error } = await customSupabase
    .from('user_settings')
    .insert({
      user_id: user.id,
      storage_provider: 'googleDrive',
      is_connected: false
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error creating storage settings:", error);
    return null;
  }
  
  // Add is_connected field with a default value if it's missing
  const result: UserStorageSettings = {
    ...data,
    is_connected: Boolean(data.is_connected)
  } as UserStorageSettings;
  
  return result;
};

/**
 * Checks if drive connection is required and not completed
 */
export const checkDriveConnectionRequired = async (): Promise<boolean> => {
  try {
    const settings = await getUserStorageSettings();
    
    // If no settings found, or user has no drive connection
    const driveNotConnected = !settings || !settings.drive_account_email || !settings.drive_folder_id;
    
    return driveNotConnected;
  } catch (error) {
    console.error("Error checking drive connection requirement:", error);
    return true; // Assume connection required if error
  }
};
