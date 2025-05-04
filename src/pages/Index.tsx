
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectHeader from "../components/ProjectHeader";
import NewProjectModal from "../components/NewProjectModal";
import NewSceneModal from "../components/NewSceneModal";
import ScenePdfExport from "../components/ScenePdfExport";
import { mockProjects } from "../utils/mockData";
import { Project, Scene, NewProjectFormData, NewSceneFormData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { FilePlus } from "lucide-react";

// Import the newly created components
import ProjectSelector from "../components/ProjectSelector";
import SceneList from "../components/SceneList";
import EmptyState from "../components/EmptyState";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(mockProjects[0]?.id || null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setIsNewProjectModalOpen(false);
    toast({
      title: "Project Created",
      description: `${data.title} has been created successfully.`,
      duration: 3000
    });
  };

  const handleCreateScene = (data: NewSceneFormData) => {
    if (!selectedProject) return;

    if (editingScene) {
      // Update existing scene
      const updatedScene: Scene = {
        ...editingScene,
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
      setIsNewSceneModalOpen(false);
      setEditingScene(null);
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
      setIsNewSceneModalOpen(false);
      toast({
        title: "Scene Created",
        description: `Scene ${data.sceneNumber} has been added to ${selectedProject.title}.`,
        duration: 3000
      });
    }
  };

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setIsNewSceneModalOpen(true);
  };

  const handleExportScenePDF = (scene: Scene) => {
    if (!selectedProject) return;

    toast({
      title: "Generating PDF",
      description: `Preparing Scene ${scene.sceneNumber} for export...`,
      duration: 2000
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-anime-purple">Scriptbuddy</h1>
            <p className="text-muted-foreground mt-1">
              Create, visualize, and organize your anime script scenes
            </p>
          </div>
          <Button 
            onClick={() => setIsNewProjectModalOpen(true)} 
            className="bg-anime-purple hover:bg-anime-dark-purple transition-colors"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        
        {projects.length > 0 && (
          <ProjectSelector 
            projects={projects} 
            selectedProjectId={selectedProjectId} 
            onSelectProject={setSelectedProjectId} 
          />
        )}
      </header>
      
      {selectedProject ? (
        <div className="animate-fade-in">
          <ProjectHeader 
            project={selectedProject} 
            onNewScene={() => {
              setEditingScene(null);
              setIsNewSceneModalOpen(true);
            }} 
          />
          
          {selectedProject.scenes.length > 0 ? (
            <SceneList 
              scenes={selectedProject.scenes} 
              onEditScene={handleEditScene}
              onExportPDF={handleExportScenePDF}
            />
          ) : (
            <EmptyState
              title="No Scenes Yet"
              description={`Start by adding your first scene to ${selectedProject.title}`}
              buttonText="Create First Scene"
              onClick={() => {
                setEditingScene(null);
                setIsNewSceneModalOpen(true);
              }}
            />
          )}
        </div>
      ) : (
        <EmptyState
          title="No Projects Yet"
          description="Start by creating your first anime project"
          buttonText="Create First Project"
          onClick={() => setIsNewProjectModalOpen(true)}
        />
      )}
      
      {/* Modals */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
        onSubmit={handleCreateProject} 
      />
      
      {selectedProject && (
        <NewSceneModal 
          isOpen={isNewSceneModalOpen} 
          onClose={() => {
            setIsNewSceneModalOpen(false);
            setEditingScene(null);
          }} 
          onSubmit={handleCreateScene} 
          projectType={selectedProject.type} 
          lastSceneNumber={
            editingScene 
              ? editingScene.sceneNumber 
              : selectedProject.scenes.length > 0 
                ? Math.max(...selectedProject.scenes.map(s => s.sceneNumber)) 
                : 0
          } 
          editScene={editingScene} 
        />
      )}
      
      {/* PDF Export Component (hidden) */}
      {selectedProject && selectedProject.scenes.map(scene => (
        <div key={scene.id} className="hidden">
          <ScenePdfExport scene={scene} project={selectedProject} />
        </div>
      ))}
    </div>
  );
};

export default Index;
