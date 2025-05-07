
import { useState } from "react";
import { createProject, createScene } from "../../../services";
import { Project, ProjectType, NarrativeStructureType, Scene, TimeOfDay, Genre, EmotionalSignificance } from "../../../types";
import { useToast } from "../../use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { narrativeStructureTemplates } from "@/types/narrativeStructures";

// Function to generate scenes based on a narrative structure template
const generateDefaultScenesForTemplate = (structure: NarrativeStructureType): Partial<Scene>[] => {
  // Get the template for the selected structure
  const template = narrativeStructureTemplates[structure];
  
  // If no template exists or it doesn't have scenes defined, return empty array
  if (!template || (!template.scenes && !template.suggestedScenes)) {
    return [];
  }
  
  // Use either suggestedScenes or scenes property (for backward compatibility)
  const sceneTemplates = template.suggestedScenes || template.scenes || [];
  
  // Map the scene templates to partial Scene objects
  return sceneTemplates.map(sceneTemplate => ({
    sceneNumber: sceneTemplate.sceneNumber,
    location: sceneTemplate.location || "Location TBD",
    timeOfDay: sceneTemplate.timeOfDay as TimeOfDay || "day",
    description: sceneTemplate.description || "",
    emotionalSignificance: sceneTemplate.emotionalSignificance || "regular" as EmotionalSignificance,
  }));
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
        console.log("Project created successfully:", newProject);
        
        // If a narrative structure was selected, generate scenes based on it
        if (data.narrativeStructure && data.narrativeStructure !== 'none' && newProject.id) {
          console.log("Creating scenes for narrative structure:", data.narrativeStructure);
          
          // Create default scenes based on the narrative structure
          let scenePromises: Promise<any>[] = [];
          const scenes = generateDefaultScenesForTemplate(data.narrativeStructure);
          console.log("Generated scenes:", scenes);

          if (scenes && scenes.length > 0) {
            scenes.forEach((scene, index) => {
              const sceneData = {
                projectId: newProject.id,
                sceneNumber: scene.sceneNumber || index + 1,
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
              
              console.log("Creating scene:", sceneData);
              
              // Add to our list of promises
              scenePromises.push(createScene(sceneData));
            });

            // Wait for all scenes to be created
            const createdScenes = await Promise.all(scenePromises);
            console.log("Created scenes:", createdScenes);
            newProject.scenes = createdScenes.filter(Boolean) as Scene[];
          }
        }

        toast({
          title: "Project created",
          description: `${data.title} has been created successfully.`,
          duration: 3000
        });

        return newProject;
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
        duration: 3000
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
