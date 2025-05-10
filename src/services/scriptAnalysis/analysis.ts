
import { AnalysisResult, TimeOfDay } from '@/types';
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
  
  // Convert detected scenes to proper Scene objects
  result.scenes = scenes.map(s => ({
    id: `scene-${s.sceneNumber}`,
    projectId: 'temp-project',
    sceneNumber: s.sceneNumber,
    location: s.location,
    timeOfDay: s.timeOfDay.toLowerCase() as TimeOfDay,
    timecodeStart: '00:00:00',
    timecodeEnd: '00:00:00',
    description: s.description,
    characterIds: s.characters,
    createdAt: new Date(),
    updatedAt: new Date(),
    dialog: '',
    transitions: '',
    productionNotes: '',
    emotionalSignificance: 'other',
    emotionalNotes: '',
    visualComposition: '',
    lighting: '',
    colorGrading: '',
    soundDesign: '',
    specialEffects: ''
  }));
  
  // Convert detected characters to proper Character objects
  result.characters = characters.map(c => ({
    id: `character-${c.name.replace(/\s+/g, '-').toLowerCase()}`,
    projectId: 'temp-project',
    name: c.name,
    role: c.role,
    description: c.description,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

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
