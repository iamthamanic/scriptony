
import { useToast } from "../use-toast";
import { Episode, NewEpisodeFormData, EditEpisodeFormData } from "../../types";

export const useEpisodes = (
  selectedProject: { id: string; episodes: Episode[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();

  const handleCreateEpisode = (data: NewEpisodeFormData) => {
    if (!selectedProject) return;

    const newEpisode: Episode = {
      id: `e${selectedProject.episodes.length + 1}`,
      projectId: selectedProject.id,
      title: data.title,
      number: data.number,
      description: data.description,
      coverImage: data.coverImage ? URL.createObjectURL(data.coverImage) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    updateProjects(selectedProject.id, (project) => ({
      ...project,
      episodes: [...(project.episodes || []), newEpisode].sort((a, b) => a.number - b.number),
      updatedAt: new Date()
    }));

    toast({
      title: "Episode Added",
      description: `Episode ${data.number}: ${data.title} has been added to the project.`,
      duration: 3000
    });
  };

  const handleEditEpisode = (episodeId: string, data: EditEpisodeFormData) => {
    if (!selectedProject) return;

    const episodeToEdit = selectedProject.episodes.find(e => e.id === episodeId);
    if (!episodeToEdit) return;

    const updatedEpisode: Episode = {
      ...episodeToEdit,
      title: data.title,
      number: data.number,
      description: data.description,
      coverImage: data.coverImage ? URL.createObjectURL(data.coverImage) : episodeToEdit.coverImage,
      updatedAt: new Date()
    };

    updateProjects(selectedProject.id, (project) => {
      // Update scenes that reference this episode (by episode title)
      const updatedScenes = project.scenes.map(scene => {
        if (scene.episodeId === episodeId || scene.episodeTitle === episodeToEdit.title) {
          return {
            ...scene,
            episodeId: episodeId,
            episodeTitle: data.title,
            updatedAt: new Date()
          };
        }
        return scene;
      });

      return {
        ...project,
        episodes: project.episodes.map(e => 
          e.id === episodeId ? updatedEpisode : e
        ).sort((a, b) => a.number - b.number),
        scenes: updatedScenes,
        updatedAt: new Date()
      };
    });

    toast({
      title: "Episode Updated",
      description: `Episode ${data.number}: ${data.title} has been updated successfully.`,
      duration: 3000
    });
  };

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

  return {
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode
  };
};
