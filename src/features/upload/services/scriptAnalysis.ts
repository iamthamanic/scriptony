
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, Scene, Character, Genre, NarrativeStructureType, ProjectType, TimeOfDay } from '@/types';

export const uploadAndAnalyzeScript = async (file: File): Promise<{ analysisResult: AnalysisResult }> => {
  try {
    console.log('Starting script analysis for:', file.name);
    
    // For this refactor, we'll create a mock implementation 
    // that returns a simulated analysis result after a delay
    // In a real application, this would call the actual service
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create proper Scene objects for the mock data
    const scene1: Scene = {
      id: "scene-1",
      projectId: "mock-project",
      sceneNumber: 1,
      location: "INTERIOR - LIVING ROOM",
      timeOfDay: "day" as TimeOfDay, // Fix the time of day to use lowercase
      timecodeStart: "00:00:00",
      timecodeEnd: "00:01:30",
      description: "A character sits on a couch, reading a book.",
      characterIds: ["ALEX"],
      dialog: "",
      transitions: "",
      production_notes: "",
      emotional_significance: "other",
      emotional_notes: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const scene2: Scene = {
      id: "scene-2",
      projectId: "mock-project",
      sceneNumber: 2,
      location: "EXTERIOR - PARK",
      timeOfDay: "evening" as TimeOfDay, // Fix the time of day to use lowercase
      timecodeStart: "00:01:30",
      timecodeEnd: "00:03:00",
      description: "Two characters walk through a park, deep in conversation.",
      characterIds: ["ALEX", "JAMIE"],
      dialog: "",
      transitions: "",
      production_notes: "",
      emotional_significance: "other",
      emotional_notes: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const character1: Character = {
      id: "char-1",
      projectId: "mock-project",
      name: "ALEX",
      role: "Protagonist",
      description: "A thoughtful person in their 30s.",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const character2: Character = {
      id: "char-2",
      projectId: "mock-project",
      name: "JAMIE",
      role: "Supporting Character",
      description: "Alex's friend and confidant.",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const analysisResult: AnalysisResult = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      type: "movie" as ProjectType,
      logline: "A sample logline for the analyzed script.",
      genres: ["drama"] as Genre[],
      scenes: [scene1, scene2],
      characters: [character1, character2],
      narrative_structure: "three-act" as NarrativeStructureType,
      duration: 90
    };
    
    console.log('Analysis complete:', analysisResult);
    return { analysisResult };
    
  } catch (error) {
    console.error('Error analyzing script:', error);
    throw new Error('Failed to analyze script');
  }
};

export const saveAnalysisResult = async (analysisResult: AnalysisResult, userId: string): Promise<string> => {
  // In a real implementation, this would save the analysis to the database
  console.log('Saving analysis result for user:', userId);
  console.log('Analysis data:', analysisResult);
  
  // Return a placeholder project ID
  return "new-project-id";
};
