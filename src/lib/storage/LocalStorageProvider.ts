
import { AbstractStorageProvider, StorageProviderType } from './StorageProvider';
import { toast } from 'sonner';

/**
 * Local storage provider for offline use
 * Uses the browser's download functionality
 */
export class LocalStorageProvider extends AbstractStorageProvider {
  private savedFiles: Map<string, { content: Blob | string, timestamp: Date }> = new Map();
  
  constructor() {
    super();
    this.status = {
      connected: true,
      storagePath: 'Local Downloads',
      accountInfo: {
        name: 'Local Device'
      }
    };
  }
  
  /**
   * Local provider is always "connected"
   */
  async connect(): Promise<boolean> {
    this.status.connected = true;
    return true;
  }
  
  /**
   * Always returns true for local provider
   */
  async isConnected(): Promise<boolean> {
    return true;
  }
  
  /**
   * Save a file to local downloads
   */
  async saveFile(path: string, content: Blob | string): Promise<{
    success: boolean;
    fileUrl?: string;
    filePath?: string;
    fileId?: string;
    error?: string;
  }> {
    try {
      this.status.isSyncing = true;
      
      // Extract filename from path
      const pathParts = path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      // Store reference in memory
      this.savedFiles.set(path, {
        content,
        timestamp: new Date()
      });
      
      // Trigger download
      const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      
      // Optional: only trigger download if requested
      // a.click(); // Trigger download
      
      URL.revokeObjectURL(url);
      
      this.status.lastSync = new Date();
      this.status.error = undefined;
      
      return {
        success: true,
        filePath: path,
        fileUrl: `data:${blob.type};base64,${await this.blobToBase64(blob)}`
      };
    } catch (error) {
      console.error('Error saving file locally:', error);
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
   * Download a file to the user's device
   */
  downloadFile(path: string): void {
    const fileData = this.savedFiles.get(path);
    if (!fileData) {
      toast.error('File not found', { description: `Could not find ${path}` });
      return;
    }
    
    const pathParts = path.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    const blob = fileData.content instanceof Blob 
      ? fileData.content 
      : new Blob([fileData.content], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    
    URL.revokeObjectURL(url);
    toast.success('Downloaded', { description: fileName });
  }
  
  /**
   * Read a file from memory
   */
  async readFile(path: string): Promise<Blob | string | null> {
    const fileData = this.savedFiles.get(path);
    if (!fileData) return null;
    return fileData.content;
  }
  
  /**
   * List files saved in memory
   */
  async listFiles(directory: string): Promise<string[]> {
    const files: string[] = [];
    
    for (const path of this.savedFiles.keys()) {
      if (path.startsWith(directory)) {
        files.push(path);
      }
    }
    
    return files;
  }
  
  /**
   * Disconnect - clear saved files
   */
  async disconnect(): Promise<void> {
    this.savedFiles.clear();
    toast.success('Local storage cleared');
  }
  
  /**
   * Get provider type
   */
  getType(): StorageProviderType {
    return StorageProviderType.LOCAL;
  }
  
  /**
   * Helper to convert blob to base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
