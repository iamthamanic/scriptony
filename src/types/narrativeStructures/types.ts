
import type { Scene } from '../scenes';
import type { EmotionalSignificance } from '../common';

export type NarrativeStructureType =
  | 'none'
  | 'hero-journey'
  | 'three-act'
  | 'save-the-cat'
  | 'story-circle'
  | 'tragedy'
  | 'cyclical'
  | 'five-act'
  | 'season-arc'
  | 'procedural'
  | 'character-arc'
  | 'cyclic-beckett'
  | 'episode-brecht'
  | 'three-act-audio'
  | 'narrator-scenes'
  | 'inner-monologue'
  | 'audio-series'
  | 'novel-three-act'
  | 'seven-point'
  | 'snowflake'
  | 'novel-hero-journey'
  | 'hook-impact-punch'
  | 'micro-story'
  | 'problem-solution'
  | 'youtube-hero'
  | 'list-structure'
  | 'tutorial-structure';

export interface NarrativeStructureOption {
  value: NarrativeStructureType;
  label: string;
  description: string;
}

// Define a simplified Scene template type that doesn't require all Scene properties
export interface SceneTemplate {
  sceneNumber: number;
  location: string;
  description: string;
  emotionalSignificance: EmotionalSignificance;
  timeOfDay?: string;
}

export interface StructureTemplate {
  id?: string;  // Make id optional to accommodate existing usage
  name: string;
  description: string;
  suggestedScenes?: SceneTemplate[];
  scenes?: SceneTemplate[]; // For backward compatibility
}

// Function to get structure options based on project type
export const getStructureOptions = (projectType?: string, videoFormat?: string): NarrativeStructureOption[] => {
  // Common structures across all project types
  const common: NarrativeStructureOption[] = [
    { value: 'none', label: 'None', description: 'No specific narrative structure' }
  ];
  
  // Film structures (movie, short film)
  const filmStructures: NarrativeStructureOption[] = [
    { value: 'three-act', label: 'Three Act Structure', description: 'Classic beginning, middle, and end structure' },
    { value: 'hero-journey', label: 'Hero\'s Journey', description: 'Campbell\'s monomyth structure' },
    { value: 'save-the-cat', label: 'Save the Cat', description: 'Blake Snyder\'s 15-beat story structure' }
  ];
  
  // TV series structures
  const seriesStructures: NarrativeStructureOption[] = [
    { value: 'season-arc', label: 'Season Arc', description: 'Overarching story for a full season' },
    { value: 'procedural', label: 'Procedural', description: 'Case-of-the-week format' }
  ];
  
  // Theater structures
  const theaterStructures: NarrativeStructureOption[] = [
    { value: 'five-act', label: 'Five Act Structure', description: 'Classical theatrical structure' },
    { value: 'tragedy', label: 'Classical Tragedy', description: 'Aristotelian tragic structure' },
    { value: 'cyclical', label: 'Cyclical Structure', description: 'Events repeat with variations' },
    { value: 'cyclic-beckett', label: 'Beckettian Structure', description: 'Absurdist circular narrative' },
    { value: 'episode-brecht', label: 'Brechtian Episodes', description: 'Episodic scenes with alienation effect' }
  ];
  
  // Audio structures
  const audioStructures: NarrativeStructureOption[] = [
    { value: 'three-act-audio', label: 'Three Act Audio', description: 'Adapted three-act for audio' },
    { value: 'narrator-scenes', label: 'Narrator with Scenes', description: 'Narration alternating with dramatized scenes' },
    { value: 'inner-monologue', label: 'Inner Monologue', description: 'Character thoughts and internal dialogue' },
    { value: 'audio-series', label: 'Audio Series Arc', description: 'Connected episodes for audio series' }
  ];
  
  // Book structures
  const bookStructures: NarrativeStructureOption[] = [
    { value: 'novel-three-act', label: 'Novel Three Act', description: 'Classic structure adapted for novels' },
    { value: 'seven-point', label: 'Seven Point Story Structure', description: 'Hook, Plot Turn, Pinch, etc.' },
    { value: 'snowflake', label: 'Snowflake Method', description: 'Expanding from simple to complex' },
    { value: 'novel-hero-journey', label: 'Novel Hero\'s Journey', description: 'Hero\'s Journey adapted for novels' }
  ];
  
  // Social media structures
  const socialMediaStructures: NarrativeStructureOption[] = [
    { value: 'hook-impact-punch', label: 'Hook-Impact-Punch', description: 'Quick attention, value, memorable ending' },
    { value: 'micro-story', label: 'Micro Story', description: 'Complete tiny narrative arc' },
    { value: 'problem-solution', label: 'Problem-Solution', description: 'Present issue then solve it' },
    { value: 'youtube-hero', label: 'YouTube Hero Journey', description: 'Simplified hero journey for videos' },
    { value: 'list-structure', label: 'List Structure', description: 'Engaging countdown or ranking format' },
    { value: 'tutorial-structure', label: 'Tutorial Structure', description: 'Step-by-step instructional format' }
  ];
  
  // Return options based on project type
  switch(projectType) {
    case 'movie': return [...common, ...filmStructures];
    case 'short': return [...common, ...filmStructures];
    case 'series': return [...common, ...seriesStructures, ...filmStructures];
    case 'theaterstück': return [...common, ...theaterStructures];
    case 'hörspiel': return [...common, ...audioStructures, ...filmStructures];
    case 'buch': return [...common, ...bookStructures];
    case 'social_video': return [...common, ...socialMediaStructures];
    default: return [...common];
  }
};
