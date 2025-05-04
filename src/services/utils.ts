
import { supabase } from "@/integrations/supabase/client";
import { Project } from "../types";

export const handleApiError = (error: unknown, options: { 
  defaultMessage?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  severe?: boolean;
} = {}) => {
  const {
    defaultMessage = "Ein unerwarteter Fehler ist aufgetreten",
    showToast = true,
    logToConsole = true,
    severe = false
  } = options;
  
  // Extract error message
  let errorMessage = defaultMessage;
  let errorDetails = '';
  let errorCode = '';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    if (errorObj.message) errorMessage = errorObj.message;
    if (errorObj.details) errorDetails = errorObj.details;
    if (errorObj.code) errorCode = errorObj.code;
    if (errorObj.error) errorMessage = errorObj.error;
  }
  
  // Log to console in development
  if (logToConsole && process.env.NODE_ENV !== 'production') {
    console.error('[API Error]', error);
  }
  
  // Show toast notification
  if (showToast) {
    import("@/hooks/use-toast").then(({ toast }) => {
      toast({
        variant: 'destructive',
        title: severe ? 'Schwerwiegender Fehler' : 'Fehler',
        description: errorMessage,
      });
    });
  }
  
  return {
    message: errorMessage,
    details: errorDetails,
    code: errorCode,
    severity: severe ? 'critical' : 'error' as 'critical' | 'error'
  };
};

/**
 * Convert database project to application project
 */
export const convertDbProjectToApp = (dbProject: any): Project => {
  return {
    id: dbProject.id,
    title: dbProject.title,
    type: dbProject.type,
    videoFormat: dbProject.video_format,
    logline: dbProject.logline,
    genres: (dbProject.genres || []),
    duration: parseInt(dbProject.duration),
    inspirations: dbProject.inspirations ? JSON.parse(dbProject.inspirations) : [],
    coverImage: dbProject.cover_image_url || null,
    scenes: [],
    characters: [],
    episodes: [],
    narrativeStructure: dbProject.narrative_structure,
    createdAt: new Date(dbProject.created_at),
    updatedAt: new Date(dbProject.updated_at),
  };
};
