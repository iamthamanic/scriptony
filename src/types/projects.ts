
import type { NarrativeStructureType } from './narrativeStructures';
import type { Genre } from './genres';
import type { Scene } from './scenes';
import type { Character } from './characters';
import type { Episode } from './episodes';

export type ProjectType = 'movie' | 'series' | 'short' | 'theaterstück' | 'hörspiel' | 'buch' | 'social_video';
export type VideoFormat = 'shortform' | 'longform';

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  videoFormat?: VideoFormat;
  logline: string;
  genres: Genre[];
  duration: number; // in minutes
  inspirations: string[];
  coverImage?: string | null;
  scenes: Scene[];
  characters: Character[];
  episodes: Episode[];
  narrativeStructure: NarrativeStructureType;
  createdAt: Date;
  updatedAt: Date;
  world_id?: string | null;
  subscription_tier?: string;
  is_admin?: boolean;
}

export interface NewProjectFormData {
  title: string;
  type: ProjectType;
  videoFormat?: VideoFormat;
  logline: string;
  genres: Genre[];
  duration: number;
  inspirations: string[];
  coverImage?: File;
  narrativeStructure?: NarrativeStructureType;
  world_id?: string;
}

export interface EditProjectFormData {
  title: string;
  type: ProjectType;
  videoFormat?: VideoFormat;
  logline: string;
  genres: Genre[];
  duration: number;
  inspirations: string[];
  coverImage?: File | string;
  narrativeStructure?: NarrativeStructureType;
  world_id?: string | null;
}

export interface ProjectWithCoverImageFile extends Omit<Project, 'coverImage'> {
  coverImage?: string | File | null;
}
