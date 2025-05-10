
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DisciplineType } from '@/types/creative-gym';
import { Theater, Music4, Palette, Camera, Film } from 'lucide-react';

interface DisciplinesListProps {
  onSelectDiscipline: (discipline: DisciplineType) => void;
}

const disciplines = [
  {
    type: 'comedy' as DisciplineType,
    title: 'Comedy',
    description: 'Write stand-up routines, sketches, and humorous dialogues',
    icon: <Theater className="h-5 w-5 text-yellow-500" />,
    emoji: '🎭',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
  },
  {
    type: 'songwriting' as DisciplineType,
    title: 'Songwriting',
    description: 'Create lyrics, hooks, melodies and explore musical storytelling',
    icon: <Music4 className="h-5 w-5 text-blue-500" />,
    emoji: '🎶',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    type: 'visual-arts' as DisciplineType,
    title: 'Visual Arts',
    description: 'Explore painting, drawing, and illustration challenges',
    icon: <Palette className="h-5 w-5 text-pink-500" />,
    emoji: '🎨',
    color: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600',
  },
  {
    type: 'photography' as DisciplineType,
    title: 'Photography',
    description: 'Find unique perspectives, compositions, and photographic stories',
    icon: <Camera className="h-5 w-5 text-purple-500" />,
    emoji: '📸',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
  },
  {
    type: 'filmmaking' as DisciplineType,
    title: 'Filmmaking',
    description: 'Develop screenplay scenes, storyboards, and cinematic concepts',
    icon: <Film className="h-5 w-5 text-red-500" />,
    emoji: '🎬',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
  },
];

const DisciplinesList: React.FC<DisciplinesListProps> = ({ onSelectDiscipline }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {disciplines.map((discipline) => (
        <Card key={discipline.type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {discipline.icon}
              {discipline.emoji} {discipline.title}
            </CardTitle>
            <CardDescription>
              {discipline.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Complete challenges specific to {discipline.title.toLowerCase()} and improve your creative skills in this area.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onSelectDiscipline(discipline.type)}
              className={`w-full ${discipline.color} ${discipline.hoverColor}`}
            >
              Explore Challenges
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DisciplinesList;
