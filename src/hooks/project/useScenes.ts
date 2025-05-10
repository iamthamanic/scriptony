
import { useToast } from "../use-toast";
import { Scene, NewSceneFormData } from "../../types";
import { createScene, deleteScene } from "../../services";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFileToStorage } from "@/services/storage"; // Import a utility for file upload

export const useScenes = (
  selectedProject: { id: string; scenes: Scene[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateScene = async (data: NewSceneFormData) => {
    if (!selectedProject || !user) return;

    try {
      // Create a copy of data to modify
      const sceneData = { ...data };
      
      // Make sure projectId is set in the data
      sceneData.projectId = selectedProject.id;

      // If there's a keyframe image as a File, upload it first and get the URL
      if (sceneData.keyframeImage instanceof File) {
        const fileName = `${Date.now()}_${sceneData.keyframeImage.name}`;
        const { data: uploadData, error: uploadError } = await uploadFileToStorage(
          'scene-keyframes',
          fileName,
          sceneData.keyframeImage
        );
        
        if (uploadError) throw uploadError;
        
        // Replace the File object with the URL string
        sceneData.keyframeImage = uploadData.url;
      }
      
      // Now create the scene with the processed data
      const createdScene = await createScene(sceneData as Partial<Scene>);
      
      if (!createdScene) return;

      if (data.id) {
        // Update existing scene
        updateProjects(selectedProject.id, (project) => ({
          ...project,
          scenes: project.scenes
            .map(scene => scene.id === data.id ? createdScene : scene)
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
    } catch (error) {
      console.error("Error in handleCreateScene:", error);
      toast({
        title: "Error",
        description: "Failed to create/update scene.",
        variant: "destructive",
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
