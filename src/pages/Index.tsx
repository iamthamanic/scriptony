
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectHeader from "../components/ProjectHeader";
import SceneCard from "../components/SceneCard";
import TimelineView from "../components/TimelineView";
import NewProjectModal from "../components/NewProjectModal";
import NewSceneModal from "../components/NewSceneModal";
import ScenePdfExport from "../components/ScenePdfExport";
import { mockProjects, mockScenes } from "../utils/mockData";
import { Project, Scene, NewProjectFormData, NewSceneFormData } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { FilePlus, ListFilter, Calendar, Film } from "lucide-react";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(mockProjects[0]?.id || null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<"gallery" | "timeline">("gallery");
  
  const { toast } = useToast();
  
  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId) 
    : null;

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
      duration: 3000,
    });
  };

  const handleCreateScene = (data: NewSceneFormData) => {
    if (!selectedProject) return;
    
    const newScene: Scene = {
      id: `s${mockScenes.length + projects.flatMap(p => p.scenes).length + 1}`,
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
      duration: 3000,
    });
  };

  const handleExportScenePDF = (scene: Scene) => {
    if (!selectedProject) return;
    
    // This will be handled by the ScenePdfExport component
    toast({
      title: "Generating PDF",
      description: `Preparing Scene ${scene.sceneNumber} for export...`,
      duration: 2000,
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-anime-purple">Anime Story Canvas</h1>
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
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-medium mb-3">Select Project:</h2>
            <div className="flex flex-wrap gap-2">
              {projects.map(project => (
                <Button
                  key={project.id}
                  variant={selectedProjectId === project.id ? "default" : "outline"}
                  className={selectedProjectId === project.id 
                    ? "bg-anime-purple hover:bg-anime-dark-purple" 
                    : ""}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <Film className="mr-2 h-4 w-4" />
                  {project.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {selectedProject ? (
        <div className="animate-fade-in">
          <ProjectHeader 
            project={selectedProject} 
            onNewScene={() => setIsNewSceneModalOpen(true)} 
          />
          
          {selectedProject.scenes.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Scenes ({selectedProject.scenes.length})</h2>
                <div className="flex gap-2">
                  <Button 
                    variant={activeView === "gallery" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("gallery")}
                    className={activeView === "gallery" ? "bg-anime-purple hover:bg-anime-dark-purple" : ""}
                  >
                    <ListFilter className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                  <Button 
                    variant={activeView === "timeline" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("timeline")}
                    className={activeView === "timeline" ? "bg-anime-purple hover:bg-anime-dark-purple" : ""}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Timeline
                  </Button>
                </div>
              </div>
              
              {activeView === "gallery" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProject.scenes.map(scene => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      onClick={() => {
                        toast({
                          title: "Scene Selected",
                          description: `Editing Scene ${scene.sceneNumber} will be available in the next version.`,
                          duration: 3000,
                        });
                      }}
                      onExportPDF={() => handleExportScenePDF(scene)}
                    />
                  ))}
                </div>
              ) : (
                <TimelineView 
                  scenes={selectedProject.scenes}
                  onSceneClick={(scene) => {
                    toast({
                      title: "Scene Selected",
                      description: `Editing Scene ${scene.sceneNumber} will be available in the next version.`,
                      duration: 3000,
                    });
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">No Scenes Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by adding your first scene to {selectedProject.title}
              </p>
              <Button 
                onClick={() => setIsNewSceneModalOpen(true)}
                className="bg-anime-purple hover:bg-anime-dark-purple"
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Create First Scene
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">No Projects Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start by creating your first anime project
          </p>
          <Button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-anime-purple hover:bg-anime-dark-purple"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Create First Project
          </Button>
        </div>
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
          onClose={() => setIsNewSceneModalOpen(false)} 
          onSubmit={handleCreateScene}
          projectType={selectedProject.type}
          lastSceneNumber={selectedProject.scenes.length > 0 
            ? Math.max(...selectedProject.scenes.map(s => s.sceneNumber)) 
            : 0}
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
