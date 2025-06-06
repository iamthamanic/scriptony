
import React from 'react';
import { Button } from "@/components/ui/button";
import { Project } from "../types";
import { Film, Tv, Video } from "lucide-react";

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

const ProjectSelector = ({ projects, selectedProjectId, onSelectProject }: ProjectSelectorProps) => {
  // Function to get the appropriate icon based on project type
  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'series':
        return <Tv className="mr-2 h-4 w-4" />;
      case 'short':
        return <Video className="mr-2 h-4 w-4" />;
      default: // 'movie'
        return <Film className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h2 className="font-medium mb-3">Select Project:</h2>
      <div className="flex flex-wrap gap-2">
        {projects.map(project => (
          <Button 
            key={project.id} 
            variant={selectedProjectId === project.id ? "default" : "outline"} 
            className={selectedProjectId === project.id ? "bg-anime-purple hover:bg-anime-dark-purple" : ""} 
            onClick={() => onSelectProject(project.id)}
          >
            {getProjectIcon(project.type)}
            {project.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;
