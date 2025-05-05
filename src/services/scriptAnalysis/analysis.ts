
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
    narrativeStructure: 'three-act',
    scenes: [],
    characters: [],
    genres: [],
    duration: 90
  };
  
  // Detect title
  result.title = detectScriptTitle(lines);
  
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
