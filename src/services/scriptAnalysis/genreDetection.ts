
import { Genre, ProjectType } from '@/types';
import { GENRE_KEYWORDS } from './patterns';

/**
 * Determine project type based on detected patterns
 */
export function determineProjectType(metrics: { 
  sceneHeaderCount: number, 
  dialogBlockCount: number, 
  shotDescriptionCount: number 
}): ProjectType {
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
export function detectGenres(content: string): Genre[] {
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
export function determineNarrativeStructure(sceneCount: number): 'three-act' | 'hero-journey' | 'none' {
  if (sceneCount >= 25) {
    return 'hero-journey';
  } else if (sceneCount >= 15) {
    return 'three-act';
  } else {
    return 'none'; // Simplified to 'none' as it's a valid value
  }
}
