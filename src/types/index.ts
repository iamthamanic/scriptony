
export type ProjectType = 'movie' | 'series' | 'short';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export type EmotionalSignificance = 
  | 'introduction' 
  | 'buildup' 
  | 'climax' 
  | 'turning-point' 
  | 'resolution' 
  | 'finale' 
  | 'other';

export type Genre = 
  | 'action' 
  | 'adventure' 
  | 'comedy' 
  | 'drama' 
  | 'fantasy' 
  | 'horror' 
  | 'mystery' 
  | 'romance' 
  | 'sci-fi' 
  | 'slice-of-life' 
  | 'supernatural' 
  | 'thriller';

export type ShotType =
  | 'wide' 
  | 'medium' 
  | 'close-up'
  | 'extreme-close-up'
  | 'over-the-shoulder'
  | 'point-of-view'
  | 'aerial'
  | 'dutch-angle'
  | 'two-shot'
  | 'other';

export type CameraMovement =
  | 'static'
  | 'pan'
  | 'tilt'
  | 'zoom'
  | 'dolly'
  | 'tracking'
  | 'crane'
  | 'steadicam'
  | 'handheld'
  | 'other';

export type CameraPerspective =
  | 'eye-level'
  | 'high-angle'
  | 'low-angle'
  | 'birds-eye'
  | 'worms-eye'
  | 'other';

import { NarrativeStructureType } from './narrativeStructures';

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  projectId: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterDialog {
  characterId: string;
  text: string;
}

export interface Episode {
  id: string;
  projectId: string;
  title: string;
  number: number;
  description: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorReference {
  id: string;
  name: string;
  hexCode: string;
}

export interface AudioReference {
  id: string;
  name: string;
  url?: string;
  file?: string;
  isExternal: boolean;
}

export interface VisualReference {
  id: string;
  name: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  logline: string;
  genres: Genre[];
  duration: number; // in minutes
  inspirations: string[];
  coverImage?: string;
  scenes: Scene[];
  characters: Character[];
  episodes: Episode[];
  narrativeStructure: NarrativeStructureType;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shot {
  id: string;
  sceneId: string;
  title: string;
  shotNumber: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  cameraPerspective?: CameraPerspective;
  timecodeStart?: string;
  timecodeEnd?: string;
  description: string;
  image?: string;
  aiNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface NewProjectFormData {
  title: string;
  type: ProjectType;
  logline: string;
  genres: Genre[];
  duration: number;
  inspirations: string[];
  coverImage?: File;
  narrativeStructure?: NarrativeStructureType;
}

export interface EditProjectFormData {
  title: string;
  type: ProjectType;
  logline: string;
  genres: Genre[];
  duration: number;
  inspirations: string[];
  coverImage?: File;
  narrativeStructure?: NarrativeStructureType;
}

export interface NewCharacterFormData {
  name: string;
  role: string;
  description: string;
  avatar?: File;
}

export interface NewSceneFormData {
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

export interface EditCharacterFormData {
  name: string;
  role: string;
  description: string;
  avatar?: File;
}

export interface NewEpisodeFormData {
  title: string;
  number: number;
  description: string;
  coverImage?: File;
}

export interface EditEpisodeFormData {
  title: string;
  number: number;
  description: string;
  coverImage?: File;
}

export interface NewShotFormData {
  title: string;
  shotNumber: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  cameraPerspective?: CameraPerspective;
  timecodeStart?: string;
  timecodeEnd?: string;
  description: string;
  image?: File;
  aiNotes?: string;
}

export interface EditShotFormData {
  title: string;
  shotNumber: number;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  cameraPerspective?: CameraPerspective;
  timecodeStart?: string;
  timecodeEnd?: string;
  description: string;
  image?: File;
  aiNotes?: string;
}
