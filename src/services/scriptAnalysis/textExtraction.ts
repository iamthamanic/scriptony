
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export interface TextExtractionOptions {
  fileName: string;
  fileContent: ArrayBuffer | string;
  fileType: 'pdf' | 'docx' | 'txt';
}

/**
 * Extract text content from different file types
 */
export async function extractTextFromFile({ fileName, fileContent, fileType }: TextExtractionOptions): Promise<string> {
  try {
    switch (fileType) {
      case 'pdf': {
        // Load the PDF document
        const pdfDoc = await pdfjsLib.getDocument({ data: fileContent }).promise;
        let fullText = '';
        
        // Loop through each page and extract text
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map(item => 'str' in item ? item.str : '')
            .join(' ');
          
          fullText += pageText + '\n';
        }
        
        return fullText;
      }
      
      case 'docx': {
        const result = await mammoth.extractRawText({ arrayBuffer: fileContent as ArrayBuffer });
        return result.value;
      }
      
      case 'txt': {
        // For text files, we just need to decode the content
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(fileContent as ArrayBuffer);
      }
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text from ${fileName}: ${(error as Error).message}`);
  }
}
