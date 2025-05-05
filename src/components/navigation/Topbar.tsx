
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Globe, Upload, Settings, Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItemProps {
  to: string;
  icon?: React.ElementType;
  label: string;
  onClose?: () => void;
}

const NavItem = ({ to, icon: Icon, label, onClose }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink 
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "px-4 py-2 rounded-md transition-colors text-base font-medium",
          isActive 
            ? "bg-anime-light-purple text-anime-purple" 
            : "text-anime-gray-700 hover:bg-muted/50 hover:text-anime-purple"
        )
      }
    >
      {/* Only render icon in mobile menu */}
      {Icon && onClose && <Icon className="h-5 w-5 mr-2 inline" />}
      <span>{label}</span>
    </NavLink>
  );
};

const Topbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/projects", icon: FileText, label: "Skript-Projekte" },
    { to: "/worldbuilding", icon: Globe, label: "Worldbuilding" },
    { to: "/upload", icon: Upload, label: "Upload" },
  ];
  
  const closeSheet = () => setIsOpen(false);

  return (
    <div className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm h-16 flex items-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <Logo size="sm" />
        </div>
        
        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to}
              label={item.label} 
            />
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          {/* Account link replaced with Settings icon for desktop */}
          {user && (
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink 
                    to="/account"
                    className={({ isActive }) =>
                      cn(
                        "p-2 rounded-md transition-colors flex items-center justify-center",
                        isActive 
                          ? "bg-anime-light-purple text-anime-purple" 
                          : "text-anime-gray-700 hover:bg-muted/50 hover:text-anime-purple"
                      )
                    }
                  >
                    <Settings className="h-5 w-5" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          
          <ThemeToggle />
          
          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-background">
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex items-center justify-between">
                    <Logo size="sm" />
                    <Button variant="ghost" size="icon" onClick={closeSheet}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <NavItem 
                        key={item.to} 
                        to={item.to} 
                        icon={item.icon} 
                        label={item.label} 
                        onClose={closeSheet}
                      />
                    ))}
                    {user && (
                      <NavItem 
                        to="/account" 
                        icon={Settings} 
                        label="Account" 
                        onClose={closeSheet}
                      />
                    )}
                  </nav>
                  
                  <div className="flex flex-col gap-4 mt-auto">
                    <ThemeToggle />
                    <LanguageSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
