
import React from "react";
import { Loader2 } from "lucide-react";
import { Project } from "@/types";
import ProjectSelector from "../ProjectSelector";
import ProjectContent from "../ProjectContent";
import EmptyState from "../EmptyState";
import { Scene, Episode, Character } from "@/types";
import { EditCharacterFormData } from "../EditCharacterModal";
import { useToast } from "@/hooks/use-toast";

interface ProjectsContentProps {
  isLoading: boolean;
  projects: Project[];
  selectedProjectId: string | null;
  selectedProject: Project | null;
  onSelectProject: (projectId: string) => void;
  onNewScene: () => void;
  onEditProject: () => void;
  onNewCharacter: () => void;
  onDeleteProject: () => void;
  onEditScene: (scene: Scene) => void;
  onDeleteScene: (scene: Scene) => void;
  onEditCharacter: (characterId: string, data: EditCharacterFormData) => void;
  onDeleteCharacter: (characterId: string) => void;
  onNewEpisode: () => void;
  onEditEpisode: (episodeId: string) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onNewProject: () => void;
}

const ProjectsContent = ({
  isLoading,
  projects,
  selectedProjectId,
  selectedProject,
  onSelectProject,
  onNewScene,
  onEditProject,
  onNewCharacter,
  onDeleteProject,
  onEditScene,
  onDeleteScene,
  onEditCharacter,
  onDeleteCharacter,
  onNewEpisode,
  onEditEpisode,
  onDeleteEpisode,
  onNewProject
}: ProjectsContentProps) => {
  const { toast } = useToast();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-anime-purple mb-4" />
        <p className="text-lg text-muted-foreground">Projekte werden geladen...</p>
      </div>
    );
  }
  
  // These adapter functions convert from Character/Episode objects to the parameter formats
  // expected by the parent component functions
  const handleEditCharacter = (character: Character) => {
    const formData: EditCharacterFormData = {
      name: character.name,
      role: character.role,
      description: character.description,
      // Handle avatar correctly - use the string directly if it exists
      avatar: character.avatar && typeof character.avatar === 'string' ? character.avatar : undefined
    };
    
    // Call the parent function with the ID and form data separately
    onEditCharacter(character.id, formData);
  };

  const handleDeleteCharacter = (character: Character) => {
    // Pass just the ID to the parent function
    onDeleteCharacter(character.id);
  };

  const handleDeleteEpisode = (episode: Episode) => {
    // Pass just the ID to the parent function
    onDeleteEpisode(episode.id);
  };
  
  const handleDeleteProject = () => {
    if (selectedProject) {
      if (confirm(`Möchten Sie das Projekt "${selectedProject.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
        onDeleteProject();
      }
    } else {
      toast({
        title: "Fehler",
        description: "Kein Projekt ausgewählt zum Löschen.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      {projects.length > 0 && (
        <ProjectSelector 
          projects={projects} 
          selectedProjectId={selectedProjectId} 
          onSelectProject={onSelectProject} 
        />
      )}
      
      {selectedProject ? (
        <div className="w-full">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1.5 bg-anime-purple text-white rounded hover:bg-anime-dark-purple"
                onClick={onEditProject}
              >
                Bearbeiten
              </button>
              <button 
                className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteProject}
              >
                Löschen
              </button>
            </div>
          </div>
          <ProjectContent 
            selectedProject={selectedProject}
            isNewSceneModalOpen={false}
            onCloseNewSceneModal={onNewScene}
            onCreateScene={(data) => {}}
            onEditScene={onEditScene}
            onDeleteScene={onDeleteScene}
            editingScene={null}
            onEditCharacter={handleEditCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            onEditEpisode={onEditEpisode}
            onDeleteEpisode={handleDeleteEpisode}
            onNewEpisode={onNewEpisode}
            selectedEpisodeId={null}
            setSelectedEpisodeId={() => {}}
          />
        </div>
      ) : (
        <EmptyState
          title="Keine Projekte vorhanden"
          description="Erstellen Sie Ihr erstes Projekt"
          buttonText="Erstes Projekt erstellen"
          onClick={onNewProject}
        />
      )}
    </>
  );
};

export default ProjectsContent;
