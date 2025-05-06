
export interface UserStorageSettings {
  id: string;
  user_id: string;
  storage_provider: 'googleDrive'; // Removed scriptony as an option
  drive_folder_id?: string;
  drive_folder_name?: string;
  drive_account_email?: string;
  drive_access_token?: string;
  drive_refresh_token?: string;
  drive_token_expiry?: string;
  is_connected: boolean; // New field to track connection status
  created_at: string;
  updated_at: string;
}

// New interface for file references
export interface StoredFileReference {
  id: string;
  user_id: string;
  project_id?: string;
  file_name: string;
  file_type: string; // mime type
  drive_file_id: string;
  drive_url: string;
  folder_path: string;
  created_at: string;
}
