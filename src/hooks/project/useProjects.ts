import { useState, useEffect } from "react";
import { Project, ProjectWithCoverImageFile, NewProjectFormData, EditProjectFormData } from "../../types";
import { useToast } from "../use-toast";
import { narrativeStructureTemplates } from "../../types/narrativeStructures";
import { fetchUserProjects, fetchProjectDetails, createProject, updateProject, deleteProject } from "../../services/database";
import { useAuth } from "@/contexts/AuthContext";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  // Fetch projects when user changes
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setSelectedProjectId(null);
      setIsLoading(false);
      return;
    }
    
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const projectsData = await fetchUserProjects();
        
        if (projectsData.length > 0) {
          setProjects(projectsData);
          setSelectedProjectId(projectsData[0]?.id || null);
          
          // Load detailed data for the first project
          if (projectsData[0]) {
            const { characters, episodes, scenes } = await fetchProjectDetails(projectsData[0].id);
            
            setProjects(prevProjects => {
              return prevProjects.map(project => {
                if (project.id === projectsData[0].id) {
                  return {
                    ...project,
                    characters,
                    episodes,
                    scenes
                  };
                }
                return project;
              });
            });
          }
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        toast({
          title: "Error loading projects",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [user, toast]);
  
  // Load project details when selected project changes
  useEffect(() => {
    if (!selectedProjectId || !user) return;
    
    const loadProjectDetails = async () => {
      try {
        const { characters, episodes, scenes } = await fetchProjectDetails(selectedProjectId);
        
        setProjects(prevProjects => {
          return prevProjects.map(project => {
            if (project.id === selectedProjectId) {
              return {
                ...project,
                characters,
                episodes,
                scenes
              };
            }
            return project;
          });
        });
      } catch (error) {
        console.error("Error loading project details:", error);
      }
    };
    
    const selectedProject = projects.find(p => p.id === selectedProjectId);
    if (selectedProject && (!selectedProject.characters.length && !selectedProject.scenes.length)) {
      loadProjectDetails();
    }
  }, [selectedProjectId, user, projects]);

  const handleCreateProject = async (data: NewProjectFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a project",
        variant: "destructive"
      });
      return;
    }
    
    const newProjectData = await createProject(data);
    
    if (newProjectData) {
      // Generate scenes from template if needed
      let scenes = [];
      if (data.narrativeStructure && data.narrativeStructure !== 'none') {
        const template = narrativeStructureTemplates[data.narrativeStructure];
        
        if (template) {
          scenes = template.scenes.map((sceneTpl, index) => ({
            projectId: newProjectData.id,
            sceneNumber: sceneTpl.sceneNumber || index + 1,
            location: sceneTpl.location || "",
            timeOfDay: "day",
            timecodeStart: "00:00:00",
            timecodeEnd: "00:00:00",
            visualComposition: "",
            lighting: "",
            colorGrading: "",
            soundDesign: "",
            specialEffects: "",
            description: sceneTpl.description || "",
            dialog: "",
            transitions: "",
            productionNotes: "",
            emotionalSignificance: sceneTpl.emotionalSignificance || "other",
            characterIds: [],
          }));
        }
      }
      
      const newProject = {
        ...newProjectData,
        scenes: []  // Will be populated if template scenes are created
      };
      
      setProjects([...projects, newProject]);
      setSelectedProjectId(newProject.id);
      
      toast({
        title: "Project Created",
        description: `${data.title} has been created successfully.`,
        duration: 3000
      });
    }
  };

  const handleEditProject = async (data: EditProjectFormData) => {
    if (!selectedProject || !user) return;

    const success = await updateProject(selectedProject.id, {
      title: data.title,
      type: data.type,
      logline: data.logline,
      genres: data.genres,
      duration: data.duration,
      inspirations: data.inspirations,
      narrativeStructure: data.narrativeStructure,
      coverImage: data.coverImage
    });

    if (success) {
      // Use proper type casting to avoid the error
      const updatedProject = {
        ...selectedProject,
        title: data.title,
        type: data.type,
        logline: data.logline,
        genres: data.genres,
        duration: data.duration,
        inspirations: data.inspirations,
        narrativeStructure: data.narrativeStructure || selectedProject.narrativeStructure,
        coverImage: data.coverImage,
        updatedAt: new Date()
      } as Project; // Cast to Project type to avoid type errors

      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id ? updatedProject : project
      );

      setProjects(updatedProjects);
      
      toast({
        title: "Project Updated",
        description: `${data.title} has been updated successfully.`,
        duration: 3000
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProjectId || !user) return;
    
    const projectToDelete = projects.find(p => p.id === selectedProjectId);
    if (!projectToDelete) return;
    
    const success = await deleteProject(selectedProjectId);
    
    if (success) {
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
    }
  };

  return {
    projects,
    setProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    isLoading
  };
};
