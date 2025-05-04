
import { Scene } from './index';

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
  scenes: Partial<Scene>[];
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

// Template for Hero's Journey
export const heroJourneyTemplate: StructureTemplate = {
  id: 'hero-journey',
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

// Template for Three-Act Structure
export const threeActTemplate: StructureTemplate = {
  id: 'three-act',
  name: 'Three-Act Structure',
  description: 'The traditional three-act structure',
  scenes: [
    // Act 1: Setup
    {
      sceneNumber: 1,
      location: 'Act 1: Opening',
      description: 'Introduce main character and setting',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Act 1: Inciting Incident',
      description: 'Event that sets the story in motion',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'Act 1: Plot Point One',
      description: 'Character decides to pursue goal',
      emotionalSignificance: 'turning-point'
    },
    
    // Act 2: Confrontation
    {
      sceneNumber: 4,
      location: 'Act 2: Rising Action',
      description: 'Character works toward goal, faces obstacles',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Act 2: Midpoint',
      description: 'Major shift in the story',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Act 2: Plot Point Two',
      description: 'Crisis that forces the final confrontation',
      emotionalSignificance: 'turning-point'
    },
    
    // Act 3: Resolution
    {
      sceneNumber: 7,
      location: 'Act 3: Climax',
      description: 'Final confrontation with main obstacle',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 8,
      location: 'Act 3: Resolution',
      description: 'Wrap up the story and subplots',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 9,
      location: 'Act 3: Denouement',
      description: 'New normal after the story',
      emotionalSignificance: 'finale'
    }
  ]
};

// Add other templates with similar structure
export const narrativeStructureTemplates: Record<NarrativeStructureType, StructureTemplate | null> = {
  'none': null,
  'hero-journey': heroJourneyTemplate,
  'three-act': threeActTemplate,
  'save-the-cat': {
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
  },
  'story-circle': {
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
  },
  'tragedy': {
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
  },
  'cyclical': {
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
  }
};
