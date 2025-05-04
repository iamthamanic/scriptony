
// Export all types and templates from the narrative structures module
import { Scene } from '../scenes';
import { NarrativeStructureType, StructureTemplate, getStructureOptions } from './types';
import { heroJourneyTemplate } from './heroJourney';
import { threeActTemplate } from './threeAct';
import { 
  saveTheCatTemplate, 
  storyCircleTemplate,
  tragedyTemplate,
  cyclicalTemplate,
  fiveActTemplate,
  seasonArcTemplate,
  proceduralTemplate,
  characterArcTemplate,
  cyclicBeckettTemplate,
  episodeBretchTemplate,
  threeActAudioTemplate,
  narratorScenesTemplate,
  innerMonologueTemplate,
  audioSeriesTemplate,
  novelThreeActTemplate,
  sevenPointTemplate,
  snowflakeTemplate,
  novelHeroJourneyTemplate,
  hookImpactPunchTemplate,
  microStoryTemplate,
  problemSolutionTemplate,
  youtubeHeroTemplate,
  listStructureTemplate,
  tutorialStructureTemplate
} from './otherTemplates';

// Re-export all the types, options and function
export type { NarrativeStructureType, StructureTemplate };
export { getStructureOptions };

// Create a map of all templates
export const narrativeStructureTemplates: Record<NarrativeStructureType, StructureTemplate | null> = {
  'none': null,
  'hero-journey': heroJourneyTemplate,
  'three-act': threeActTemplate,
  'save-the-cat': saveTheCatTemplate,
  'story-circle': storyCircleTemplate,
  'tragedy': tragedyTemplate,
  'cyclical': cyclicalTemplate,
  'five-act': fiveActTemplate,
  'season-arc': seasonArcTemplate,
  'procedural': proceduralTemplate,
  'character-arc': characterArcTemplate,
  'cyclic-beckett': cyclicBeckettTemplate,
  'episode-brecht': episodeBretchTemplate,
  'three-act-audio': threeActAudioTemplate,
  'narrator-scenes': narratorScenesTemplate,
  'inner-monologue': innerMonologueTemplate,
  'audio-series': audioSeriesTemplate,
  'novel-three-act': novelThreeActTemplate,
  'seven-point': sevenPointTemplate,
  'snowflake': snowflakeTemplate,
  'novel-hero-journey': novelHeroJourneyTemplate,
  'hook-impact-punch': hookImpactPunchTemplate,
  'micro-story': microStoryTemplate,
  'problem-solution': problemSolutionTemplate,
  'youtube-hero': youtubeHeroTemplate,
  'list-structure': listStructureTemplate,
  'tutorial-structure': tutorialStructureTemplate
};
