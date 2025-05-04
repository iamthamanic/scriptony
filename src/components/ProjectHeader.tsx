
import React from "react";
import { Project } from "../types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { FilePlus, Edit, Trash2, Plus, UserPlus } from "lucide-react";

interface ProjectHeaderProps {
  project: Project;
  onNewScene: () => void;
  onEditProject: () => void;
  onNewCharacter: () => void;
  onDeleteProject: () => void;
  onNewEpisode?: () => void;
}

const ProjectHeader = ({
  project,
  onNewScene,
  onEditProject,
  onNewCharacter,
  onDeleteProject,
  onNewEpisode
}: ProjectHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
        <div>
          <h2 className="text-3xl font-bold">{project.title}</h2>
          <p className="text-muted-foreground mt-1">{project.logline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onNewCharacter}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Character
          </Button>
          
          {project.type === 'series' && onNewEpisode && (
            <Button variant="outline" size="sm" onClick={onNewEpisode}>
              <Plus className="mr-2 h-4 w-4" />
              New Episode
            </Button>
          )}
          
          <Button onClick={onNewScene} size="sm" className="bg-anime-purple hover:bg-anime-dark-purple">
            <FilePlus className="mr-2 h-4 w-4" />
            New Scene
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditProject}>
                Edit Project Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDeleteProject}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 text-sm mb-4">
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
          {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
        </span>
        
        {project.genres.map((genre) => (
          <span key={genre} className="bg-muted px-2 py-1 rounded-md">
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </span>
        ))}
        
        <span className="bg-muted px-2 py-1 rounded-md">
          {project.duration} min
        </span>
      </div>
    </div>
  );
};

export default ProjectHeader;
