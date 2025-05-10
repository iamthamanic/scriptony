
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Globe, Upload, Settings, Menu, X, Dumbbell, BarChart2, TestTube2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { checkIsAdmin } from '@/utils/trackUsage';

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
          "px-4 py-2 rounded-md transition-colors text-base font-medium whitespace-nowrap",
          isActive 
            ? "bg-anime-light-purple text-anime-purple dark:bg-anime-dark-purple/30 dark:text-white" 
            : "text-anime-gray-700 hover:bg-muted/50 hover:text-anime-purple dark:text-white/90 dark:hover:text-white"
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
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/projects", icon: FileText, label: "Skript-Projekte" },
    { to: "/worldbuilding", icon: Globe, label: "Worldbuilding" },
    { to: "/creative-gym", icon: Dumbbell, label: "Creative Gym" },
    { to: "/upload", icon: Upload, label: "Upload" },
  ];
  
  // Admin nav items, only shown to admin users
  const adminNavItems = [
    { to: "/admin/usage", icon: BarChart2, label: "Usage Analytics" },
    { to: "/admin/tests", icon: TestTube2, label: "Tests" },
  ];
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const admin = await checkIsAdmin();
        setIsAdmin(admin);
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  const closeSheet = () => setIsOpen(false);

  return (
    <div className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm h-16 flex items-center px-4 md:px-6">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center">
          <Logo size="sm" />
        </div>
        
        {/* Desktop Navigation - Centered with improved spacing */}
        <nav className="hidden md:flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to}
              label={item.label} 
            />
          ))}
          
          {/* Show admin links if user is admin */}
          {isAdmin && adminNavItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to}
              label={item.label} 
            />
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
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
                          ? "bg-anime-light-purple text-anime-purple dark:bg-anime-dark-purple/30 dark:text-white" 
                          : "text-anime-gray-700 hover:bg-muted/50 hover:text-anime-purple dark:text-white/90 dark:hover:text-white"
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
                    
                    {/* Show admin links if user is admin */}
                    {isAdmin && (
                      <>
                        <div className="border-t my-2 pt-2">
                          <div className="px-4 py-1 text-xs font-semibold text-muted-foreground">Admin</div>
                        </div>
                        {adminNavItems.map((item) => (
                          <NavItem 
                            key={item.to} 
                            to={item.to} 
                            icon={item.icon} 
                            label={item.label} 
                            onClose={closeSheet}
                          />
                        ))}
                      </>
                    )}
                    
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
