/**
 * Storage Provider Hook
 * Replaces Supabase storage with MinIO API
 */

import { useState, useCallback, useContext, createContext, ReactNode } from "react";
import { storageApi, UploadResponse } from "@/api";

type StorageProviderType = "supabase" | "google-drive" | "minio";

interface StorageContextType {
  provider: StorageProviderType;
  uploadFile: (file: File, bucket: string, path?: string) => Promise<UploadResponse>;
  getPublicUrl: (bucket: string, path: string) => Promise<string>;
  deleteFile: (bucket: string, path: string) => Promise<void>;
  isLoading: boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useCallback(
    async (file: File, bucket: string, path?: string): Promise<UploadResponse> => {
      setIsLoading(true);
      try {
        const { data, error } = await storageApi.uploadFile(bucket, file, path);
        if (error) {
          throw error;
        }
        if (!data) {
          throw new Error("Upload failed: No data returned");
        }
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getPublicUrl = useCallback(
    async (bucket: string, path: string): Promise<string> => {
      return storageApi.getPublicUrl(bucket, path);
    },
    []
  );

  const deleteFile = useCallback(
    async (bucket: string, path: string): Promise<void> => {
      setIsLoading(true);
      try {
        const { error } = await storageApi.deleteFile(bucket, path);
        if (error) {
          throw error;
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <StorageContext.Provider
      value={{
        provider: "minio",
        uploadFile,
        getPublicUrl,
        deleteFile,
        isLoading,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageProvider() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorageProvider must be used within a StorageProvider");
  }
  return context;
}

// Re-export storage API for direct use
export { storageApi } from "@/api";
