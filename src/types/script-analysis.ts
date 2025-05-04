
import { ProjectType, NarrativeStructureType, Genre } from './projects';

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
