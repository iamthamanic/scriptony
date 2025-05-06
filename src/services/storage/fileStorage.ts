
import { checkDriveConnectionRequired, getUserStorageSettings } from './userStorage';
import { uploadFileToDrive, isDriveConnected } from './googleDrive';
import { Project } from '@/types';
import { toast } from 'sonner';

/**
 * Interface for file upload options
 */
export interface FileUploadOptions {
  projectId?: string;
  projectName?: string;
  category?: string;
}

/**
 * Interface for upload result
 */
export interface FileUploadResult {
  success: boolean;
  fileUrl?: string;
  filePath?: string;
  fileId?: string;
  error?: string;
  requiresDriveConnection?: boolean;
}

/**
 * Unified file upload service - handles the proper storage method
 */
export const uploadFile = async (
  file: File,
  options: FileUploadOptions = {}
): Promise<FileUploadResult> => {
  try {
    // First check if Drive connection is required
    const driveRequired = await checkDriveConnectionRequired();
    
    if (driveRequired) {
      return {
        success: false,
        requiresDriveConnection: true,
        error: 'Google Drive Verbindung erforderlich'
      };
    }
    
    // Check if we have project info for proper folder structure
    if (!options.projectId && !options.projectName) {
      // Use general uploads folder without project association
      const result = await uploadToGeneralFolder(file, options.category);
      return {
        success: true,
        fileUrl: result.fileUrl,
        filePath: result.filePath,
        fileId: result.fileId
      };
    }
    
    // Upload to a project folder
    const result = await uploadToProjectFolder(
      file, 
      options.projectId || 'unknown',
      options.projectName || 'Untitled'
    );
    
    return {
      success: true,
      fileUrl: result.fileUrl,
      filePath: result.filePath,
      fileId: result.fileId
    };
    
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler beim Upload'
    };
  }
};

/**
 * Upload file to a specific project folder
 */
const uploadToProjectFolder = async (
  file: File,
  projectId: string,
  projectName: string
): Promise<{ fileUrl: string, filePath: string, fileId: string }> => {
  const result = await uploadFileToDrive(file, projectId, projectName);
  
  return {
    fileUrl: result.fileUrl,
    filePath: result.filePath,
    fileId: result.fileId
  };
};

/**
 * Upload file to general folder (not associated with a project)
 */
const uploadToGeneralFolder = async (
  file: File,
  category: string = 'general'
): Promise<{ fileUrl: string, filePath: string, fileId: string }> => {
  // For general uploads, we use a special category folder
  const result = await uploadFileToDrive(file, 'general', `_${category}`);
  
  return {
    fileUrl: result.fileUrl,
    filePath: result.filePath,
    fileId: result.fileId
  };
};

/**
 * Check if user can upload files (Drive connected)
 */
export const canUploadFiles = async (): Promise<boolean> => {
  return await isDriveConnected();
};

/**
 * Shows a toast with error message if upload fails
 */
export const handleUploadError = (result: FileUploadResult) => {
  if (!result.success) {
    if (result.requiresDriveConnection) {
      toast.error('Google Drive Verbindung erforderlich', {
        description: 'Bitte verbinde dein Google Drive Konto, um Dateien hochladen zu können.'
      });
    } else {
      toast.error('Upload fehlgeschlagen', {
        description: result.error || 'Ein unbekannter Fehler ist aufgetreten.'
      });
    }
    return true;
  }
  return false;
};
