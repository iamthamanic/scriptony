/**
 * Storage API Service
 * Replaces Supabase Storage with MinIO
 */

import { apiClient } from "../client";

const getStorageUrl = (): string => {
  if (typeof import.meta.env !== "undefined" && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "http://localhost:3000";
};

const getToken = (): string | null => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export interface UploadResponse {
  url: string;
  path: string;
  size: number;
}

export const storageApi = {
  async uploadFile(
    bucket: string,
    file: File,
    path?: string
  ): Promise<{ data: UploadResponse | null; error: Error | null }> {
    const formData = new FormData();
    formData.append("file", file);
    if (path) {
      formData.append("path", path);
    }

    try {
      const response = await fetch(`${getStorageUrl()}/storage/${bucket}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Upload failed"),
      };
    }
  },

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const storageUrl =
      typeof import.meta.env !== "undefined" &&
      import.meta.env.VITE_STORAGE_URL
        ? import.meta.env.VITE_STORAGE_URL
        : "http://localhost:9000";
    return `${storageUrl}/${bucket}/${path}`;
  },

  async deleteFile(bucket: string, path: string) {
    return apiClient.delete(`/storage/${bucket}/${path}`);
  },

  async listFiles(bucket: string, prefix?: string) {
    const query = prefix ? `?prefix=${encodeURIComponent(prefix)}` : "";
    return apiClient.get<string[]>(`/storage/${bucket}/list${query}`);
  },
};
