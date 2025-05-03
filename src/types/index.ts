
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Scene {
  id: string;
  projectId: string;
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
  transitions: string;
  productionNotes: string;
  emotionalSignificance: EmotionalSignificance;
  emotionalNotes?: string;
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
}

export interface NewSceneFormData {
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
  transitions: string;
  productionNotes: string;
  emotionalSignificance: EmotionalSignificance;
  emotionalNotes?: string;
}
