
import { StructureTemplate, SceneTemplate } from './types';

/**
 * Hero's Journey narrative structure template
 */
export const heroJourneyTemplate: StructureTemplate = {
  name: 'Hero\'s Journey',
  description: 'The classic 12-step hero journey structure',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Ordinary World',
      description: 'Introduction to everyday life and main character',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Call to Adventure',
      description: 'Problem or invitation to change',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'Refusal of the Call',
      description: 'The hero hesitates or doubts',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Meeting the Mentor',
      description: 'A character helps the hero',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Crossing the Threshold',
      description: 'The hero leaves their world',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Tests, Allies, Enemies',
      description: 'Conflicts, alliances, opponents',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Approach to the Innermost Cave',
      description: 'Highest risk, emotional crisis',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Ordeal',
      description: 'Hero faces the test, receives reward',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Road Back',
      description: 'Journey home, new insights',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Resurrection',
      description: 'Final test, transformation',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 11,
      location: 'Return with the Elixir',
      description: 'The hero brings a solution',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 12,
      location: 'Epilogue',
      description: 'Optional: Conclusion, aftermath',
      emotionalSignificance: 'finale'
    }
  ]
};
