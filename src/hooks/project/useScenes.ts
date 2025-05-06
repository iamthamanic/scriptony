
import { useToast } from "../use-toast";
import { Scene, NewSceneFormData } from "../../types";
import { createScene, deleteScene } from "../../services";
import { useAuth } from "@/contexts/AuthContext";

export const useScenes = (
  selectedProject: { id: string; scenes: Scene[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateScene = async (data: NewSceneFormData, editingScene: Scene | null) => {
    if (!selectedProject || !user) return;

    // Make sure projectId is set in the data
    const sceneData = {
      ...data,
      projectId: selectedProject.id
    };

    const createdScene = await createScene(sceneData);
    
    if (!createdScene) return;

    if (editingScene) {
      // Update existing scene
      updateProjects(selectedProject.id, (project) => ({
        ...project,
        scenes: project.scenes
          .map(scene => scene.id === editingScene.id ? createdScene : scene)
          .sort((a, b) => a.sceneNumber - b.sceneNumber),
        updatedAt: new Date()
      }));

      toast({
        title: "Scene Updated",
        description: `Scene ${data.sceneNumber} has been updated.`,
        duration: 3000
      });
    } else {
      // Create new scene
      updateProjects(selectedProject.id, (project) => ({
        ...project,
        scenes: [...project.scenes, createdScene]
          .sort((a, b) => a.sceneNumber - b.sceneNumber),
        updatedAt: new Date()
      }));

      toast({
        title: "Scene Created",
        description: `Scene ${data.sceneNumber} has been added to the project.`,
        duration: 3000
      });
    }
  };

  const handleDeleteScene = async (scene: Scene) => {
    if (!selectedProject || !user) return;
    
    const success = await deleteScene(scene.id);
    
    if (success) {
      updateProjects(selectedProject.id, (project) => ({
        ...project,
        scenes: project.scenes.filter(s => s.id !== scene.id),
        updatedAt: new Date()
      }));
      
      toast({
        title: "Scene Deleted",
        description: `Scene ${scene.sceneNumber} has been permanently deleted.`,
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return {
    handleCreateScene,
    handleDeleteScene
  };
};
