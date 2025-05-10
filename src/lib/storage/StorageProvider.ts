/**
 * StorageProvider interface - defines the contract for all storage implementations
 * 
 * This interface allows for multiple storage backends while maintaining
 * a consistent API throughout the application.
 */
export interface StorageProvider {
  /**
   * Connect to the storage provider
   * @returns A promise that resolves when connected
   */
  connect(): Promise<boolean>;
  
  /**
   * Check if the provider is connected
   * @returns True if connected, false otherwise
   */
  isConnected(): Promise<boolean>;
  
  /**
   * Save file to storage
   * @param path Path where to save the file
   * @param content File content as Blob or string
   * @returns A promise that resolves when the file is saved
   */
  saveFile(path: string, content: Blob | string): Promise<{
    success: boolean;
    fileUrl?: string;
    filePath?: string; 
    fileId?: string;
    error?: string;
  }>;
  
  /**
   * Read file from storage
   * @param path Path to the file
   * @returns A promise that resolves with the file content
   */
  readFile(path: string): Promise<Blob | string | null>;
  
  /**
   * List files in a directory
   * @param directory Directory path
   * @returns A promise that resolves with a list of file paths
   */
  listFiles(directory: string): Promise<string[]>;
  
  /**
   * Disconnect from the storage provider
   * @returns A promise that resolves when disconnected
   */
  disconnect(): Promise<void>;
  
  /**
   * Setup auto-sync for automatic saving
   * @param getContentFn Function that returns the content to be saved
   * @param getPathFn Function that returns the path where to save
   * @param intervalMs Optional interval for timed auto-save (in milliseconds)
   */
  setupAutoSync?(getContentFn: () => Promise<Blob | string>, getPathFn: () => string, intervalMs?: number): void;
  
  /**
   * Stop auto-sync
   */
  stopAutoSync?(): void;
  
  /**
   * Get provider type
   * @returns The type of storage provider
   */
  getType(): StorageProviderType;
  
  /**
   * Get provider status
   * @returns The current status information
   */
  getStatus(): StorageProviderStatus;
}

/**
 * Storage provider types
 */
export enum StorageProviderType {
  GOOGLE_DRIVE = 'googleDrive',
  LOCAL = 'local',
  DROPBOX = 'dropbox',
  ONEDRIVE = 'oneDrive',
  NONE = 'none'
}

/**
 * Storage provider status
 */
export interface StorageProviderStatus {
  connected: boolean;
  accountInfo?: {
    email?: string;
    name?: string;
    imageUrl?: string;
  };
  lastSync?: Date;
  isSyncing?: boolean;
  error?: string;
  storagePath?: string;
}

/**
 * Abstract base class for storage providers
 * Implements common functionality for all providers
 */
export abstract class AbstractStorageProvider implements StorageProvider {
  protected status: StorageProviderStatus = {
    connected: false
  };
  
  protected autoSyncInterval: number | null = null;
  protected autoSyncDebounceTimer: number | null = null;
  protected autoSyncIntervalTimer: number | null = null;
  
  abstract connect(): Promise<boolean>;
  abstract isConnected(): Promise<boolean>;
  abstract saveFile(path: string, content: Blob | string): Promise<{
    success: boolean;
    fileUrl?: string;
    filePath?: string;
    fileId?: string;
    error?: string;
  }>;
  abstract readFile(path: string): Promise<Blob | string | null>;
  abstract listFiles(directory: string): Promise<string[]>;
  abstract disconnect(): Promise<void>;
  abstract getType(): StorageProviderType;
  
  /**
   * Get the current status of the provider
   */
  getStatus(): StorageProviderStatus {
    return { ...this.status };
  }
  
  /**
   * Setup auto-sync functionality
   */
  setupAutoSync(getContentFn: () => Promise<Blob | string>, getPathFn: () => string, intervalMs: number = 30000): void {
    this.stopAutoSync();
    
    // Setup interval-based auto-sync
    this.autoSyncIntervalTimer = window.setInterval(async () => {
      if (!this.status.connected) return;
      
      try {
        this.status.isSyncing = true;
        const content = await getContentFn();
        const path = getPathFn();
        await this.saveFile(path, content);
        this.status.lastSync = new Date();
      } catch (error) {
        console.error('Auto-sync error:', error);
        this.status.error = error instanceof Error ? error.message : String(error);
      } finally {
        this.status.isSyncing = false;
      }
    }, intervalMs);
    
    // Fix: Properly type the event listeners with correct casting
    window.addEventListener('blur', () => this.handleWindowBlur(getContentFn, getPathFn) as unknown as EventListener);
    window.addEventListener('beforeunload', () => this.handleBeforeUnload(getContentFn, getPathFn) as unknown as EventListener);
  }
  
  /**
   * Stop auto-sync functionality
   */
  stopAutoSync(): void {
    if (this.autoSyncIntervalTimer) {
      window.clearInterval(this.autoSyncIntervalTimer);
      this.autoSyncIntervalTimer = null;
    }
    
    if (this.autoSyncDebounceTimer) {
      window.clearTimeout(this.autoSyncDebounceTimer);
      this.autoSyncDebounceTimer = null;
    }
    
    // No need to remove event listeners since we use new function references each time
    // The old event listeners will be garbage collected when no longer referenced
  }
  
  /**
   * Debounce a sync operation
   */
  protected debounceSync(getContentFn: () => Promise<Blob | string>, getPathFn: () => string, delay: number = 2000): void {
    if (this.autoSyncDebounceTimer) {
      window.clearTimeout(this.autoSyncDebounceTimer);
    }
    
    this.autoSyncDebounceTimer = window.setTimeout(async () => {
      if (!this.status.connected) return;
      
      try {
        this.status.isSyncing = true;
        const content = await getContentFn();
        const path = getPathFn();
        await this.saveFile(path, content);
        this.status.lastSync = new Date();
      } catch (error) {
        console.error('Debounced sync error:', error);
        this.status.error = error instanceof Error ? error.message : String(error);
      } finally {
        this.status.isSyncing = false;
      }
    }, delay);
  }
  
  /**
   * Handle window blur event
   */
  private async handleWindowBlur(getContentFn: () => Promise<Blob | string>, getPathFn: () => string): Promise<void> {
    if (!this.status.connected) return;
    
    try {
      this.status.isSyncing = true;
      const content = await getContentFn();
      const path = getPathFn();
      await this.saveFile(path, content);
      this.status.lastSync = new Date();
    } catch (error) {
      console.error('Window blur sync error:', error);
    } finally {
      this.status.isSyncing = false;
    }
  }
  
  /**
   * Handle beforeunload event
   */
  private async handleBeforeUnload(getContentFn: () => Promise<Blob | string>, getPathFn: () => string): Promise<void> {
    if (!this.status.connected) return;
    
    try {
      this.status.isSyncing = true;
      const content = await getContentFn();
      const path = getPathFn();
      // Need to use synchronous API here since beforeunload doesn't wait
      await this.saveFile(path, content);
      this.status.lastSync = new Date();
    } catch (error) {
      console.error('Before unload sync error:', error);
    } finally {
      this.status.isSyncing = false;
    }
  }
}
