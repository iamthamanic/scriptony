
import React, { useState } from 'react';
import { Scene } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineViewProps {
  scenes: Scene[];
  onSceneClick: (scene: Scene) => void;
}

const TimelineView = ({ scenes, onSceneClick }: TimelineViewProps) => {
  const [sortBy, setSortBy] = useState<'timecode' | 'location' | 'emotional'>('timecode');
  
  // Sort scenes by selected criteria
  const sortedScenes = [...scenes].sort((a, b) => {
    if (sortBy === 'timecode') {
      return a.timecodeStart.localeCompare(b.timecodeStart);
    } else if (sortBy === 'location') {
      return a.location.localeCompare(b.location);
    } else {
      // Sort by emotional significance
      const emotionalOrder = {
        'introduction': 1,
        'buildup': 2,
        'turning-point': 3,
        'climax': 4,
        'resolution': 5,
        'finale': 6,
        'other': 7
      };
      // @ts-ignore - we know the keys exist
      return emotionalOrder[a.emotionalSignificance] - emotionalOrder[b.emotionalSignificance];
    }
  });

  // Group scenes by location if sorting by location
  const groupedScenes = sortBy === 'location' 
    ? sortedScenes.reduce((groups: Record<string, Scene[]>, scene) => {
        const group = scene.location;
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(scene);
        return groups;
      }, {})
    : {};

  // Get color for emotional significance
  const getEmotionColor = (significance: string) => {
    switch (significance) {
      case 'introduction':
        return 'border-blue-400 bg-blue-50';
      case 'buildup':
        return 'border-green-400 bg-green-50';
      case 'climax':
        return 'border-red-400 bg-red-50';
      case 'turning-point':
        return 'border-purple-400 bg-purple-50';
      case 'resolution':
        return 'border-yellow-400 bg-yellow-50';
      case 'finale':
        return 'border-orange-400 bg-orange-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="mt-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Timeline View</h2>
      
      <Tabs defaultValue="timecode" onValueChange={(val) => setSortBy(val as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="timecode" className="flex items-center gap-1">
            <Clock size={16} />
            By Timecode
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-1">
            <MapPin size={16} />
            By Location
          </TabsTrigger>
          <TabsTrigger value="emotional" className="flex items-center gap-1">
            <CalendarDays size={16} />
            By Significance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timecode" className="border-l-2 border-anime-purple pl-5 ml-2">
          {sortedScenes.map((scene) => (
            <div 
              key={scene.id} 
              className="timeline-item mb-4"
              onClick={() => onSceneClick(scene)}
            >
              <div className="timeline-dot" />
              <h3 className="font-medium">
                Scene {scene.sceneNumber}: {scene.location}
              </h3>
              <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {scene.timecodeStart} - {scene.timecodeEnd}
                </span>
              </div>
              <p className="text-sm mt-1 line-clamp-2">{scene.description}</p>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="location" className="space-y-6">
          {Object.entries(groupedScenes).map(([location, scenes]) => (
            <div key={location} className="border-l-2 border-anime-purple pl-5 ml-2">
              <h3 className="font-bold mb-2">{location}</h3>
              {scenes.map((scene) => (
                <div 
                  key={scene.id} 
                  className="timeline-item mb-4"
                  onClick={() => onSceneClick(scene)}
                >
                  <div className="timeline-dot" />
                  <h4 className="font-medium">
                    Scene {scene.sceneNumber} ({scene.timeOfDay})
                  </h4>
                  <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {scene.timecodeStart} - {scene.timecodeEnd}
                    </span>
                  </div>
                  <p className="text-sm mt-1 line-clamp-2">{scene.description}</p>
                </div>
              ))}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="emotional" className="space-y-4">
          {sortedScenes.map((scene) => (
            <div 
              key={scene.id} 
              className={cn(
                "p-3 border-l-4 rounded-md mb-2", 
                getEmotionColor(scene.emotionalSignificance),
                "cursor-pointer hover:shadow-md transition-shadow"
              )}
              onClick={() => onSceneClick(scene)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    Scene {scene.sceneNumber}: {scene.location}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {scene.emotionalSignificance}
                    {scene.emotionalNotes && ` - ${scene.emotionalNotes}`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={14} /> {scene.timecodeStart}
                </span>
              </div>
              <p className="text-sm mt-2 line-clamp-2">{scene.description}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimelineView;
