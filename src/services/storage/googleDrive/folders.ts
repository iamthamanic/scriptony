
import { GOOGLE_API_URL } from './utils';
import { getUserDriveSettings } from './connectionStatus';

/**
 * Creates or finds the main Scriptony folder in Google Drive
 */
export const createOrFindScriptonyMainFolder = async (accessToken: string): Promise<{ id: string; name: string }> => {
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
export const createOrFindScriptonySubfolder = async (
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
  try {
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
  } catch (error) {
    console.error('Error creating project folder:', error);
    throw error;
  }
};
