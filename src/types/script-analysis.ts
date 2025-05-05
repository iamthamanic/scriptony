
import { ProjectType, Genre } from './projects';
import { NarrativeStructureType } from './narrativeStructures/types';

export interface DetectedScene {
  sceneNumber: number;
  location: string;
  timeOfDay: string;
  description: string;
  characters: string[];
}

export interface DetectedCharacter {
  name: string;
  role: string;
  description: string;
}

export interface AnalysisResult {
  title: string;
  type: ProjectType;
  narrativeStructure: NarrativeStructureType;
  scenes: DetectedScene[];
  characters: DetectedCharacter[];
  genres: Genre[];
  duration: number;
}
