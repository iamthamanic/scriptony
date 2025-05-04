
import { useToast } from "../../use-toast";
import { Episode, NewEpisodeFormData } from "../../../types";

export const useCreateEpisode = (
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

  return handleCreateEpisode;
};
