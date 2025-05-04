
import React from 'react';
import { Project } from '../types';
import { Button } from '@/components/ui/button';
import { CalendarDays, FilePlus, Edit, Users, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProjectHeaderProps {
  project: Project;
  onNewScene: () => void;
  onEditProject: () => void;
  onNewCharacter: () => void;
  onDeleteProject?: () => void;
}

const ProjectHeader = ({ project, onNewScene, onEditProject, onNewCharacter, onDeleteProject }: ProjectHeaderProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-anime-purple">{project.title}</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto" 
              onClick={onEditProject}
            >
              <Edit className="h-4 w-4 text-muted-foreground hover:text-anime-purple" />
              <span className="sr-only">Edit Project</span>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-1 bg-anime-light-purple text-anime-purple rounded-md text-sm">
              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
            </span>
            {project.genres.map((genre) => (
              <span 
                key={genre} 
                className="px-2 py-1 bg-anime-gray-200 text-anime-gray-700 rounded-md text-xs"
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </span>
            ))}
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays size={16} />
              {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-3 text-lg italic text-muted-foreground">{project.logline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onDeleteProject && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                    All scenes and characters associated with this project will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={onDeleteProject}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button 
            onClick={onNewCharacter}
            variant="outline"
            className="border-anime-purple text-anime-purple hover:bg-anime-light-purple/20"
          >
            <Users className="mr-2 h-4 w-4" />
            New Character
          </Button>
          <Button 
            onClick={onNewScene}
            className="bg-anime-purple hover:bg-anime-dark-purple transition-colors"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            New Scene
          </Button>
        </div>
      </div>
      
      {project.inspirations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Inspirations:</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {project.inspirations.map((inspiration, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-anime-gray-100 text-anime-gray-700 rounded-md text-xs"
              >
                {inspiration}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 h-[1px] bg-border" />
    </div>
  );
};

export default ProjectHeader;
