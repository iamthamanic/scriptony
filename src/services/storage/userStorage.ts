
import { customSupabase } from "@/integrations/supabase/customClient";
import { getCurrentUser } from "../worlds/worldOperations/utils";

export interface UserStorageSettings {
  id: string;
  user_id: string;
  storage_provider: 'scriptony' | 'googleDrive';
  drive_folder_id?: string;
  drive_folder_name?: string;
  upload_to_drive: boolean;
  drive_account_email?: string;
  drive_access_token?: string;
  drive_refresh_token?: string;
  drive_token_expiry?: string;
  created_at: string;
  updated_at: string;
}

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
  
  return data as UserStorageSettings;
};

/**
 * Updates the user's storage provider setting
 */
export const updateStorageProvider = async (
  storageProvider: 'scriptony' | 'googleDrive'
): Promise<UserStorageSettings | null> => {
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await customSupabase
    .from('user_settings')
    .update({ 
      storage_provider: storageProvider,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating storage provider:", error);
    return null;
  }
  
  return data as UserStorageSettings;
};

/**
 * Updates Google Drive integration settings
 */
export const updateDriveSettings = async (
  settings: Partial<Pick<UserStorageSettings, 
    'drive_folder_id' | 'drive_folder_name' | 'upload_to_drive' | 
    'drive_account_email' | 'drive_access_token' | 'drive_refresh_token' | 'drive_token_expiry'
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
  
  return data as UserStorageSettings;
};

/**
 * Disconnects Google Drive integration
 */
export const disconnectGoogleDrive = async (): Promise<UserStorageSettings | null> => {
  // Get the current user
  const { data: { user } } = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await customSupabase
    .from('user_settings')
    .update({ 
      storage_provider: 'scriptony',
      drive_folder_id: null,
      drive_folder_name: null,
      upload_to_drive: false,
      drive_account_email: null,
      drive_access_token: null,
      drive_refresh_token: null,
      drive_token_expiry: null,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error disconnecting Google Drive:", error);
    return null;
  }
  
  return data as UserStorageSettings;
};
