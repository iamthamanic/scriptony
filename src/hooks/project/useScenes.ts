
import { useToast } from "../use-toast";
import { Scene, NewSceneFormData } from "../../types";

export const useScenes = (
  selectedProject: { id: string; scenes: Scene[] } | null,
  updateProjects: (projectId: string, updater: (project: any) => any) => void
) => {
  const { toast } = useToast();

  const handleCreateScene = (data: NewSceneFormData, editingScene: Scene | null) => {
    if (!selectedProject) return;

    if (editingScene) {
      // Update existing scene
      const updatedScene: Scene = {
        ...editingScene,
        episodeId: data.episodeId,
        episodeTitle: data.episodeTitle,
        sceneNumber: data.sceneNumber,
        location: data.location,
        timeOfDay: data.timeOfDay,
        timecodeStart: data.timecodeStart,
        timecodeEnd: data.timecodeEnd,
        visualComposition: data.visualComposition,
        lighting: data.lighting,
        colorGrading: data.colorGrading,
        soundDesign: data.soundDesign,
        specialEffects: data.specialEffects,
        keyframeImage: data.keyframeImage ? URL.createObjectURL(data.keyframeImage) : editingScene.keyframeImage,
        description: data.description,
        dialog: data.dialog,
        characterDialogs: data.characterDialogs || editingScene.characterDialogs,
        transitions: data.transitions,
        productionNotes: data.productionNotes,
        emotionalSignificance: data.emotionalSignificance,
        emotionalNotes: data.emotionalNotes,
        characterIds: data.characterIds || [],
        colorReferences: data.colorReferences || editingScene.colorReferences,
        audioReferences: data.audioReferences || editingScene.audioReferences,
        visualReferences: data.visualReferences || editingScene.visualReferences,
        shots: editingScene.shots,
        updatedAt: new Date()
      };

      updateProjects(selectedProject.id, (project) => ({
        ...project,
        scenes: project.scenes
          .map(scene => scene.id === editingScene.id ? updatedScene : scene)
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
      const newScene: Scene = {
        id: `s${selectedProject.scenes.length + 1}`,
        projectId: selectedProject.id,
        episodeId: data.episodeId,
        episodeTitle: data.episodeTitle,
        sceneNumber: data.sceneNumber,
        location: data.location,
        timeOfDay: data.timeOfDay,
        timecodeStart: data.timecodeStart,
        timecodeEnd: data.timecodeEnd,
        visualComposition: data.visualComposition,
        lighting: data.lighting,
        colorGrading: data.colorGrading,
        soundDesign: data.soundDesign,
        specialEffects: data.specialEffects,
        keyframeImage: data.keyframeImage ? URL.createObjectURL(data.keyframeImage) : undefined,
        description: data.description,
        dialog: data.dialog,
        characterDialogs: data.characterDialogs || [],
        transitions: data.transitions,
        productionNotes: data.productionNotes,
        emotionalSignificance: data.emotionalSignificance,
        emotionalNotes: data.emotionalNotes,
        characterIds: data.characterIds || [],
        colorReferences: data.colorReferences || [],
        audioReferences: data.audioReferences || [],
        visualReferences: data.visualReferences || [],
        shots: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      updateProjects(selectedProject.id, (project) => ({
        ...project,
        scenes: [...project.scenes, newScene].sort((a, b) => a.sceneNumber - b.sceneNumber),
        updatedAt: new Date()
      }));

      toast({
        title: "Scene Created",
        description: `Scene ${data.sceneNumber} has been added to the project.`,
        duration: 3000
      });
    }
  };

  const handleDeleteScene = (scene: Scene) => {
    if (!selectedProject) return;
    
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
  };

  return {
    handleCreateScene,
    handleDeleteScene
  };
};
