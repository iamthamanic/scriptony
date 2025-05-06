
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/project/useProjects';
import { useWorldsState } from '@/hooks/useWorldsState';
import { useTranslation } from 'react-i18next';
import QuoteCarousel from '@/components/QuoteCarousel';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get recent projects
  const { projects, isLoading: projectsLoading } = useProjects();
  
  // Get recent worlds
  const { 
    worlds, 
    isLoading: worldsLoading, 
    loadWorlds 
  } = useWorldsState(user?.id);
  
  // Ensure worlds are loaded when component mounts
  useEffect(() => {
    console.log("Home component mount, calling loadWorlds");
    loadWorlds();
  }, [loadWorlds]);

  const recentProjects = projects.slice(0, 3);
  const recentWorlds = worlds.slice(0, 3);

  console.log("Home render - worldsLoading:", worldsLoading, "worlds count:", worlds.length);

  return (
    <div className="py-8 px-4 md:px-6 w-full space-y-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('common.welcome')}, {user?.email?.split('@')[0] || "Dev"}!</h1>
          <p className="text-muted-foreground">Hier ist eine Übersicht deiner aktuellen Projekte und Welten.</p>
        </header>
        
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
            ) : worlds.length > 0 ? (
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
      
      {/* Quote Carousel - moved to the bottom of the page */}
      <QuoteCarousel className="mt-16" />
    </div>
  );
};

export default Home;
