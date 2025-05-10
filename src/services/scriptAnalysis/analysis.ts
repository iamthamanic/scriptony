
import { AnalysisResult } from '@/types';
import { processScriptContent } from './sceneProcessing';
import { determineProjectType, detectGenres, determineNarrativeStructure } from './genreDetection';
import { detectScriptTitle } from './titleDetection';

/**
 * Analyze script text and detect project properties
 */
export async function analyzeScriptText(text: string): Promise<AnalysisResult> {
  // Split text into lines for analysis
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  
  // Initialize result object
  const result: AnalysisResult = {
    title: '',
    type: 'movie',
    narrative_structure: 'three-act',
    scenes: [],
    characters: [],
    genres: [],
    duration: 90
  };
  
  // Detect title
  result.title = detectScriptTitle(lines);
  
  // Process script for scenes and characters
  const { scenes, characters, metrics } = processScriptContent(lines);
  
  // Note: We'll need proper conversion of DetectedScene to Scene and DetectedCharacter to Character
  // This is a placeholder - in a real implementation, you would map these properly
  result.scenes = scenes.map(s => ({
    id: `scene-${s.sceneNumber}`,
    projectId: 'temp-project',
    sceneNumber: s.sceneNumber,
    location: s.location,
    timeOfDay: s.timeOfDay,
    timecodeStart: '00:00:00',
    timecodeEnd: '00:00:00',
    description: s.description,
    characterIds: s.characters,
    createdAt: new Date(),
    updatedAt: new Date(),
    dialog: '',
    transitions: '',
    production_notes: '',
    emotional_significance: 'other',
    emotional_notes: ''
  })) as any;
  
  result.characters = characters.map(c => ({
    id: `character-${c.name.replace(/\s+/g, '-').toLowerCase()}`,
    projectId: 'temp-project',
    name: c.name,
    role: c.role,
    description: c.description,
    createdAt: new Date(),
    updatedAt: new Date()
  })) as any;

  // Determine project type based on detected patterns
  result.type = determineProjectType(metrics);
  
  // Estimate duration based on scene count
  if (result.scenes && result.scenes.length > 0) {
    if (result.type === 'movie') {
      result.duration = Math.min(180, Math.max(60, result.scenes.length * 2));
    } else if (result.type === 'series') {
      result.duration = Math.min(60, Math.max(20, result.scenes.length));
    }
  }

  // Analyze content for genre detection
  result.genres = detectGenres(text.substring(0, 10000));
  
  // Determine narrative structure
  result.narrative_structure = determineNarrativeStructure(result.scenes?.length || 0);
  
  return result;
}
