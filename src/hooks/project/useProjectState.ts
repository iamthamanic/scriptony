
import { useProjects } from "./useProjects";
import { useCharacters } from "./useCharacters";
import { useEpisodes } from "./useEpisodes";
import { useScenes } from "./useScenes";

export const useProjectState = () => {
  const {
    projects,
    setProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject
  } = useProjects();

  // Helper function to update projects
  const updateProjects = (projectId: string, updater: (project: any) => any) => {
    setProjects(projects.map(project => 
      project.id === projectId ? updater(project) : project
    ));
  };

  const {
    handleCreateCharacter,
    handleEditCharacter,
    handleDeleteCharacter
  } = useCharacters(selectedProject, updateProjects);

  const {
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode
  } = useEpisodes(selectedProject, updateProjects);

  const {
    handleCreateScene,
    handleDeleteScene
  } = useScenes(selectedProject, updateProjects);

  return {
    projects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleCreateCharacter,
    handleEditCharacter,
    handleDeleteCharacter,
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode,
    handleCreateScene,
    handleDeleteScene
  };
};

export default useProjectState;
