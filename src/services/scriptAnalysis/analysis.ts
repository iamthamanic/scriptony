
import nlp from 'compromise';
import { AnalysisResult, DetectedScene, DetectedCharacter } from '@/types';
import { ProjectType, Genre, NarrativeStructureType } from '@/types';
import { SCENE_HEADER_PATTERN, CHARACTER_NAME_PATTERN, SHOT_PATTERN, GENRE_KEYWORDS } from './patterns';

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
    narrativeStructure: 'three-act' as NarrativeStructureType,
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

  // Process script for scenes and characters
  const { scenes, characters, metrics } = processScriptContent(lines);
  
  result.scenes = scenes;
  result.characters = characters;

  // Determine project type based on detected patterns
  result.type = determineProjectType(metrics);
  
  // Estimate duration based on scene count
  if (result.scenes.length > 0) {
    if (result.type === 'movie') {
      result.duration = Math.min(180, Math.max(60, result.scenes.length * 2));
    } else if (result.type === 'series') {
      result.duration = Math.min(60, Math.max(20, result.scenes.length));
    }
  }

  // Analyze content for genre detection
  result.genres = detectGenres(text.substring(0, 10000));
  
  // Determine narrative structure
  result.narrativeStructure = determineNarrativeStructure(result.scenes.length);
  
  return result;
}

interface ScriptMetrics {
  sceneHeaderCount: number;
  dialogBlockCount: number;
  shotDescriptionCount: number;
}

/**
 * Process script content to extract scenes, characters, and metrics
 */
function processScriptContent(lines: string[]): { 
  scenes: DetectedScene[], 
  characters: DetectedCharacter[], 
  metrics: ScriptMetrics 
} {
  const scenes: DetectedScene[] = [];
  const characterNames = new Set<string>();
  let currentScene: DetectedScene | null = null;
  let sceneCounter = 0;
  
  // Metrics for project type detection
  const metrics: ScriptMetrics = {
    sceneHeaderCount: 0,
    dialogBlockCount: 0,
    shotDescriptionCount: 0
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Scene header detection
    if (SCENE_HEADER_PATTERN.test(trimmedLine)) {
      metrics.sceneHeaderCount++;
      sceneCounter++;
      
      if (currentScene) {
        scenes.push(currentScene);
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
      
      metrics.dialogBlockCount++;
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
      metrics.shotDescriptionCount++;
    }
    // Add to current scene description
    else if (currentScene && trimmedLine && !CHARACTER_NAME_PATTERN.test(trimmedLine)) {
      currentScene.description += (currentScene.description ? '\n' : '') + trimmedLine;
    }
  });
  
  // Add the last scene if it exists
  if (currentScene) {
    scenes.push(currentScene);
  }
  
  // Convert character names to character objects
  const characters = Array.from(characterNames).map(name => ({
    name,
    role: '',
    description: ''
  }));

  return { scenes, characters, metrics };
}

/**
 * Determine project type based on detected patterns
 */
function determineProjectType(metrics: ScriptMetrics): ProjectType {
  const { sceneHeaderCount, dialogBlockCount, shotDescriptionCount } = metrics;
  
  if (sceneHeaderCount > 5 && dialogBlockCount > 10) {
    if (shotDescriptionCount > 5) {
      return 'movie';
    } else if (sceneHeaderCount > 20) {
      return 'series';
    } else {
      return 'theaterstück';
    }
  } else if (dialogBlockCount > 20 && sceneHeaderCount < 3) {
    return 'hörspiel';
  }
  
  return 'movie'; // Default to movie
}

/**
 * Detect genres based on content keywords
 */
function detectGenres(content: string): Genre[] {
  // Check for genre keywords in the content
  const matchedGenres = Object.entries(GENRE_KEYWORDS)
    .filter(([genre, keywords]) => {
      return keywords.some(keyword => new RegExp(`\\b${keyword}`, 'i').test(content));
    })
    .map(([genre]) => genre as Genre);
  
  return matchedGenres.length > 0 ? matchedGenres.slice(0, 3) as Genre[] : ['drama'];
}

/**
 * Determine narrative structure based on scene count
 */
function determineNarrativeStructure(sceneCount: number): NarrativeStructureType {
  if (sceneCount >= 25) {
    return 'hero-journey';
  } else if (sceneCount >= 15) {
    return 'three-act';
  } else {
    return 'none'; // Simplified to 'none' as it's a valid value
  }
}
