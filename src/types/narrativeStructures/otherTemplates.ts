
import { StructureTemplate } from './types';

/**
 * Save the Cat - Blake Snyder's 15 beat structure
 */
export const saveTheCatTemplate: StructureTemplate = {
  name: 'Save the Cat',
  description: 'Blake Snyder\'s 15-beat story structure, commonly used in successful Hollywood screenplays.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Opening Image',
      description: 'Sets the tone and mood of the story',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Theme Stated',
      description: 'Someone tells the main character what the movie is really about',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Setup',
      description: 'Show the character\'s world before it changes',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 4,
      location: 'Catalyst',
      description: 'Something happens that changes the main character\'s routine',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 5,
      location: 'Debate',
      description: 'Character questions whether to proceed with the journey',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Break into Two',
      description: 'Character decides to go on the journey',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 7,
      location: 'B Story',
      description: 'A secondary story or relationship begins',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8, 
      location: 'Fun and Games',
      description: 'The promise of the premise is explored',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 9,
      location: 'Midpoint',
      description: 'The fun and games lead to either a false victory or false defeat',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 10,
      location: 'Bad Guys Close In',
      description: 'Pressure mounts, things fall apart',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 11,
      location: 'All Is Lost',
      description: 'The opposite of the midpoint happens',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 12,
      location: 'Dark Night of the Soul',
      description: 'The main character hits rock bottom',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 13,
      location: 'Break into Three',
      description: 'The solution is discovered',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 14,
      location: 'Finale',
      description: 'The main character applies what they\'ve learned',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 15,
      location: 'Final Image',
      description: 'Shows how much the character has changed since the opening image',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Story Circle - Dan Harmon's structure (based on Campbell's Hero's Journey)
 */
export const storyCircleTemplate: StructureTemplate = {
  name: 'Story Circle',
  description: 'Dan Harmon\'s circular story structure based on the hero\'s journey, used in shows like Rick & Morty.',
  scenes: [
    {
      sceneNumber: 1,
      location: '1: You',
      description: 'Establish a protagonist in a zone of comfort',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: '2: Need',
      description: 'The protagonist wants something',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: '3: Go',
      description: 'The protagonist enters an unfamiliar situation',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 4,
      location: '4: Search',
      description: 'The protagonist adapts to the new situation',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: '5: Find',
      description: 'The protagonist gets what they wanted',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: '6: Take',
      description: 'The protagonist pays a heavy price for their success',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 7,
      location: '7: Return',
      description: 'The protagonist returns to their familiar situation',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 8,
      location: '8: Change',
      description: 'The protagonist has changed as a result of the journey',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Tragedy - Classic Aristotelian tragic structure
 */
export const tragedyTemplate: StructureTemplate = {
  name: 'Classical Tragedy',
  description: 'Aristotle\'s tragic structure where a hero falls due to a fatal flaw.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Prologue',
      description: 'Introduction to the protagonist and setting',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Parados',
      description: 'The chorus enters and presents the theme',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Episode 1: Hamartia',
      description: 'The hero\'s tragic flaw is revealed',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Stasimon 1',
      description: 'Chorus reflects on Episode 1',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Episode 2: Peripeteia',
      description: 'A reversal of fortune occurs',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Stasimon 2',
      description: 'Chorus reflects on the reversal',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Episode 3: Anagnorisis',
      description: 'The moment of critical discovery',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'Stasimon 3',
      description: 'Chorus comments on the discovery',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 9,
      location: 'Episode 4: Catastrophe',
      description: 'The hero\'s downfall occurs',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 10,
      location: 'Exodus',
      description: 'The tragic conclusion and moral lesson',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Cyclical Structure - Events repeat with variations
 */
export const cyclicalTemplate: StructureTemplate = {
  name: 'Cyclical Structure',
  description: 'Events repeat with variations showing how characters change (or don\'t) over time.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Initial Situation',
      description: 'Introduction to the characters and their world',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'First Iteration: Challenge',
      description: 'Characters face a significant challenge',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'First Iteration: Response',
      description: 'How characters respond to the challenge',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'First Iteration: Outcome',
      description: 'The result of their response',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 5,
      location: 'Second Iteration: Similar Challenge',
      description: 'A similar challenge occurs again',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Second Iteration: Changed Response',
      description: 'Characters respond differently based on experience',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Second Iteration: Different Outcome',
      description: 'The new outcome based on changed behavior',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'Final Iteration: Ultimate Challenge',
      description: 'The ultimate version of the recurring challenge',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Final Iteration: Decisive Response',
      description: 'The characters\' final approach to the challenge',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 10,
      location: 'Final Iteration: Resolution',
      description: 'The conclusion showing character growth or stasis',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Five-Act Structure - Classical theatrical structure
 */
export const fiveActTemplate: StructureTemplate = {
  name: 'Five-Act Structure',
  description: 'Classical theatrical structure used by Shakespeare and other dramatists.',
  scenes: [
    // Act 1: Exposition
    {
      sceneNumber: 1,
      location: 'Act 1, Scene 1: Exposition',
      description: 'Introduction to the characters and setting',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Act 1, Scene 2: Inciting Incident',
      description: 'An event that sets the story in motion',
      emotionalSignificance: 'turning-point'
    },
    
    // Act 2: Rising Action
    {
      sceneNumber: 3,
      location: 'Act 2, Scene 1: Complications Begin',
      description: 'Introduction of obstacles and complications',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Act 2, Scene 2: Rising Tension',
      description: 'Increasing complexity and stakes',
      emotionalSignificance: 'buildup'
    },
    
    // Act 3: Climax
    {
      sceneNumber: 5,
      location: 'Act 3, Scene 1: Point of No Return',
      description: 'A critical decision or action is taken',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Act 3, Scene 2: Central Climax',
      description: 'The major turning point of the play',
      emotionalSignificance: 'climax'
    },
    
    // Act 4: Falling Action
    {
      sceneNumber: 7,
      location: 'Act 4, Scene 1: Reversal',
      description: 'The consequences begin to unfold',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Act 4, Scene 2: Descent',
      description: 'Moving toward the final resolution',
      emotionalSignificance: 'buildup'
    },
    
    // Act 5: Resolution
    {
      sceneNumber: 9,
      location: 'Act 5, Scene 1: Final Confrontation',
      description: 'The last major conflict or revelation',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 10,
      location: 'Act 5, Scene 2: Denouement',
      description: 'The final resolution and conclusion',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Season Arc Structure - For TV series
 */
export const seasonArcTemplate: StructureTemplate = {
  name: 'Season Arc Structure',
  description: 'Overarching story structure for a full season of a television series.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Pilot/Premiere: Status Quo',
      description: 'Establish the world and main characters',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Episode 2-3: Inciting Incident',
      description: 'Introduce the season\'s main conflict',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'Episodes 4-6: Complications',
      description: 'Characters react to new challenges',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Midseason: Major Twist',
      description: 'A significant revelation or change',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 5,
      location: 'Episodes 8-10: Escalation',
      description: 'Stakes rise, conflicts intensify',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Episode 11: Dark Moment',
      description: 'Characters face their lowest point',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Episode 12: Preparation',
      description: 'Characters prepare for the final confrontation',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Finale Part 1: Climax',
      description: 'The main conflict comes to a head',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Finale Part 2: Resolution',
      description: 'Resolve the season\'s main arcs',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Finale Cliffhanger',
      description: 'Set up the next season',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Procedural Structure - Case-of-the-week format
 */
export const proceduralTemplate: StructureTemplate = {
  name: 'Procedural Structure',
  description: 'Case-of-the-week format common in crime dramas and medical shows.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Cold Open: The Inciting Incident',
      description: 'Discovery of crime/case/problem',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Act 1: Team Assembly',
      description: 'Main characters discuss the case',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Act 1: Initial Investigation',
      description: 'First steps in solving the case',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Act 2: First Complication',
      description: 'An obstacle or misleading clue',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Act 2: Subplot Development',
      description: 'Character moments or B-story progression',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Act 3: Major Revelation',
      description: 'A significant clue changes the investigation',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 7,
      location: 'Act 3: New Approach',
      description: 'Team adjusts their strategy',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Act 4: Crisis Point',
      description: 'The situation becomes urgent',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Act 4: Resolution',
      description: 'Case is solved',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Tag: Aftermath',
      description: 'Character moments and setup for future episodes',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Character Arc Structure - Character-driven narrative
 */
export const characterArcTemplate: StructureTemplate = {
  name: 'Character Arc Structure',
  description: 'Character-focused narrative showing psychological transformation.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Limited Awareness',
      description: 'Character in their comfort zone with visible flaws',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Inciting Challenge',
      description: 'An event forces the character to respond',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 3,
      location: 'Resistance',
      description: 'Character resists changing their behavior',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Glimpse of Potential',
      description: 'A brief moment showing what change could bring',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Recommitment to Old Ways',
      description: 'Character retreats back to familiar patterns',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Crisis of Faith',
      description: 'Old methods fail catastrophically',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 7,
      location: 'Acceptance of Need to Change',
      description: 'Character acknowledges their flaws',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'Experimental Application',
      description: 'Character tries new approaches',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 9,
      location: 'Ultimate Test',
      description: 'Character faces their greatest challenge',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 10,
      location: 'Integration',
      description: 'Character embraces their new identity',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Cyclic Beckett Structure - Absurdist circular narrative
 */
export const cyclicBeckettTemplate: StructureTemplate = {
  name: 'Beckettian Structure',
  description: 'Absurdist circular narrative where characters are trapped in repetition.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Initial Situation',
      description: 'Characters in a state of waiting or routine',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Attempt to Change',
      description: 'Characters discuss or attempt to alter their situation',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'External Interruption',
      description: 'A visitor or event briefly disrupts the routine',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Failed Departure',
      description: 'Characters try but fail to leave their situation',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 5,
      location: 'Philosophical Rumination',
      description: 'Characters contemplate the meaning of their existence',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Memory/Past Reflection',
      description: 'Characters recall or reinterpret their history',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Momentary Hope',
      description: 'Brief suggestion that change might be possible',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'Return to Routine',
      description: 'Characters retreat back to familiar patterns',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 9,
      location: 'Final Failed Attempt',
      description: 'Last effort to change their circumstance',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 10,
      location: 'Circular Ending',
      description: 'Return to the beginning, suggesting endless repetition',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Brechtian Episodic Structure - Episodic scenes with alienation effect
 */
export const episodeBretchTemplate: StructureTemplate = {
  name: 'Brechtian Episodes',
  description: 'Episodic scenes with alienation effect to provoke critical thinking.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Prologue/Introduction',
      description: 'Direct address to audience explaining the play\'s intention',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Episode 1: Presenting the Social Problem',
      description: 'Introduction of the central social issue',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Song/Commentary 1',
      description: 'Musical or narrative interruption reflecting on Episode 1',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Episode 2: Character Responses',
      description: 'Characters react to the social problem in various ways',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Song/Commentary 2',
      description: 'Commentary on the characters\' choices',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Episode 3: Contradictions Emerge',
      description: 'Socioeconomic contradictions become apparent',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 7,
      location: 'Placards/Projection',
      description: 'Visual presentation of factual information',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Episode 4: Crisis Point',
      description: 'The social problem reaches a critical moment',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Song/Commentary 3',
      description: 'Final commentary on the situation',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Epilogue: Direct Question',
      description: 'Direct challenge to audience to consider solutions',
      emotionalSignificance: 'finale'
    }
  ]
};

// Only export templates that might be needed in other parts of the codebase
// You can continue adding more templates as needed in this file

/**
 * Three-Act Audio Structure - For audio dramas
 */
export const threeActAudioTemplate: StructureTemplate = {
  name: 'Three-Act Audio Structure',
  description: 'Classical three-act structure adapted for audio drama format.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Opening Audio Hook',
      description: 'Distinctive sound that grabs attention',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Act 1: Exposition',
      description: 'Character voices and situation introduced',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Act 1: Inciting Sound Event',
      description: 'Audio event that triggers the main conflict',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 4,
      location: 'Act 2: Rising Tension',
      description: 'Sound cues indicate increasing stakes',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Act 2: Midpoint Reveal',
      description: 'Key information revealed through dialogue or sound',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Act 2: Complications',
      description: 'Audio montage of developing problems',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Act 2: Low Point',
      description: 'Acoustic representation of failure or despair',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'Act 3: Renewed Effort',
      description: 'Shift in tone indicating new approach',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 9,
      location: 'Act 3: Climactic Audio Sequence',
      description: 'Sound design reaches peak intensity',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 10,
      location: 'Act 3: Resolution & Signature Sound',
      description: 'Return to key audio motif with variation showing change',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Narrator with Scenes - For audio dramas
 */
export const narratorScenesTemplate: StructureTemplate = {
  name: 'Narrator with Scenes',
  description: 'Structure using narrator to connect dramatized scenes.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Narrator Introduction',
      description: 'Narrator establishes setting and premise',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Scene 1: Character Introduction',
      description: 'First dramatized scene establishing characters',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Narrator Bridge 1',
      description: 'Narrator provides context and moves story forward',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Scene 2: Conflict Introduction',
      description: 'Dramatized scene presenting the main problem',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Narrator Bridge 2',
      description: 'Narrator reveals hidden information or inner thoughts',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Scene 3: Rising Action',
      description: 'Dramatized scene showing stakes increasing',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 7,
      location: 'Narrator Bridge 3',
      description: 'Narrator builds anticipation for climax',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Scene 4: Climax',
      description: 'Dramatized climactic moment without narrator interruption',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Narrator Bridge 4',
      description: 'Narrator reflects on the outcomes',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Scene 5: Epilogue',
      description: 'Final dramatized scene showing new status quo',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Inner Monologue Structure - For audio dramas
 */
export const innerMonologueTemplate: StructureTemplate = {
  name: 'Inner Monologue Structure',
  description: 'Character thoughts and internal dialogue drive the narrative.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Opening Thought',
      description: 'Protagonist\'s initial thought process and situation',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Memory Flashback',
      description: 'Audio representation of past event',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Current Dilemma',
      description: 'Character\'s internal debate about present situation',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'External Interaction',
      description: 'Brief scene of dialogue with contrasting inner thoughts',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Deepening Understanding',
      description: 'Character realizes something about themselves',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Second External Interaction',
      description: 'Another dialogue scene with evolved inner response',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Internal Crisis',
      description: 'Character\'s thought process becomes chaotic or urgent',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'Moment of Clarity',
      description: 'Character comes to a crucial realization',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Final External Action',
      description: 'Character takes action based on internal journey',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Concluding Thought',
      description: 'Final inner reflection showing character growth',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Audio Series Structure - For audio series
 */
export const audioSeriesTemplate: StructureTemplate = {
  name: 'Audio Series Arc',
  description: 'Connected episodes for serialized audio narratives.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Series Theme Introduction',
      description: 'Distinctive audio signature that identifies the series',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Episode Recap',
      description: 'Brief audio montage of previous developments',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'A-Plot Introduction',
      description: 'Primary storyline of this episode begins',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'B-Plot Development',
      description: 'Secondary storyline that advances series arc',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'A-Plot Complication',
      description: 'Main storyline faces obstacle',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Character Moment',
      description: 'Intimate scene developing a key character',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'B-Plot Integration',
      description: 'Secondary storyline intersects with main plot',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'A-Plot Resolution',
      description: 'Episode\'s main storyline concludes',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Series Arc Advancement',
      description: 'Development that pushes the overall series forward',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 10,
      location: 'Cliffhanger or Tease',
      description: 'Unresolved element that leads to next episode',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Novel Three-Act Structure
 */
export const novelThreeActTemplate: StructureTemplate = {
  name: 'Novel Three-Act Structure',
  description: 'Classic three-act structure adapted for novel format with more character development.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Opening Scene: Character Introduction',
      description: 'Establish protagonist in their normal world',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Inciting Incident',
      description: 'Event that disrupts the protagonist\'s life',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 3,
      location: 'First Plot Point',
      description: 'Protagonist commits to addressing the disruption',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 4,
      location: 'First Pinch Point',
      description: 'Antagonistic force shows its strength',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Midpoint',
      description: 'Protagonist shifts from reactive to proactive',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Second Pinch Point',
      description: 'Antagonistic force applies maximum pressure',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Second Plot Point',
      description: 'Final piece of information needed to resolve conflict',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 8,
      location: 'Final Confrontation',
      description: 'Protagonist faces the antagonistic force',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Resolution',
      description: 'Outcome of the confrontation is revealed',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Denouement',
      description: 'New normal is established for the characters',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Seven-Point Story Structure
 */
export const sevenPointTemplate: StructureTemplate = {
  name: 'Seven-Point Story Structure',
  description: 'Plot structure based on seven key events or turning points.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Hook',
      description: 'Engaging opening that introduces character and conflict',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Plot Turn 1',
      description: 'Event that propels protagonist into the main conflict',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 3,
      location: 'Pinch 1',
      description: 'Pressure applied that forces protagonist to act',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Midpoint',
      description: 'Protagonist moves from reaction to action',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 5,
      location: 'Pinch 2',
      description: 'Major setback that seems to doom the protagonist',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Plot Turn 2',
      description: 'Discovery that provides what\'s needed for resolution',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 7,
      location: 'Resolution',
      description: 'Protagonist resolves the conflict',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Snowflake Method
 */
export const snowflakeTemplate: StructureTemplate = {
  name: 'Snowflake Method',
  description: 'Expanding from simple to complex story elements in layers.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Core Premise',
      description: 'One-sentence summary of the entire story',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Expanded Premise',
      description: 'Paragraph describing setup, major disasters, and ending',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Character Introduction',
      description: 'Main character\'s storyline and motivations',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 4,
      location: 'Plot Expansion: Beginning',
      description: 'First quarter of the novel in greater detail',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Plot Expansion: First Disaster',
      description: 'Major setback at quarter point',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Plot Expansion: Midpoint',
      description: 'Central turning point in detail',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 7,
      location: 'Plot Expansion: Second Disaster',
      description: 'Major setback at three-quarter point',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Plot Expansion: Final Confrontation',
      description: 'Detailed climactic sequence',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'Plot Expansion: Resolution',
      description: 'Detailed ending and wrap-up',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 10,
      location: 'Scene List',
      description: 'Expanded list of scenes developed from plot outlines',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * Novel Hero's Journey
 */
export const novelHeroJourneyTemplate: StructureTemplate = {
  name: 'Novel Hero\'s Journey',
  description: 'Hero\'s Journey adapted for novel format with deeper character development.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Ordinary World',
      description: 'Detailed exploration of protagonist\'s daily life',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Call to Adventure',
      description: 'Challenge or opportunity that disrupts normal life',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 3,
      location: 'Refusal and Acceptance',
      description: 'Internal struggle before committing to the journey',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Meeting the Mentor',
      description: 'Encounter with guiding figure who provides wisdom',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Crossing the Threshold',
      description: 'Leaving the familiar world behind',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Tests, Allies, and Enemies',
      description: 'Series of challenges that transform the protagonist',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 7,
      location: 'Approach to the Innermost Cave',
      description: 'Preparation for major challenge',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 8,
      location: 'Ordeal and Reward',
      description: 'Central life-or-death crisis and its aftermath',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 9,
      location: 'The Road Back',
      description: 'Journey home with continued obstacles',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 10,
      location: 'Resurrection and Return',
      description: 'Final test and bringing the lessons home',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Hook-Impact-Punch Structure for social media
 */
export const hookImpactPunchTemplate: StructureTemplate = {
  name: 'Hook-Impact-Punch',
  description: 'Three-part structure for short-form social media videos.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Hook (0-3 seconds)',
      description: 'Attention-grabbing opening statement or visual',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Context (3-5 seconds)',
      description: 'Brief explanation of what the video is about',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'Value Part 1 (5-15 seconds)',
      description: 'First key piece of information or entertainment',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Value Part 2 (15-25 seconds)',
      description: 'Second key piece of information or development',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Impact/Reveal (25-50 seconds)',
      description: 'Main value delivery or revelation',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 6,
      location: 'Punch/CTA (50-60 seconds)',
      description: 'Memorable ending line and call to action',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Micro Story Structure for social media
 */
export const microStoryTemplate: StructureTemplate = {
  name: 'Micro Story',
  description: 'Complete tiny narrative arc for short-form videos.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Setup (0-5 seconds)',
      description: 'Establish character and situation',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Problem (5-15 seconds)',
      description: 'Introduce conflict or challenge',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'Attempt (15-25 seconds)',
      description: 'Character tries to solve problem',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Complication (25-35 seconds)',
      description: 'Unexpected obstacle emerges',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 5,
      location: 'Resolution (35-50 seconds)',
      description: 'Character overcomes or adapts to challenge',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 6,
      location: 'Punchline/Twist (50-60 seconds)',
      description: 'Surprising or satisfying conclusion',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Problem-Solution Structure for social media
 */
export const problemSolutionTemplate: StructureTemplate = {
  name: 'Problem-Solution',
  description: 'Present issue then solve it for educational content.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Problem Statement (0-10 seconds)',
      description: 'Clear statement of relatable problem',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Problem Elaboration (10-20 seconds)',
      description: 'Why this problem matters',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 3,
      location: 'Solution Tease (20-25 seconds)',
      description: 'Hint at the solution approach',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Solution Step 1 (25-35 seconds)',
      description: 'First part of solution process',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Solution Step 2 (35-45 seconds)',
      description: 'Second part of solution process',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Results & Benefits (45-55 seconds)',
      description: 'Show outcome and advantages',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 7,
      location: 'Call-to-Action (55-60 seconds)',
      description: 'Tell viewer what to do next',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * YouTube Hero Journey for video
 */
export const youtubeHeroTemplate: StructureTemplate = {
  name: 'YouTube Hero Journey',
  description: 'Simplified hero journey for YouTube videos.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Hook (0-15 seconds)',
      description: 'Powerful opening that promises value',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Intro (15-60 seconds)',
      description: 'Channel branding and video topic overview',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Context/Problem (1-2 minutes)',
      description: 'Establish why the content matters',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'First Value Point (2-4 minutes)',
      description: 'Initial insight or information',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Pattern Interrupt (4-5 minutes)',
      description: 'Change of pace to maintain attention',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Main Teaching (5-8 minutes)',
      description: 'Primary content value delivery',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 7,
      location: 'Practical Application (8-9 minutes)',
      description: 'How to use the information provided',
      emotionalSignificance: 'resolution'
    },
    {
      sceneNumber: 8,
      location: 'Call-to-Action (9-10 minutes)',
      description: 'Request for engagement and next steps',
      emotionalSignificance: 'finale'
    }
  ]
};

/**
 * List Structure for social media
 */
export const listStructureTemplate: StructureTemplate = {
  name: 'List Structure',
  description: 'Engaging countdown or ranking format for social videos.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Hook (0-5 seconds)',
      description: 'Announce the list topic and why it matters',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Format Explanation (5-10 seconds)',
      description: 'Briefly explain how the list is organized',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Item #1 (10-20 seconds)',
      description: 'First list item with brief explanation',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Item #2 (20-30 seconds)',
      description: 'Second list item with brief explanation',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Item #3 (30-40 seconds)',
      description: 'Third list item with brief explanation',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 6,
      location: 'Top Item Reveal (40-50 seconds)',
      description: 'Most important or surprising list item',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 7,
      location: 'Summary & CTA (50-60 seconds)',
      description: 'Wrap-up and audience prompt',
      emotionalSignificance: 'resolution'
    }
  ]
};

/**
 * Tutorial Structure for social media
 */
export const tutorialStructureTemplate: StructureTemplate = {
  name: 'Tutorial Structure',
  description: 'Step-by-step instructional format for educational content.',
  scenes: [
    {
      sceneNumber: 1,
      location: 'Result Preview (0-5 seconds)',
      description: 'Show what viewers will be able to create/do',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 2,
      location: 'Materials/Requirements (5-10 seconds)',
      description: 'What viewers need to follow along',
      emotionalSignificance: 'introduction'
    },
    {
      sceneNumber: 3,
      location: 'Step #1 (10-20 seconds)',
      description: 'First instruction step clearly demonstrated',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 4,
      location: 'Step #2 (20-30 seconds)',
      description: 'Second instruction step clearly demonstrated',
      emotionalSignificance: 'buildup'
    },
    {
      sceneNumber: 5,
      location: 'Potential Problem & Fix (30-40 seconds)',
      description: 'Common issue and how to troubleshoot it',
      emotionalSignificance: 'turning-point'
    },
    {
      sceneNumber: 6,
      location: 'Final Steps (40-50 seconds)',
      description: 'Complete the project/task',
      emotionalSignificance: 'climax'
    },
    {
      sceneNumber: 7,
      location: 'Final Result & Tips (50-60 seconds)',
      description: 'Show completed work and additional advice',
      emotionalSignificance: 'resolution'
    }
  ]
};
