
export interface Episode {
  id: string;
  projectId: string;
  title: string;
  number: number;
  description: string;
  coverImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  coverImage?: File | string;
}

export interface EpisodeWithCoverImageFile {
  id: string;
  projectId: string;
  title: string;
  number: number;
  description: string;
  coverImage?: string | File | null;
  createdAt: Date;
  updatedAt: Date;
}
