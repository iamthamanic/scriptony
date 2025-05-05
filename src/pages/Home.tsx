
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Globe, Upload, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/project/useProjects';
import { useWorldsState } from '@/hooks/useWorldsState';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get recent projects
  const { projects, isLoading: projectsLoading } = useProjects();
  
  // Get recent worlds
  const { worlds, isLoading: worldsLoading } = useWorldsState(user?.id);
  
  const recentProjects = projects.slice(0, 3);
  const recentWorlds = worlds.slice(0, 3);

  return (
    <div className="py-8 px-4 md:px-6 w-full space-y-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Willkommen zurück, {user?.email?.split('@')[0] || "Demo User"}!</h1>
          <p className="text-muted-foreground">Hier ist eine Übersicht deiner aktuellen Projekte und Welten.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-anime-purple" />
                Skript-Projekte
              </CardTitle>
              <CardDescription>
                Erstelle und verwalte deine Skript-Projekte
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button 
                onClick={() => navigate('/projects')}
                className="bg-anime-purple hover:bg-anime-dark-purple w-full"
              >
                Zu meinen Projekten
              </Button>
              <Button 
                onClick={() => navigate('/upload')}
                variant="outline"
                className="w-full"
              >
                Neues Skript hochladen
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-anime-purple" />
                Worldbuilding
              </CardTitle>
              <CardDescription>
                Erschaffe und gestalte deine Welten
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button 
                onClick={() => navigate('/worldbuilding')}
                className="bg-anime-purple hover:bg-anime-dark-purple w-full"
              >
                Zu meinen Welten
              </Button>
              <Button 
                onClick={() => navigate('/worldbuilding')}
                variant="outline"
                className="w-full"
              >
                Neue Welt erstellen
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          {/* Recent Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Zuletzt bearbeitete Projekte</h2>
              <Button 
                variant="link" 
                onClick={() => navigate('/projects')}
                className="text-anime-purple"
              >
                Alle anzeigen
              </Button>
            </div>
            
            {projectsLoading ? (
              <p className="text-muted-foreground">Projekte werden geladen...</p>
            ) : recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentProjects.map(project => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/projects')}>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Vor kurzem bearbeitet
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2">{project.logline || "Keine Beschreibung"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Noch keine Projekte erstellt.</p>
            )}
          </section>
          
          {/* Recent Worlds */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Zuletzt bearbeitete Welten</h2>
              <Button 
                variant="link" 
                onClick={() => navigate('/worldbuilding')}
                className="text-anime-purple"
              >
                Alle anzeigen
              </Button>
            </div>
            
            {worldsLoading ? (
              <p className="text-muted-foreground">Welten werden geladen...</p>
            ) : recentWorlds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentWorlds.map(world => (
                  <Card key={world.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/worldbuilding')}>
                    <CardHeader>
                      <CardTitle className="text-lg">{world.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Vor kurzem bearbeitet
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2">{world.description || "Keine Beschreibung"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Noch keine Welten erstellt.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
