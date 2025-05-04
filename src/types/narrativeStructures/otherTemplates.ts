
import { StructureTemplate } from './types';

/**
 * Save the Cat narrative structure template
 */
export const saveTheCatTemplate: StructureTemplate = {
  id: 'save-the-cat',
  name: 'Save the Cat',
  description: 'Blake Snyder\'s 15-beat screenplay structure',
  scenes: [
    // Simplified for now - would include all 15 beats
    {
      sceneNumber: 1,
      location: 'Opening Image',
      description: 'Sets the tone and establishes the starting point',
      emotionalSignificance: 'introduction'
    },
    // More scenes would be added here
  ]
};

/**
 * Story Circle narrative structure template
 */
export const storyCircleTemplate: StructureTemplate = {
  id: 'story-circle',
  name: 'Dan Harmon\'s Story Circle',
  description: '8-part story structure based on the Hero\'s Journey',
  scenes: [
    // Simplified for now
    {
      sceneNumber: 1,
      location: 'You - Comfort Zone',
      description: 'Character in their ordinary situation',
      emotionalSignificance: 'introduction'
    },
    // More scenes would be added here
  ]
};

/**
 * Tragedy narrative structure template
 */
export const tragedyTemplate: StructureTemplate = {
  id: 'tragedy',
  name: 'Tragic Structure',
  description: 'Structure for a tragic narrative',
  scenes: [
    // Simplified for now
    {
      sceneNumber: 1,
      location: 'Status Quo',
      description: 'Establish the protagonist and their world',
      emotionalSignificance: 'introduction'
    },
    // More scenes would be added here
  ]
};

/**
 * Cyclical narrative structure template
 */
export const cyclicalTemplate: StructureTemplate = {
  id: 'cyclical',
  name: 'Cyclical Structure',
  description: 'Story structure that ends where it begins',
  scenes: [
    // Simplified for now
    {
      sceneNumber: 1,
      location: 'Beginning/End Point',
      description: 'The point where the story both begins and will eventually end',
      emotionalSignificance: 'introduction'
    },
    // More scenes would be added here
  ]
};
