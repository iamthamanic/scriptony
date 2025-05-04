
import type { EmotionalSignificance } from '../common';

/**
 * Core narrative structure types
 */

export type NarrativeStructureType = 
  | 'none'
  | 'hero-journey'
  | 'three-act'
  | 'save-the-cat'
  | 'story-circle'
  | 'tragedy'
  | 'cyclical';

export interface StructureTemplate {
  id: NarrativeStructureType;
  name: string;
  description: string;
  scenes: Array<{
    sceneNumber: number;
    location: string;
    description: string;
    emotionalSignificance?: string;
  }>;
}

export const narrativeStructureOptions = [
  { value: 'none', label: 'No Structure – Build Manually' },
  { value: 'hero-journey', label: 'Hero\'s Journey (12 Steps)' },
  { value: 'three-act', label: 'Three-Act Structure' },
  { value: 'save-the-cat', label: 'Save the Cat (15 Beats)' },
  { value: 'story-circle', label: 'Dan Harmon\'s Story Circle' },
  { value: 'tragedy', label: 'Tragic Structure' },
  { value: 'cyclical', label: 'Cyclical Structure' }
];
