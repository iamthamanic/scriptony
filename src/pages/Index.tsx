
import React, { useState } from "react";
import ProjectSelector from "../components/ProjectSelector";
import ProjectContent from "../components/ProjectContent";
import ProjectModals from "../components/ProjectModals";
import EmptyState from "../components/EmptyState";
import { Scene, Episode } from "../types";
import { useProjectState } from "../hooks/project/useProjectState";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Plus, Upload } from "lucide-react";
import ScriptAnalysisResults from "@/components/script-analysis/ScriptAnalysisResults";
import { uploadAndAnalyzeScript } from "@/services/scriptAnalysis";
import { AnalysisResult } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const {
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
    handleCreateScene,
    handleDeleteScene,
    handleCreateEpisode,
    handleEditEpisode,
    handleDeleteEpisode,
    isLoading
  } = useProjectState();

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false);
  const [isNewCharacterModalOpen, setIsNewCharacterModalOpen] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Script analysis state
  const [isAnalysisResultsOpen, setIsAnalysisResultsOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setIsNewSceneModalOpen(true);
  };

  const handleNewEpisode = () => {
    setEditingEpisode(null);
    setIsEpisodeModalOpen(true);
  };

  const handleEditEpisodeClick = (episodeId: string) => {
    if (!selectedProject) return;
    const episode = selectedProject.episodes.find(e => e.id === episodeId);
    if (episode) {
      setEditingEpisode(episode);
      setIsEpisodeModalOpen(true);
    }
  };

  const handleCreateOrEditEpisode = (data) => {
    if (editingEpisode) {
      handleEditEpisode(editingEpisode.id, data);
    } else {
      handleCreateEpisode(data);
    }
    setIsEpisodeModalOpen(false);
    setEditingEpisode(null);
  };

  const handleNewScene = () => {
    setEditingScene(null);
    setIsNewSceneModalOpen(true);
  };
  
  const handleUploadScript = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsAnalyzing(true);
      toast({
        title: "Analyzing script",
        description: "Please wait while we analyze your script...",
      });
      
      const { analysisResult } = await uploadAndAnalyzeScript(file);
      setAnalysisResult(analysisResult);
      setIsAnalysisResultsOpen(true);
      
      toast({
        title: "Analysis complete",
        description: "Script analysis completed successfully",
      });
    } catch (error) {
      console.error("Error analyzing script:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleNewProject = () => setIsNewProjectModalOpen(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(fileExt || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }
    
    handleUploadScript(event);
  };

  return (
    <div className="py-6 px-4 md:px-6 w-full">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Skript-Projekte</h1>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-anime-purple hover:bg-anime-dark-purple"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>New Project</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleNewProject}>
                  Empty Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Script
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    style={{ display: 'none' }}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {projects.length > 0 && !isLoading && (
          <ProjectSelector 
            projects={projects} 
            selectedProjectId={selectedProjectId} 
            onSelectProject={(projectId) => {
              setSelectedProjectId(projectId);
              setSelectedEpisodeId(null); // Reset selected episode when switching projects
            }} 
          />
        )}
      </header>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-anime-purple mb-4" />
          <p className="text-lg text-muted-foreground">Loading your projects...</p>
        </div>
      ) : selectedProject ? (
        <ProjectContent 
          project={selectedProject}
          onNewScene={handleNewScene}
          onEditProject={() => setIsEditProjectModalOpen(true)}
          onNewCharacter={() => setIsNewCharacterModalOpen(true)}
          onDeleteProject={handleDeleteProject}
          onEditScene={handleEditScene}
          onDeleteScene={handleDeleteScene}
          onEditCharacter={handleEditCharacter}
          onDeleteCharacter={handleDeleteCharacter}
          onNewEpisode={handleNewEpisode}
          onEditEpisode={handleEditEpisodeClick}
          onDeleteEpisode={handleDeleteEpisode}
        />
      ) : (
        <EmptyState
          title="No Projects Yet"
          description="Start by creating your first anime project"
          buttonText="Create First Project"
          onClick={() => setIsNewProjectModalOpen(true)}
        />
      )}
      
      <ProjectModals
        isNewProjectModalOpen={isNewProjectModalOpen}
        isEditProjectModalOpen={isEditProjectModalOpen}
        isNewSceneModalOpen={isNewSceneModalOpen}
        isNewCharacterModalOpen={isNewCharacterModalOpen}
        isEpisodeModalOpen={isEpisodeModalOpen}
        onCloseNewProject={() => setIsNewProjectModalOpen(false)}
        onCloseEditProject={() => setIsEditProjectModalOpen(false)}
        onCloseNewScene={() => {
          setIsNewSceneModalOpen(false);
          setEditingScene(null);
        }}
        onCloseNewCharacter={() => setIsNewCharacterModalOpen(false)}
        onCloseEpisodeModal={() => {
          setIsEpisodeModalOpen(false);
          setEditingEpisode(null);
        }}
        onCreateProject={handleCreateProject}
        onEditProject={handleEditProject}
        onCreateScene={(data) => {
          handleCreateScene(data, editingScene);
          setIsNewSceneModalOpen(false);
          setEditingScene(null);
        }}
        onCreateCharacter={handleCreateCharacter}
        onCreateOrEditEpisode={handleCreateOrEditEpisode}
        selectedProject={selectedProject}
        editingScene={editingScene}
        editingEpisode={editingEpisode}
      />
      
      <ScriptAnalysisResults
        isOpen={isAnalysisResultsOpen}
        onClose={() => setIsAnalysisResultsOpen(false)}
        analysisResult={analysisResult}
        onCreateProject={(data) => {
          handleCreateProject(data);
          setIsAnalysisResultsOpen(false);
        }}
        isLoading={isAnalyzing}
      />
    </div>
  );
};

export default Index;
