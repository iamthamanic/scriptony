
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
    if (!selectedProjectId || !user) {
      console.log("Cannot delete: No project selected or user not authenticated");
      return;
    }
    
    const projectToDelete = projects.find(p => p.id === selectedProjectId);
    if (!projectToDelete) {
      console.log("Cannot find project to delete with ID:", selectedProjectId);
      return;
    }
    
    try {
      console.log("Deleting project:", selectedProjectId);
      const success = await deleteProject(selectedProjectId);
      
      if (success) {
        const updatedProjects = projects.filter(project => project.id !== selectedProjectId);
        const nextProjectId = updatedProjects.length > 0 ? updatedProjects[0].id : null;
        
        console.log("Project deleted successfully. Updating projects list and selection.");
        setProjects(updatedProjects);
        setSelectedProjectId(nextProjectId);
        
        toast({
          title: "Project Deleted",
          description: `${projectToDelete.title} has been permanently deleted.`,
          variant: "destructive",
          duration: 3000
        });
      } else {
        console.error("Delete operation returned false");
        toast({
          title: "Delete Failed",
          description: "Unable to delete the project. Please try again.",
          variant: "destructive",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Delete Error",
        description: "An error occurred while deleting the project.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return handleDeleteProject;
};
