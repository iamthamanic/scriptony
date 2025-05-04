
import { useToast } from "../../use-toast";
import { Episode } from "../../../types";

export const useDeleteEpisode = (
  selectedProject: { id: string; episodes: Episode[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();

  const handleDeleteEpisode = (episodeId: string) => {
    if (!selectedProject) return;

    const episodeToDelete = selectedProject.episodes.find(e => e.id === episodeId);
    if (!episodeToDelete) return;

    updateProjects(selectedProject.id, (project) => {
      // Update scenes that reference this episode
      const updatedScenes = project.scenes.map(scene => {
        if (scene.episodeId === episodeId) {
          return {
            ...scene,
            episodeId: undefined,
            episodeTitle: undefined,
            updatedAt: new Date()
          };
        }
        return scene;
      });

      return {
        ...project,
        episodes: project.episodes.filter(e => e.id !== episodeId),
        scenes: updatedScenes,
        updatedAt: new Date()
      };
    });

    toast({
      title: "Episode Deleted",
      description: `Episode ${episodeToDelete.number}: ${episodeToDelete.title} has been permanently deleted.`,
      variant: "destructive",
      duration: 3000
    });
  };

  return handleDeleteEpisode;
};
