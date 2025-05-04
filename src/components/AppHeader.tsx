
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FilePlus, Settings } from "lucide-react";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

interface AppHeaderProps {
  onNewProject: () => void;
  onOpenAccountSettings?: () => void;
  accountName?: string;
}

const AppHeader = ({
  onNewProject,
  onOpenAccountSettings,
  accountName = "User"
}: AppHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <p className="text-muted-foreground mt-1">
          <span>{t('common.workspace', { name: accountName })}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        {onOpenAccountSettings && (
          <Button 
            onClick={onOpenAccountSettings} 
            variant="outline" 
            className="transition-colors"
          >
            <Settings className="mr-2 h-4 w-4" />
            {t('common.accountSettings')}
          </Button>
        )}
        <Button 
          onClick={onNewProject} 
          className="bg-anime-purple hover:bg-anime-dark-purple transition-colors"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          {t('common.newProject')}
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
