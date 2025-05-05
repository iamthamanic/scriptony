
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult } from '@/types';
import { extractTextFromFile } from './textExtraction';
import { analyzeScriptText } from './analysis';

/**
 * Upload and analyze a script file
 */
export async function uploadAndAnalyzeScript(file: File): Promise<{analysisResult: AnalysisResult, fileUrl: string | null}> {
  try {
    // Determine file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    let parsableType: 'pdf' | 'docx' | 'txt';
    
    switch (fileType) {
      case 'pdf':
        parsableType = 'pdf';
        break;
      case 'docx':
        parsableType = 'docx';
        break;
      default:
        parsableType = 'txt';
    }
    
    // Read file content
    const fileArrayBuffer = await file.arrayBuffer();
    
    // Extract text content from file
    const textContent = await extractTextFromFile({
      fileName: file.name,
      fileContent: fileArrayBuffer,
      fileType: parsableType
    });
    
    // Upload file to storage
    const filePath = `script-uploads/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project_assets')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading script file:', uploadError);
      throw uploadError;
    }
    
    // Get file URL
    const { data: { publicUrl } } = supabase.storage
      .from('project_assets')
      .getPublicUrl(filePath);
    
    // Analyze text content
    const analysisResult = await analyzeScriptText(textContent);
    
    return { 
      analysisResult,
      fileUrl: publicUrl
    };
  } catch (error) {
    console.error('Error in uploadAndAnalyzeScript:', error);
    throw error;
  }
}
