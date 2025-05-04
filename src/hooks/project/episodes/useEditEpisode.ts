
import { useToast } from "../../use-toast";
import { Episode, EditEpisodeFormData } from "../../../types";

export const useEditEpisode = (
  selectedProject: { id: string; episodes: Episode[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();

  const handleEditEpisode = (episodeId: string, data: EditEpisodeFormData) => {
    if (!selectedProject) return;

    const episodeToEdit = selectedProject.episodes.find(e => e.id === episodeId);
    if (!episodeToEdit) return;

    // Update the episode with proper type casting
    const updatedEpisode = {
      ...episodeToEdit,
      title: data.title,
      number: data.number,
      description: data.description,
      coverImage: data.coverImage,
      updatedAt: new Date()
    } as Episode; // Cast to Episode type to avoid type errors

    // Update episodes in the project
    updateProjects(selectedProject.id, (project) => {
      // Update scenes that reference this episode
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
          .map(e => e.id === episodeId ? updatedEpisode : e)
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
