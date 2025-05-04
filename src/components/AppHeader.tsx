
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Settings, Globe } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  onNewProject: () => void;
  onOpenAccountSettings: () => void;
  accountName: string;
}

const AppHeader = ({ onNewProject, onOpenAccountSettings, accountName }: AppHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Logo size="small" />
        
        <div className="hidden md:flex gap-4 ml-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Projekte
          </Link>
          <Link to="/worldbuilding" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <Globe className="h-4 w-4" />
            Worldbuilding
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAccountSettings}
          className="gap-2"
        >
          <div className="h-5 w-5 rounded-full bg-anime-purple text-xs flex items-center justify-center text-white">
            {accountName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline">{accountName}</span>
        </Button>
        
        <Button
          onClick={onNewProject}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>New Project</span>
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
