
import { useState, useEffect } from "react";
import { Project } from "../../../types";
import { useToast } from "../../use-toast";
import { fetchUserProjects, fetchProjectDetails } from "../../../services/database";
import { useAuth } from "@/contexts/AuthContext";

export const useProjectData = () => {
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

  return {
    projects,
    setProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    isLoading
  };
};
