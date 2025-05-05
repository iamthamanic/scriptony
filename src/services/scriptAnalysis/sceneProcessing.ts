
import { DetectedScene, DetectedCharacter } from '@/types';
import { SCENE_HEADER_PATTERN, CHARACTER_NAME_PATTERN, SHOT_PATTERN } from './patterns';

interface ScriptMetrics {
  sceneHeaderCount: number;
  dialogBlockCount: number;
  shotDescriptionCount: number;
}

/**
 * Process script content to extract scenes, characters, and metrics
 */
export function processScriptContent(lines: string[]): { 
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

export interface ScriptMetrics {
  sceneHeaderCount: number;
  dialogBlockCount: number;
  shotDescriptionCount: number;
}
