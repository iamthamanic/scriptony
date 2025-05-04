
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

// This is a utility type that helps us handle episode coverImage types in hooks
export interface EpisodeWithCoverImageFile extends Episode {
  coverImage?: string | File;
}

