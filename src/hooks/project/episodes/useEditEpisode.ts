
import { useToast } from "../../use-toast";
import { Episode, EditEpisodeFormData, EpisodeWithCoverImageFile } from "../../../types";

export const useEditEpisode = (
  selectedProject: { id: string; episodes: Episode[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();

  const handleEditEpisode = (episodeId: string, data: EditEpisodeFormData) => {
    if (!selectedProject) return;

    const episodeToEdit = selectedProject.episodes.find(e => e.id === episodeId);
    if (!episodeToEdit) return;

    // Create the updated episode with proper type handling
    const updatedEpisode: EpisodeWithCoverImageFile = {
      ...episodeToEdit,
      title: data.title,
      number: data.number,
      description: data.description,
      coverImage: data.coverImage,
      updatedAt: new Date()
    };

    updateProjects(selectedProject.id, (project) => {
      const updatedScenes = project.scenes.map(scene => {
        if (scene.episodeId === episodeId) {
          return {
            ...scene,
            episodeTitle: data.title,
            updatedAt: new Date()
          };
        }
        return scene;
      });

      return {
        ...project,
        episodes: project.episodes
          .map(e => e.id === episodeId ? (updatedEpisode as unknown as Episode) : e)
          .sort((a, b) => a.number - b.number),
        scenes: updatedScenes,
        updatedAt: new Date()
      };
    });

    toast({
      title: "Episode Updated",
      description: `Episode ${data.number}: ${data.title} has been updated.`,
      duration: 3000
    });
  };

  return handleEditEpisode;
};
