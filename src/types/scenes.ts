
import type { TimeOfDay } from './common';
import type { EmotionalSignificance } from './common';
import type { CharacterDialog } from './characters';
import type { ColorReference, AudioReference, VisualReference } from './references';
import type { Shot } from './shots';

export interface Scene {
  id: string;
  projectId: string;
  episodeId?: string;
  episodeTitle?: string;
  sceneNumber: number;
  location: string;
  timeOfDay: TimeOfDay;
  timecodeStart: string; // "HH:MM:SS" format
  timecodeEnd: string; // "HH:MM:SS" format
  visualComposition: string;
  lighting: string;
  colorGrading: string;
  soundDesign: string;
  specialEffects: string;
  keyframeImage?: string;
  description: string;
  dialog: string;
  characterDialogs?: CharacterDialog[];
  transitions: string;
  productionNotes: string;
  emotionalSignificance: EmotionalSignificance;
  emotionalNotes?: string;
  characterIds: string[]; // Array of character IDs in the scene
  colorReferences?: ColorReference[];
  audioReferences?: AudioReference[];
  visualReferences?: VisualReference[];
  shots?: Shot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewSceneFormData {
  id?: string;
  projectId: string;
  episodeId?: string;
  episodeTitle?: string;
  sceneNumber: number;
  location: string;
  timeOfDay: TimeOfDay;
  timecodeStart: string;
  timecodeEnd: string;
  visualComposition: string;
  lighting: string;
  colorGrading: string;
  soundDesign: string;
  specialEffects: string;
  keyframeImage?: File;
  description: string;
  dialog: string;
  characterDialogs?: CharacterDialog[];
  transitions: string;
  productionNotes: string;
  emotionalSignificance: EmotionalSignificance;
  emotionalNotes?: string;
  characterIds: string[]; // Array of character IDs in the scene
  colorReferences?: ColorReference[];
  audioReferences?: AudioReference[];
  visualReferences?: VisualReference[];
}
