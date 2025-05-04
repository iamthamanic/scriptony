
import { useToast } from "../use-toast";
import { Episode, EpisodeWithCoverImageFile, NewEpisodeFormData, EditEpisodeFormData } from "../../types";
import { createEpisode, updateEpisode, deleteEpisode } from "../../services/database";
import { useAuth } from "@/contexts/AuthContext";

export const useEpisodes = (
  selectedProject: { id: string; episodes: Episode[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateEpisode = async (data: NewEpisodeFormData) => {
    if (!selectedProject || !user) return;

    const newEpisodeData = await createEpisode(selectedProject.id, data);

    if (newEpisodeData) {
      updateProjects(selectedProject.id, (project) => ({
        ...project,
        episodes: [...project.episodes, newEpisodeData]
          .sort((a, b) => a.number - b.number),
        updatedAt: new Date()
      }));

      toast({
        title: "Episode Created",
        description: `Episode ${data.number}: ${data.title} has been added.`,
        duration: 3000
      });
    }
  };

  const handleEditEpisode = async (episodeId: string, data: EditEpisodeFormData) => {
    if (!selectedProject || !user) return;

    // Find the episode to edit
    const episodeToEdit = selectedProject.episodes.find(e => e.id === episodeId);
    if (!episodeToEdit) return;

    // Create update data with proper typing for API call
    const updateData: Partial<Episode> = {
      title: data.title,
      number: data.number,
      description: data.description
    };
    
    // Only include coverImage if it's a string (URL) or undefined
    // File objects will be handled by the updateEpisode function
    if (typeof data.coverImage === 'string' || data.coverImage === undefined) {
      updateData.coverImage = data.coverImage;
    }

    const success = await updateEpisode(episodeId, updateData);

    if (success) {
      // Create the updated episode with proper typing
      const updatedEpisode: EpisodeWithCoverImageFile = {
        ...episodeToEdit,
        title: data.title,
        number: data.number,
        description: data.description,
        coverImage: data.coverImage,
        updatedAt: new Date()
      };

      // Update episodes and any scenes that reference this episode
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
            .map(e => e.id === episodeId ? ({
              ...updatedEpisode,
              // Remove File object before storing in episodes array
              coverImage: typeof updatedEpisode.coverImage === 'string' ? updatedEpisode.coverImage : null
            } as Episode) : e)
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
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!selectedProject || !user) return;

    // Find the episode to delete
    const episodeToDelete = selectedProject.episodes.find(e => e.id === episodeId);
    if (!episodeToDelete) return;

    const success = await deleteEpisode(episodeId);

    if (success) {
      // Remove episode and related scenes
      updateProjects(selectedProject.id, (project) => ({
        ...project,
        episodes: project.episodes.filter(e => e.id !== episodeId),
        scenes: project.scenes.filter(scene => scene.episodeId !== episodeId),
        updatedAt: new Date()
      }));

      toast({
        title: "Episode Deleted",
        description: `Episode ${episodeToDelete.number}: ${episodeToDelete.title} has been deleted.`,
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return {
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode
  };
};

export default useEpisodes;
