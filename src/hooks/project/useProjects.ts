
import { useState } from "react";
import { Project, NewProjectFormData, EditProjectFormData } from "../../types";
import { mockProjects } from "../../utils/mockData";
import { useToast } from "../use-toast";

export const useProjects = () => {
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

  return {
    projects,
    setProjects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject
  };
};
