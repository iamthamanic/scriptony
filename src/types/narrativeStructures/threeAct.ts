
import { StructureTemplate, SceneTemplate } from './types';

/**
 * Three-Act Structure narrative template
 */
export const threeActTemplate: StructureTemplate = {
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
