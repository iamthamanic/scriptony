
import { useState } from "react";
import { Project, NewProjectFormData, SceneTemplate } from "../../../types";
import { useToast } from "../../use-toast";
import { narrativeStructureTemplates } from "../../../types/narrativeStructures";
import { createProject, createScene } from "../../../services/projects";
import { useAuth } from "@/contexts/AuthContext";

export const useCreateProject = (
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateProject = async (data: NewProjectFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a project",
        variant: "destructive"
      });
      return;
    }
    
    const newProjectData = await createProject(data);
    
    if (newProjectData) {
      // Create a new project object to store scenes that will be added
      const newProject = {
        ...newProjectData,
        scenes: [],  // Will be populated if template scenes are created
        characters: [],
        episodes: []
      };
      
      // Generate scenes from template if needed
      if (data.narrativeStructure && data.narrativeStructure !== 'none') {
        const template = narrativeStructureTemplates[data.narrativeStructure];
        
        if (template) {
          // Use scenes or suggestedScenes array from the template
          const templateScenes = (template.scenes || template.suggestedScenes || []) as SceneTemplate[];
          
          // Create each scene in the database AND add to local state
          for (const sceneTpl of templateScenes) {
            const sceneData = {
              projectId: newProjectData.id,
              sceneNumber: sceneTpl.sceneNumber || 0,
              location: sceneTpl.location || "",
              timeOfDay: sceneTpl.timeOfDay || "day",
              timecodeStart: "00:00:00",
              timecodeEnd: "00:00:00",
              visualComposition: "",
              lighting: "",
              colorGrading: "",
              soundDesign: "",
              specialEffects: "",
              description: sceneTpl.description || "",
              dialog: "",
              transitions: "",
              productionNotes: "",
              emotionalSignificance: sceneTpl.emotionalSignificance || "other",
              characterIds: [],
            };
            
            // Create scene in database
            const createdScene = await createScene(sceneData);
            
            // Add the created scene to our local project object
            if (createdScene) {
              newProject.scenes.push(createdScene);
            }
          }
        }
      }
      
      // Update projects state with the new project including all scenes
      setProjects([...projects, newProject]);
      setSelectedProjectId(newProject.id);
      
      toast({
        title: "Project Created",
        description: `${data.title} has been created successfully.`,
        duration: 3000
      });
    }
  };

  return handleCreateProject;
};
