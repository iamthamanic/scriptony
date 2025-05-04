
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

/**
 * This type is now aligned with Episode but allows File type for coverImage
 */
export interface EpisodeWithCoverImageFile {
  id: string;
  projectId: string;
  title: string;
  number: number;
  description: string;
  coverImage?: string | File;
  createdAt: Date;
  updatedAt: Date;
}
