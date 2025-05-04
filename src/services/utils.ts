
import { toast } from "sonner";
import { Project, NarrativeStructureType, ProjectType, Genre, VideoFormat } from "../types";

interface ErrorHandlingOptions {
  defaultMessage?: string;
  showToast?: boolean;
  throwError?: boolean;
}

// Helper function for handling API errors
export const handleApiError = (error: any, options: ErrorHandlingOptions = {}) => {
  const message = error?.message || options.defaultMessage || "An error occurred";
  console.error("API Error:", error);
  
  if (options.showToast) {
    toast.error(message);
  }
  
  if (options.throwError) {
    throw new Error(message);
  }
};

// Function to convert a database project to our application Project type
export const convertDbProjectToApp = (dbProject: any): Project => {
  return {
    id: dbProject.id,
    title: dbProject.title,
    type: dbProject.type as ProjectType,
    videoFormat: dbProject.video_format as VideoFormat | undefined,
    logline: dbProject.logline || '',
    genres: (dbProject.genres || []) as Genre[],
    duration: parseInt(dbProject.duration),
    inspirations: dbProject.inspirations ? 
      (dbProject.inspirations.includes(',') ? dbProject.inspirations.split(',') : JSON.parse(dbProject.inspirations)) 
      : [],
    coverImage: dbProject.cover_image_url || null,
    scenes: [],  
    characters: [],
    episodes: [],
    narrativeStructure: dbProject.narrative_structure as NarrativeStructureType,
    createdAt: new Date(dbProject.created_at),
    updatedAt: new Date(dbProject.updated_at)
  };
};
