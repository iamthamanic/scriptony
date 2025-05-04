
import { Project } from "../../../types";
import { useToast } from "../../use-toast";
import { deleteProject } from "../../../services/database";
import { useAuth } from "@/contexts/AuthContext";

export const useDeleteProject = (
  projects: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  selectedProjectId: string | null,
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeleteProject = async () => {
    if (!selectedProjectId || !user) return;
    
    const projectToDelete = projects.find(p => p.id === selectedProjectId);
    if (!projectToDelete) return;
    
    const success = await deleteProject(selectedProjectId);
    
    if (success) {
      const updatedProjects = projects.filter(project => project.id !== selectedProjectId);
      const nextProjectId = updatedProjects.length > 0 ? updatedProjects[0].id : null;
      
      setProjects(updatedProjects);
      setSelectedProjectId(nextProjectId);
      
      toast({
        title: "Project Deleted",
        description: `${projectToDelete.title} has been permanently deleted.`,
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return handleDeleteProject;
};
