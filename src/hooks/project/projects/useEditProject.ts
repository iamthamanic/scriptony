
import { Project, ProjectWithCoverImageFile, EditProjectFormData } from "../../../types";
import { useToast } from "../../use-toast";
import { updateProject } from "../../../services/database";
import { useAuth } from "@/contexts/AuthContext";

export const useEditProject = (
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  selectedProject: Project | null
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleEditProject = async (data: EditProjectFormData) => {
    if (!selectedProject || !user) return;

    // Create update data with proper typing for API call
    const updateData: Partial<Project> = {
      title: data.title,
      type: data.type,
      logline: data.logline,
      genres: data.genres,
      duration: data.duration,
      inspirations: data.inspirations,
      narrativeStructure: data.narrativeStructure || selectedProject.narrativeStructure
    };
    
    // Only include coverImage if it's a string (URL) or undefined
    // File objects will be handled by the updateProject function
    if (typeof data.coverImage === 'string' || data.coverImage === undefined) {
      updateData.coverImage = data.coverImage;
    }

    const success = await updateProject(selectedProject.id, updateData);

    if (success) {
      // Use proper type handling for the updated project
      const updatedProject: ProjectWithCoverImageFile = {
        ...selectedProject,
        title: data.title,
        type: data.type,
        logline: data.logline,
        genres: data.genres,
        duration: data.duration,
        inspirations: data.inspirations,
        narrativeStructure: data.narrativeStructure || selectedProject.narrativeStructure,
        coverImage: data.coverImage,
        updatedAt: new Date()
      };

      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id ? {
          ...updatedProject,
          // Ensure coverImage is handled properly for database storage
          coverImage: typeof updatedProject.coverImage === 'string' ? updatedProject.coverImage : null
        } as Project : project
      );

      setProjects(updatedProjects);
      
      toast({
        title: "Project Updated",
        description: `${data.title} has been updated successfully.`,
        duration: 3000
      });
    }
  };

  return handleEditProject;
};
