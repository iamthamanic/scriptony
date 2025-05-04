
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Logo from "./Logo";

interface AppHeaderProps {
  onNewProject: () => void;
  accountName: string;
}

const AppHeader = ({ onNewProject, accountName }: AppHeaderProps) => {
  const isWorldbuilding = window.location.pathname === '/worldbuilding';
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Logo size="sm" />
      </div>
      
      <div className="flex items-center gap-2">
        {isWorldbuilding ? (
          <Button
            onClick={onNewProject}
            size="sm"
            className="bg-anime-purple hover:bg-anime-dark-purple"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Neue Welt</span>
          </Button>
        ) : (
          <Button
            onClick={onNewProject}
            size="sm"
            className="bg-anime-purple hover:bg-anime-dark-purple"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>New Project</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
