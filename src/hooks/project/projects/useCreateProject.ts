
import { useState } from "react";
import { createProject, createScene } from "../../../services";
import { useProjects } from "../useProjects";
import { useToast } from "../../use-toast";
import { generateDefaultSceneForTemplate } from "../../../utils/mockData";
import { Project, ProjectType, NarrativeStructure, Scene, TimeOfDay } from "../../../types";
import { useAuth } from "@/contexts/AuthContext";

export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addProject } = useProjects();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateProject = async (data: {
    title: string;
    description: string;
    type: ProjectType;
    narrativeStructure?: NarrativeStructure;
    genre?: string;
  }) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Create the project first
      const newProject = await createProject({
        title: data.title,
        description: data.description,
        type: data.type,
        narrativeStructure: data.narrativeStructure,
        genre: data.genre || "unknown"
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
                emotionalSignificance: scene.emotionalSignificance || "regular",
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

        // Add the project to local state
        addProject(newProject);

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
