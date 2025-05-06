
import { customSupabase } from "@/integrations/supabase/customClient";
import { refreshDriveToken, getUserDriveSettings } from './auth';
import { createProjectFolder } from './folders';

/**
 * Store file reference in database
 */
export const storeFileReference = async (fileData: {
  user_id: string;
  project_id?: string;
  file_name: string;
  file_type: string;
  drive_file_id: string;
  drive_url: string;
  folder_path: string;
}): Promise<void> => {
  try {
    // Use Edge Function to insert the file reference
    const { error } = await customSupabase.functions.invoke('insert-stored-file', {
      body: {
        user_id: fileData.user_id,
        project_id: fileData.project_id,
        file_name: fileData.file_name,
        file_type: fileData.file_type,
        drive_file_id: fileData.drive_file_id,
        drive_url: fileData.drive_url,
        folder_path: fileData.folder_path
      }
    });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error storing file reference:', error);
    // Don't throw here - if DB storage fails, we still want the file upload to succeed
  }
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
    
    // Store file reference in database
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
