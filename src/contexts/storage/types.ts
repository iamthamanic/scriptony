
import { StorageProviderType, StorageProviderStatus } from '@/lib/storage/StorageProvider';

export interface StorageContextType {
  provider: IStorageProvider | null;
  status: StorageProviderStatus;
  isInitializing: boolean;
  connectProvider: (type: StorageProviderType) => Promise<boolean>;
  disconnectProvider: () => Promise<void>;
  setProjectContext: (projectId: string, projectName: string) => void;
  setupAutoSync: (
    getContentFn: () => Promise<Blob | string>, 
    getPathFn: () => string, 
    intervalMs?: number
  ) => void;
  stopAutoSync: () => void;
}

export interface IStorageProvider {
  connect(): Promise<boolean>;
  isConnected(): Promise<boolean>;
  saveFile(path: string, content: Blob | string): Promise<{
    success: boolean;
    fileUrl?: string;
    filePath?: string;
    fileId?: string;
    error?: string;
  }>;
  readFile(path: string): Promise<Blob | string | null>;
  listFiles(directory: string): Promise<string[]>;
  disconnect(): Promise<void>;
  setupAutoSync?(getContentFn: () => Promise<Blob | string>, getPathFn: () => string, intervalMs?: number): void;
  stopAutoSync?(): void;
  getType(): StorageProviderType;
  getStatus(): StorageProviderStatus;
}
