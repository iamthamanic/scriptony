import { storageApi } from "../../api";

export interface UploadOptions {
  bucket?: string;
  path?: string;
  contentType?: string;
}

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const bucket = options.bucket || "uploads";
  const path = options.path || `${Date.now()}_${file.name}`;

  try {
    const { data, error } = await storageApi.uploadFile(bucket, file, path);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Upload failed: No data returned");
    }

    return {
      url: data.url,
      path: data.path,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function getPublicUrl(bucket: string, path: string): Promise<string> {
  try {
    return await storageApi.getPublicUrl(bucket, path);
  } catch (error) {
    console.error("Error getting public URL:", error);
    throw new Error(`Failed to get public URL: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  try {
    const { error } = await storageApi.deleteFile(bucket, path);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function listFiles(bucket: string, prefix?: string): Promise<string[]> {
  try {
    const { data, error } = await storageApi.listFiles(bucket, prefix);
    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error listing files:", error);
    throw new Error(`List failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Re-export API for direct access
export { storageApi } from "../api";
