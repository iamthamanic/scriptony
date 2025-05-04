
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import nlp from 'compromise';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, ProjectType, NarrativeStructureType, Genre } from '@/types';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

// Script format patterns
const SCENE_HEADER_PATTERN = /^(INT|EXT|INT\/EXT|INT\.\/EXT\.|INT\s*?[.-]\s*?EXT|SCENE)\b.*?$/i;
const CHARACTER_NAME_PATTERN = /^[A-Z][A-Z\s\d.,'\-!?()]*(?:\(.*?\))?$/;
const SHOT_PATTERN = /^(WIDE SHOT|MEDIUM SHOT|CLOSE UP|CU|MS|WS|ECU|EXTREME CLOSE UP|POV)/i;

export interface ScriptAnalysisOptions {
  fileName: string;
  fileContent: ArrayBuffer | string;
  fileType: 'pdf' | 'docx' | 'txt';
}

/**
 * Extract text content from different file types
 */
export async function extractTextFromFile({ fileName, fileContent, fileType }: ScriptAnalysisOptions): Promise<string> {
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
    throw new Error(`Failed to extract text from ${fileName}: ${error.message}`);
  }
}

/**
 * Analyze script text and detect project properties
 */
export async function analyzeScriptText(text: string): Promise<AnalysisResult> {
  // Split text into lines for analysis
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  
  // Initialize result object
  const result: AnalysisResult = {
    title: '',
    type: 'movie' as ProjectType,
    narrativeStructure: 'three_act' as NarrativeStructureType,
    scenes: [],
    characters: [],
    genres: [] as Genre[],
    duration: 90
  };
  
  // Try to detect the title (often at the beginning of the script)
  const potentialTitles = lines.slice(0, 20).filter(line => 
    line.match(/^[\s\t]*[A-Z][A-Z\s]+$/) && 
    !line.match(SCENE_HEADER_PATTERN)
  );
  
  if (potentialTitles.length > 0) {
    result.title = potentialTitles[0].trim();
  } else {
    // Fallback title based on content
    const doc = nlp(text.substring(0, 5000));
    const nouns = doc.nouns().out('array');
    result.title = nouns.length > 0 
      ? `${nouns[0]} ${nouns.length > 1 ? nouns[1] : ''}`.trim() 
      : 'Untitled Script';
  }

  // Detect scenes
  let currentScene = null;
  let sceneCounter = 0;
  
  // Character detection
  const characterNames = new Set<string>();
  
  // Detect medium type based on formatting patterns
  let sceneHeaderCount = 0;
  let dialogBlockCount = 0;
  let shotDescriptionCount = 0;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Scene header detection
    if (SCENE_HEADER_PATTERN.test(trimmedLine)) {
      sceneHeaderCount++;
      sceneCounter++;
      
      if (currentScene) {
        result.scenes.push(currentScene);
      }
      
      // Extract location from scene header
      const locationMatch = trimmedLine.match(/(?:INT|EXT|INT\/EXT|INT\.\/EXT\.|INT\s*?[.-]\s*?EXT|SCENE)\b\s*[-.]?\s*(.+?)(?:\s*[-–—]\s*|\s*$)/i);
      const location = locationMatch ? locationMatch[1].trim() : 'Unknown Location';
      
      // Extract time of day 
      const timeMatch = trimmedLine.match(/\s*[-–—]\s*(.+)$/);
      const timeOfDay = timeMatch ? timeMatch[1].trim().toLowerCase() : 'day';
      
      currentScene = {
        sceneNumber: sceneCounter,
        location: location,
        timeOfDay: timeOfDay,
        description: '',
        characters: []
      };
    } 
    // Character name detection
    else if (CHARACTER_NAME_PATTERN.test(trimmedLine) && 
            trimmedLine.length < 50 && 
            !trimmedLine.match(/^(INT|EXT|FADE|CUT)/i)) {
      
      dialogBlockCount++;
      const characterName = trimmedLine.replace(/\(.*?\)/, '').trim();
      
      if (characterName && characterName.length > 1) {
        characterNames.add(characterName);
        
        if (currentScene) {
          if (!currentScene.characters.includes(characterName)) {
            currentScene.characters.push(characterName);
          }
        }
      }
    }
    // Shot description detection
    else if (SHOT_PATTERN.test(trimmedLine)) {
      shotDescriptionCount++;
    }
    // Add to current scene description
    else if (currentScene && trimmedLine && !CHARACTER_NAME_PATTERN.test(trimmedLine)) {
      currentScene.description += (currentScene.description ? '\n' : '') + trimmedLine;
    }
  });
  
  // Add the last scene if it exists
  if (currentScene) {
    result.scenes.push(currentScene);
  }
  
  // Add unique characters to result
  result.characters = Array.from(characterNames).map(name => ({
    name,
    role: '',
    description: ''
  }));
  
  // Determine project type based on detected patterns
  if (sceneHeaderCount > 5 && dialogBlockCount > 10) {
    if (shotDescriptionCount > 5) {
      result.type = 'movie';
    } else if (sceneHeaderCount > 20) {
      result.type = 'series';
    } else {
      result.type = 'theaterstück';
    }
  } else if (dialogBlockCount > 20 && sceneHeaderCount < 3) {
    result.type = 'hörspiel';
  }
  
  // Estimate duration based on scene count
  if (result.scenes.length > 0) {
    if (result.type === 'movie') {
      result.duration = Math.min(180, Math.max(60, result.scenes.length * 2));
    } else if (result.type === 'series') {
      result.duration = Math.min(60, Math.max(20, result.scenes.length));
    }
  }
  
  // Analyze content for genre detection
  const contentSample = text.substring(0, 10000);
  const doc = nlp(contentSample);
  
  // Simple genre detection based on keywords
  const genreKeywords = {
    'action': ['fight', 'explosion', 'chase', 'gun', 'weapon', 'battle'],
    'adventure': ['journey', 'exploration', 'quest', 'discover', 'expedition'],
    'comedy': ['laugh', 'joke', 'funny', 'humor', 'hilarious', 'comedy'],
    'drama': ['emotional', 'conflict', 'relationship', 'struggle', 'tension'],
    'fantasy': ['magic', 'dragon', 'spell', 'wizard', 'enchant', 'mythical'],
    'horror': ['fear', 'terrify', 'scream', 'monster', 'ghost', 'blood'],
    'mystery': ['clue', 'suspect', 'detective', 'mystery', 'solve', 'secret'],
    'romance': ['love', 'kiss', 'romantic', 'relationship', 'date', 'passion'],
    'sci-fi': ['technology', 'space', 'alien', 'future', 'robot', 'science'],
    'thriller': ['suspense', 'danger', 'threat', 'tension', 'killer', 'chase']
  };
  
  // Check for genre keywords in the content
  const matchedGenres = Object.entries(genreKeywords)
    .filter(([genre, keywords]) => {
      return keywords.some(keyword => new RegExp(`\\b${keyword}`, 'i').test(contentSample));
    })
    .map(([genre]) => genre as Genre);
  
  result.genres = matchedGenres.length > 0 ? matchedGenres.slice(0, 3) as Genre[] : ['drama'];
  
  // Determine narrative structure
  if (result.scenes.length > 0) {
    if (result.scenes.length >= 25) {
      result.narrativeStructure = 'hero_journey';
    } else if (result.scenes.length >= 15) {
      result.narrativeStructure = 'three_act';
    } else {
      result.narrativeStructure = 'basic';
    }
  }
  
  return result;
}

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
