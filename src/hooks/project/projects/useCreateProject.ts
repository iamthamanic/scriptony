
import { useState } from "react";
import { Project, NewProjectFormData } from "../../../types";
import { useToast } from "../../use-toast";
import { narrativeStructureTemplates } from "../../../types/narrativeStructures";
import { createProject } from "../../../services/database";
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
      // Generate scenes from template if needed
      let scenes = [];
      if (data.narrativeStructure && data.narrativeStructure !== 'none') {
        const template = narrativeStructureTemplates[data.narrativeStructure];
        
        if (template) {
          scenes = template.scenes.map((sceneTpl, index) => ({
            projectId: newProjectData.id,
            sceneNumber: sceneTpl.sceneNumber || index + 1,
            location: sceneTpl.location || "",
            timeOfDay: "day",
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
          }));
        }
      }
      
      const newProject = {
        ...newProjectData,
        scenes: []  // Will be populated if template scenes are created
      };
      
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
