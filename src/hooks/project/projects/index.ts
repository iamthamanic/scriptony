
import { useProjectData } from "./useProjectData";
import { useCreateProject } from "./useCreateProject";
import { useEditProject } from "./useEditProject";
import { useDeleteProject } from "./useDeleteProject";

export const useProjects = () => {
  const {
    projects,
    setProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    isLoading
  } = useProjectData();

  const { handleCreateProject, isLoading: isCreating } = useCreateProject();
  const handleEditProject = useEditProject(projects, setProjects, selectedProject);
  const handleDeleteProject = useDeleteProject(projects, setProjects, selectedProjectId, setSelectedProjectId);

  return {
    projects,
    setProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    isLoading: isLoading || isCreating
  };
};

export * from "./useProjectData";
export * from "./useCreateProject";
export * from "./useEditProject";
export * from "./useDeleteProject";
