
import { useState, useEffect, useRef } from "react";
import { Project } from "../../../types";
import { useToast } from "../../use-toast";
import { fetchUserProjects, fetchProjectDetails } from "../../../services/database";
import { useAuth } from "@/contexts/AuthContext";

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const loadingInProgressRef = useRef<boolean>(false);
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
      // Prevent concurrent loads
      if (loadingInProgressRef.current) {
        console.log("Project loading already in progress, skipping");
        return;
      }
      
      // Only set loading to true if we haven't loaded data before
      if (!hasLoadedOnce) {
        setIsLoading(true);
      }
      
      loadingInProgressRef.current = true;
      
      try {
        console.log("Loading projects for user:", user.id);
        const projectsData = await fetchUserProjects();
        
        if (projectsData.length > 0) {
          console.log(`Loaded ${projectsData.length} projects`);
          setProjects(projectsData);
          
          // Only set the selected project if none is currently selected
          if (!selectedProjectId) {
            setSelectedProjectId(projectsData[0]?.id || null);
          }
          
          // Load detailed data for the first project if none is selected
          if (!selectedProjectId && projectsData[0]) {
            const projectId = projectsData[0].id;
            console.log(`Loading details for first project: ${projectId}`);
            try {
              const { characters, episodes, scenes } = await fetchProjectDetails(projectId);
              
              setProjects(prevProjects => {
                return prevProjects.map(project => {
                  if (project.id === projectId) {
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
            } catch (detailsError) {
              console.error("Error loading details for first project:", detailsError);
            }
          }
        } else {
          console.log("No projects found");
          setProjects([]);
        }
        
        // Mark as loaded once
        setHasLoadedOnce(true);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast({
          title: "Fehler beim Laden der Projekte",
          description: "Bitte versuche es später noch einmal.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        loadingInProgressRef.current = false;
      }
    };
    
    loadProjects();
  }, [user, toast, selectedProjectId, hasLoadedOnce]);
  
  // Load project details when selected project changes
  useEffect(() => {
    if (!selectedProjectId || !user) return;
    
    const loadProjectDetails = async () => {
      try {
        const selectedProject = projects.find(p => p.id === selectedProjectId);
        
        // Only load details if we don't have them yet
        if (selectedProject && 
            (!selectedProject.characters.length && 
             !selectedProject.scenes.length)) {
          
          console.log(`Loading details for selected project: ${selectedProjectId}`);
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
        }
      } catch (error) {
        console.error("Error loading project details:", error);
      }
    };
    
    loadProjectDetails();
  }, [selectedProjectId, user, projects]);

  return {
    projects,
    setProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    isLoading,
    hasLoadedOnce
  };
};
