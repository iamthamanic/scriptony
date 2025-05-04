
// Export all types and templates from the narrative structures module
import { Scene } from '../scenes';
import { NarrativeStructureType, StructureTemplate, narrativeStructureOptions } from './types';
import { heroJourneyTemplate } from './heroJourney';
import { threeActTemplate } from './threeAct';
import { 
  saveTheCatTemplate, 
  storyCircleTemplate,
  tragedyTemplate,
  cyclicalTemplate
} from './otherTemplates';

// Re-export all the types and options
export type { NarrativeStructureType, StructureTemplate };
export { narrativeStructureOptions };

// Create a map of all templates
export const narrativeStructureTemplates: Record<NarrativeStructureType, StructureTemplate | null> = {
  'none': null,
  'hero-journey': heroJourneyTemplate,
  'three-act': threeActTemplate,
  'save-the-cat': saveTheCatTemplate,
  'story-circle': storyCircleTemplate,
  'tragedy': tragedyTemplate,
  'cyclical': cyclicalTemplate
};
