
import { useCreateEpisode } from "./useCreateEpisode";
import { useEditEpisode } from "./useEditEpisode";
import { useDeleteEpisode } from "./useDeleteEpisode";
import { Episode } from "../../../types";

export const useEpisodes = (
  selectedProject: { id: string; episodes: Episode[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const handleCreateEpisode = useCreateEpisode(selectedProject, updateProjects);
  const handleEditEpisode = useEditEpisode(selectedProject, updateProjects);
  const handleDeleteEpisode = useDeleteEpisode(selectedProject, updateProjects);

  return {
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode
  };
};

export * from "./useCreateEpisode";
export * from "./useEditEpisode";
export * from "./useDeleteEpisode";
