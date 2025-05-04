
import { useState } from "react";
import { 
  Project, 
  Scene, 
  NewProjectFormData, 
  NewSceneFormData,
  EditProjectFormData,
  NewCharacterFormData,
  Character,
  EditCharacterFormData,
  Episode,
  NewEpisodeFormData,
  EditEpisodeFormData
} from "../types";
import { mockProjects } from "../utils/mockData";
import { useToast } from "./use-toast";

export const useProjectState = () => {
  const [projects, setProjects] = useState<Project[]>(
    mockProjects.map(p => ({ ...p, characters: [], episodes: [] }))
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(mockProjects[0]?.id || null);
  const { toast } = useToast();
  
  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  const handleCreateProject = (data: NewProjectFormData) => {
    const newProject: Project = {
      id: `p${projects.length + 1}`,
      title: data.title,
      type: data.type,
      logline: data.logline,
      genres: data.genres,
      duration: data.duration,
      inspirations: data.inspirations,
      coverImage: data.coverImage ? URL.createObjectURL(data.coverImage) : undefined,
      scenes: [],
      characters: [],
      episodes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    toast({
      title: "Project Created",
      description: `${data.title} has been created successfully.`,
      duration: 3000
    });
  };

  const handleEditProject = (data: EditProjectFormData) => {
    if (!selectedProject) return;

    const updatedProject: Project = {
      ...selectedProject,
      title: data.title,
      type: data.type,
      logline: data.logline,
      genres: data.genres,
      duration: data.duration,
      inspirations: data.inspirations,
      coverImage: data.coverImage 
        ? URL.createObjectURL(data.coverImage) 
        : selectedProject.coverImage,
      updatedAt: new Date()
    };

    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id ? updatedProject : project
    );

    setProjects(updatedProjects);
    toast({
      title: "Project Updated",
      description: `${data.title} has been updated successfully.`,
      duration: 3000
    });
  };

  const handleDeleteProject = () => {
    if (!selectedProjectId) return;
    
    const projectToDelete = projects.find(p => p.id === selectedProjectId);
    if (!projectToDelete) return;
    
    const updatedProjects = projects.filter(project => project.id !== selectedProjectId);
    const nextProjectId = updatedProjects.length > 0 ? updatedProjects[0].id : null;
    
    setProjects(updatedProjects);
    setSelectedProjectId(nextProjectId);
    
    toast({
      title: "Project Deleted",
      description: `${projectToDelete.title} has been permanently deleted.`,
      variant: "destructive",
      duration: 3000
    });
  };

  // Character management functions
  const handleCreateCharacter = (data: NewCharacterFormData) => {
    if (!selectedProject) return;

    const newCharacter: Character = {
      id: `c${projects.flatMap(p => p.characters).length + 1}`,
      name: data.name,
      role: data.role,
      description: data.description,
      projectId: selectedProject.id,
      avatar: data.avatar ? URL.createObjectURL(data.avatar) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? {
            ...project,
            characters: [...project.characters, newCharacter],
            updatedAt: new Date()
          } 
        : project
    );

    setProjects(updatedProjects);
    toast({
      title: "Character Added",
      description: `${data.name} has been added to ${selectedProject.title}.`,
      duration: 3000
    });
  };

  const handleEditCharacter = (characterId: string, data: EditCharacterFormData) => {
    if (!selectedProject) return;

    // Find the character to edit
    const characterToEdit = selectedProject.characters.find(c => c.id === characterId);
    if (!characterToEdit) return;

    // Create the updated character
    const updatedCharacter: Character = {
      ...characterToEdit,
      name: data.name,
      role: data.role,
      description: data.description,
      avatar: data.avatar ? URL.createObjectURL(data.avatar) : characterToEdit.avatar,
      updatedAt: new Date()
    };

    // Update the projects state
    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? {
            ...project,
            characters: project.characters.map(c => 
              c.id === characterId ? updatedCharacter : c
            ),
            updatedAt: new Date()
          } 
        : project
    );

    setProjects(updatedProjects);
    toast({
      title: "Character Updated",
      description: `${data.name} has been updated successfully.`,
      duration: 3000
    });
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (!selectedProject) return;

    // Find the character to delete
    const characterToDelete = selectedProject.characters.find(c => c.id === characterId);
    if (!characterToDelete) return;

    // Remove character from all scenes that reference it
    const updatedScenes = selectedProject.scenes.map(scene => ({
      ...scene,
      characterIds: scene.characterIds.filter(id => id !== characterId),
      updatedAt: new Date()
    }));

    // Update the projects state
    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? {
            ...project,
            characters: project.characters.filter(c => c.id !== characterId),
            scenes: updatedScenes,
            updatedAt: new Date()
          } 
        : project
    );

    setProjects(updatedProjects);
    toast({
      title: "Character Deleted",
      description: `${characterToDelete.name} has been permanently deleted.`,
      variant: "destructive",
      duration: 3000
    });
  };

  // Episode management functions
  const handleCreateEpisode = (data: NewEpisodeFormData) => {
    if (!selectedProject) return;

    const newEpisode: Episode = {
      id: `e${projects.flatMap(p => p.episodes || []).length + 1}`,
      projectId: selectedProject.id,
      title: data.title,
      number: data.number,
      description: data.description,
      coverImage: data.coverImage ? URL.createObjectURL(data.coverImage) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? {
            ...project,
            episodes: [...(project.episodes || []), newEpisode].sort((a, b) => a.number - b.number),
            updatedAt: new Date()
          } 
        : project
    );

    setProjects(updatedProjects);
    toast({
      title: "Episode Added",
      description: `Episode ${data.number}: ${data.title} has been added to ${selectedProject.title}.`,
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

    // Update scenes that reference this episode (by episode title)
    const updatedScenes = selectedProject.scenes.map(scene => {
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

    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? {
            ...project,
            episodes: project.episodes.map(e => 
              e.id === episodeId ? updatedEpisode : e
            ).sort((a, b) => a.number - b.number),
            scenes: updatedScenes,
            updatedAt: new Date()
          } 
        : project
    );

    setProjects(updatedProjects);
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

    // Update scenes that reference this episode
    const updatedScenes = selectedProject.scenes.map(scene => {
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

    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? {
            ...project,
            episodes: project.episodes.filter(e => e.id !== episodeId),
            scenes: updatedScenes,
            updatedAt: new Date()
          } 
        : project
    );

    setProjects(updatedProjects);
    toast({
      title: "Episode Deleted",
      description: `Episode ${episodeToDelete.number}: ${episodeToDelete.title} has been permanently deleted.`,
      variant: "destructive",
      duration: 3000
    });
  };

  // Scene management functions
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
        transitions: data.transitions,
        productionNotes: data.productionNotes,
        emotionalSignificance: data.emotionalSignificance,
        emotionalNotes: data.emotionalNotes,
        characterIds: data.characterIds || [],
        updatedAt: new Date()
      };

      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id 
          ? {
              ...project,
              scenes: project.scenes
                .map(scene => scene.id === editingScene.id ? updatedScene : scene)
                .sort((a, b) => a.sceneNumber - b.sceneNumber),
              updatedAt: new Date()
            } 
          : project
      );

      setProjects(updatedProjects);
      toast({
        title: "Scene Updated",
        description: `Scene ${data.sceneNumber} has been updated.`,
        duration: 3000
      });
    } else {
      // Create new scene
      const newScene: Scene = {
        id: `s${projects.flatMap(p => p.scenes).length + 1}`,
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
        transitions: data.transitions,
        productionNotes: data.productionNotes,
        emotionalSignificance: data.emotionalSignificance,
        emotionalNotes: data.emotionalNotes,
        characterIds: data.characterIds || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id 
          ? {
              ...project,
              scenes: [...project.scenes, newScene].sort((a, b) => a.sceneNumber - b.sceneNumber),
              updatedAt: new Date()
            } 
          : project
      );

      setProjects(updatedProjects);
      toast({
        title: "Scene Created",
        description: `Scene ${data.sceneNumber} has been added to ${selectedProject.title}.`,
        duration: 3000
      });
    }
  };

  const handleDeleteScene = (scene: Scene) => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? {
            ...project,
            scenes: project.scenes.filter(s => s.id !== scene.id),
            updatedAt: new Date()
          } 
        : project
    );
    
    setProjects(updatedProjects);
    
    toast({
      title: "Scene Deleted",
      description: `Scene ${scene.sceneNumber} has been permanently deleted.`,
      variant: "destructive",
      duration: 3000
    });
  };

  return {
    projects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleCreateCharacter,
    handleEditCharacter,
    handleDeleteCharacter,
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode,
    handleCreateScene,
    handleDeleteScene
  };
};
