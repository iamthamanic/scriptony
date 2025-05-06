
import { useState } from "react";
import { createProject, createScene } from "../../../services";
import { Project, ProjectType, NarrativeStructureType, Scene, TimeOfDay, Genre, EmotionalSignificance } from "../../../types";
import { useToast } from "../../use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Function to generate default scenes for a narrative structure template
const generateDefaultSceneForTemplate = (structure: NarrativeStructureType): Partial<Scene>[] => {
  // Basic placeholder implementation
  return [
    { location: "Opening location", description: "Starting scene", emotionalSignificance: "introduction" as EmotionalSignificance },
    { location: "Middle location", description: "Development scene", emotionalSignificance: "buildup" as EmotionalSignificance },
    { location: "Final location", description: "Closing scene", emotionalSignificance: "finale" as EmotionalSignificance },
  ];
};

export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateProject = async (data: {
    title: string;
    type: ProjectType;
    narrativeStructure?: NarrativeStructureType;
    logline?: string;
    genre?: string;
    genres?: Genre[];
    duration?: number;
    inspirations?: string[];
  }) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Ensure genres is properly typed as Genre[]
      const typedGenres: Genre[] = (data.genres || []) as Genre[];
      
      // Create the project first
      const newProject = await createProject({
        title: data.title,
        type: data.type,
        narrativeStructure: data.narrativeStructure,
        logline: data.logline || '',
        genres: typedGenres,
        duration: data.duration || 0,
        inspirations: data.inspirations || []
      });

      if (newProject) {
        // If a narrative structure was selected, generate scenes based on it
        if (data.narrativeStructure && newProject.id) {
          // Create default scenes based on the narrative structure
          let scenePromises: Promise<any>[] = [];
          const scenes = generateDefaultSceneForTemplate(data.narrativeStructure);

          if (scenes && scenes.length > 0) {
            scenes.forEach((scene, index) => {
              const sceneData = {
                projectId: newProject.id,
                sceneNumber: index + 1,
                location: scene.location || "Unknown",
                timeOfDay: scene.timeOfDay as TimeOfDay || "day",
                timecodeStart: "00:00:00",
                timecodeEnd: "00:01:00",
                visualComposition: scene.visualComposition || "",
                lighting: scene.lighting || "",
                colorGrading: scene.colorGrading || "",
                soundDesign: scene.soundDesign || "",
                specialEffects: scene.specialEffects || "",
                description: scene.description || "",
                dialog: scene.dialog || "",
                transitions: scene.transitions || "",
                productionNotes: scene.productionNotes || "",
                emotionalSignificance: scene.emotionalSignificance || "regular" as EmotionalSignificance,
                characterIds: []
              };
              
              // Add to our list of promises
              scenePromises.push(createScene(sceneData));
            });

            // Wait for all scenes to be created
            const createdScenes = await Promise.all(scenePromises);
            newProject.scenes = createdScenes.filter(Boolean) as Scene[];
          }
        }

        toast({
          title: "Project created",
          description: `${data.title} has been created successfully.`,
        });

        return newProject;
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCreateProject,
    isLoading,
  };
};
