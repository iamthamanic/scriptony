
import { AbstractStorageProvider, StorageProviderType, StorageProviderStatus } from './StorageProvider';
import { 
  connectToGoogleDrive, 
  handleDriveOAuthCallback, 
  isDriveConnected, 
  getDriveConnectionStatus, 
  refreshDriveToken, 
  uploadFileToDrive, 
  disconnectGoogleDrive 
} from '@/services/storage';
import { toast } from 'sonner';

/**
 * Google Drive storage provider implementation
 */
export class GoogleDriveProvider extends AbstractStorageProvider {
  private projectId: string | null = null;
  private projectName: string | null = null;
  
  /**
   * Create a new Google Drive provider
   * @param projectId Optional project ID
   * @param projectName Optional project name
   */
  constructor(projectId?: string, projectName?: string) {
    super();
    if (projectId) this.projectId = projectId;
    if (projectName) this.projectName = projectName;
  }
  
  /**
   * Set project information
   * @param projectId Project ID
   * @param projectName Project name
   */
  setProjectInfo(projectId: string, projectName: string): void {
    this.projectId = projectId;
    this.projectName = projectName;
  }
  
  /**
   * Connect to Google Drive
   */
  async connect(): Promise<boolean> {
    try {
      const isConnected = await this.isConnected();
      
      if (isConnected) {
        const connectionStatus = await getDriveConnectionStatus();
        this.status = {
          connected: true,
          accountInfo: {
            email: connectionStatus.email,
          },
          storagePath: `Scriptony/${connectionStatus.folderName || 'Projekte'}`
        };
        return true;
      }
      
      // Initiate OAuth flow
      connectToGoogleDrive();
      return false; // Will redirect to OAuth
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      this.status = {
        connected: false,
        error: error instanceof Error ? error.message : String(error)
      };
      return false;
    }
  }
  
  /**
   * Process OAuth callback after redirect
   * @param code OAuth authorization code
   * @param state OAuth state parameter
   */
  async handleOAuthCallback(code: string, state: string): Promise<boolean> {
    try {
      const result = await handleDriveOAuthCallback(code, state);
      
      if (result.success) {
        this.status = {
          connected: true,
          accountInfo: {
            email: result.email,
          },
          storagePath: `Scriptony/${result.folder?.name || 'Projekte'}`
        };
        return true;
      } else {
        this.status = {
          connected: false,
          error: result.message
        };
        return false;
      }
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      this.status = {
        connected: false,
        error: error instanceof Error ? error.message : String(error)
      };
      return false;
    }
  }
  
  /**
   * Check if connected to Google Drive
   */
  async isConnected(): Promise<boolean> {
    try {
      const connected = await isDriveConnected();
      
      if (connected && !this.status.accountInfo) {
        // If connected but status not updated, fetch connection details
        const connectionStatus = await getDriveConnectionStatus();
        this.status = {
          connected: true,
          accountInfo: {
            email: connectionStatus.email,
          },
          storagePath: `Scriptony/${connectionStatus.folderName || 'Projekte'}`
        };
      } else if (!connected) {
        this.status.connected = false;
      }
      
      return connected;
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
      return false;
    }
  }
  
  /**
   * Save file to Google Drive
   * @param path File path 
   * @param content File content
   */
  async saveFile(path: string, content: Blob | string): Promise<{
    success: boolean;
    fileUrl?: string;
    filePath?: string;
    fileId?: string;
    error?: string;
  }> {
    try {
      const isConnected = await this.isConnected();
      
      if (!isConnected) {
        throw new Error('Not connected to Google Drive');
      }
      
      this.status.isSyncing = true;
      
      // Ensure we have a valid blob
      let fileBlob: Blob;
      if (typeof content === 'string') {
        fileBlob = new Blob([content], { type: 'text/plain' });
      } else {
        fileBlob = content;
      }
      
      // Extract filename from path
      const pathParts = path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      // Create a File object
      const file = new File([fileBlob], fileName, {
        type: fileBlob.type || 'text/plain'
      });
      
      // Determine project name and folder path
      const projectId = this.projectId || 'unknown';
      const projectName = this.projectName || 'Untitled';
      
      // Upload to Drive
      const result = await uploadFileToDrive(file, projectId, projectName);
      
      // Update status
      this.status.lastSync = new Date();
      this.status.error = undefined;
      
      return {
        success: true,
        fileUrl: result.fileUrl,
        filePath: result.filePath,
        fileId: result.fileId
      };
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      this.status.error = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: this.status.error
      };
    } finally {
      this.status.isSyncing = false;
    }
  }
  
  /**
   * Read file from Google Drive
   * Currently not implemented - will require additional API methods
   */
  async readFile(path: string): Promise<Blob | string | null> {
    // Not implemented yet - will need additional Drive API methods
    console.warn('readFile not implemented for Google Drive provider');
    return null;
  }
  
  /**
   * List files in Google Drive directory
   * Currently not implemented - will require additional API methods
   */
  async listFiles(directory: string): Promise<string[]> {
    // Not implemented yet - will need additional Drive API methods
    console.warn('listFiles not implemented for Google Drive provider');
    return [];
  }
  
  /**
   * Disconnect from Google Drive
   */
  async disconnect(): Promise<void> {
    try {
      await disconnectGoogleDrive();
      
      this.status = {
        connected: false
      };
      
      this.stopAutoSync();
      
      toast.success('Google Drive disconnected', {
        description: 'Your account has been disconnected'
      });
    } catch (error) {
      console.error('Error disconnecting from Google Drive:', error);
      toast.error('Failed to disconnect Google Drive', {
        description: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Get provider type
   */
  getType(): StorageProviderType {
    return StorageProviderType.GOOGLE_DRIVE;
  }
}
