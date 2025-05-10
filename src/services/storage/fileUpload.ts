
import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a file to Supabase storage
 * 
 * @param bucket - The storage bucket to upload to
 * @param path - The file path/name inside the bucket
 * @param file - The file to upload
 * @returns Object with url and error properties
 */
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { url: null, error: uploadError };
    }
    
    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("Exception in uploadFileToStorage:", error);
    return { url: null, error: error as Error };
  }
};
