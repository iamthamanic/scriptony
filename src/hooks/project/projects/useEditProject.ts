
import { Project, ProjectWithCoverImageFile, EditProjectFormData } from "../../../types";
import { useToast } from "../../use-toast";
import { updateProject } from "../../../services/database";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeInspirations } from "@/services/utils";

// Helper function to safely convert ProjectWithCoverImageFile to Project
const convertToProject = (project: ProjectWithCoverImageFile): Project => {
  const { coverImage, ...rest } = project;
  return {
    ...rest,
    coverImage: typeof coverImage === 'string' ? coverImage : null
  };
};

export const useEditProject = (
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  selectedProject: Project | null
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleEditProject = async (data: EditProjectFormData) => {
    if (!selectedProject || !user) return;

    // Ensure inspirations are in array format before calling API
    const inspirationsArray = normalizeInspirations(data.inspirations);

    // Create update data with proper typing for API call
    const updateData: Partial<Project> = {
      title: data.title,
      type: data.type,
      logline: data.logline,
      genres: data.genres,
      duration: data.duration,
      inspirations: inspirationsArray,
      narrativeStructure: data.narrativeStructure || selectedProject.narrativeStructure
    };
    
    // Only include coverImage if it's a string (URL) or undefined
    // File objects will be handled by the updateProject function
    if (typeof data.coverImage === 'string' || data.coverImage === undefined) {
      updateData.coverImage = typeof data.coverImage === 'string' ? data.coverImage : undefined;
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
        inspirations: inspirationsArray,
        narrativeStructure: data.narrativeStructure || selectedProject.narrativeStructure,
        coverImage: data.coverImage,
        updatedAt: new Date()
      };

      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id ? convertToProject(updatedProject) : project
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
