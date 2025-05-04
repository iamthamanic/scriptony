
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Globe, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface AppSidebarProps {
  onOpenAccountSettings: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ onOpenAccountSettings }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navigationItems = [
    {
      title: "Skript Projekte",
      path: "/",
      icon: FileText,
    },
    {
      title: "Worldbuilding",
      path: "/worldbuilding",
      icon: Globe,
    }
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1.5 text-sm font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                  >
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center gap-3 px-3",
                        location.pathname === item.path 
                          ? "bg-anime-purple text-white" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Account Einstellungen"
                  onClick={onOpenAccountSettings}
                >
                  <div className="flex items-center gap-3 px-3 text-gray-500 hover:text-gray-700">
                    <Settings className="h-4 w-4" />
                    <span>Account Einstellungen</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
