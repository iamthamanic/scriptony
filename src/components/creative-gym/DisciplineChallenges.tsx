
import React from 'react';
import { ArrowLeft, Clock, BarChart, Upload } from 'lucide-react';
import { DisciplineType, DisciplineChallenge } from '@/types/creative-gym';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Theater, Music4, Palette, Camera, Film } from 'lucide-react';

interface DisciplineChallengesProps {
  disciplineType: DisciplineType;
  onBack: () => void;
}

// Helper function to get icon based on discipline type
const getDisciplineIcon = (type: DisciplineType) => {
  switch (type) {
    case 'comedy':
      return <Theater className="h-5 w-5 text-yellow-500" />;
    case 'songwriting':
      return <Music4 className="h-5 w-5 text-blue-500" />;
    case 'visual-arts':
      return <Palette className="h-5 w-5 text-pink-500" />;
    case 'photography':
      return <Camera className="h-5 w-5 text-purple-500" />;
    case 'filmmaking':
      return <Film className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

// Helper to get background and hover color based on discipline type
const getDisciplineColors = (type: DisciplineType) => {
  switch (type) {
    case 'comedy':
      return { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' };
    case 'songwriting':
      return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' };
    case 'visual-arts':
      return { bg: 'bg-pink-500', hover: 'hover:bg-pink-600' };
    case 'photography':
      return { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' };
    case 'filmmaking':
      return { bg: 'bg-red-500', hover: 'hover:bg-red-600' };
    default:
      return { bg: 'bg-gray-500', hover: 'hover:bg-gray-600' };
  }
};

// Sample challenges for each discipline
const disciplineChallenges: Record<DisciplineType, DisciplineChallenge[]> = {
  'comedy': [
    {
      id: 'comedy-1',
      title: '3-Minute Bureaucracy Routine',
      disciplineType: 'comedy',
      description: 'Write a short stand-up comedy routine about bureaucracy and administrative absurdities',
      instructions: 'Create a 3-minute comedy routine that explores the frustrating yet humorous aspects of bureaucracy. Consider topics like filling out forms, waiting in line, or dealing with unhelpful automated systems.',
      difficulty: 'intermediate',
      estimatedTime: '30-45 minutes',
      allowsUpload: false,
      createdAt: new Date()
    },
    {
      id: 'comedy-2',
      title: 'Character Comedy Sketch',
      disciplineType: 'comedy',
      description: 'Create a comedy sketch featuring an eccentric character in an everyday situation',
      instructions: 'Develop a unique character with distinct personality traits and write a short comedy sketch (1-2 pages) placing them in a mundane situation that highlights their quirks.',
      difficulty: 'intermediate',
      estimatedTime: '45-60 minutes',
      allowsUpload: false,
      createdAt: new Date()
    }
  ],
  'songwriting': [
    {
      id: 'songwriting-1',
      title: 'Loss-themed Refrain with Idiom Hook',
      disciplineType: 'songwriting',
      description: 'Write a refrain about loss that uses a common saying or idiom as its hook',
      instructions: 'Create a memorable refrain (chorus) for a song about loss or letting go. The hook should creatively incorporate a common idiom or saying, giving it a fresh meaning in the context of your lyrics.',
      difficulty: 'intermediate',
      estimatedTime: '30-45 minutes',
      allowsUpload: false,
      createdAt: new Date()
    },
    {
      id: 'songwriting-2',
      title: 'Story-Based Verse Structure',
      disciplineType: 'songwriting',
      description: 'Write verses that tell a complete story with beginning, middle, and end',
      instructions: 'Create a set of verses (not including chorus) that tell a cohesive story with narrative progression. Focus on storytelling techniques while maintaining rhythm and musicality.',
      difficulty: 'advanced',
      estimatedTime: '45-60 minutes',
      allowsUpload: true,
      createdAt: new Date()
    }
  ],
  'visual-arts': [
    {
      id: 'visual-arts-1',
      title: 'Three-Color Scene',
      disciplineType: 'visual-arts',
      description: 'Paint or draw a scene using only three colors',
      instructions: 'Create a complete scene (landscape, still life, or figure) using exactly three colors. Focus on composition, value contrast, and creative color mixing to maximize visual impact with limited palette.',
      difficulty: 'intermediate',
      estimatedTime: '60-90 minutes',
      allowsUpload: true,
      createdAt: new Date()
    },
    {
      id: 'visual-arts-2',
      title: 'Emotional Abstract',
      disciplineType: 'visual-arts',
      description: 'Create an abstract piece that expresses a specific emotion',
      instructions: 'Without using recognizable imagery, create an abstract artwork that conveys a specific emotion through color, line, texture, and composition. Then provide a brief explanation of your artistic choices.',
      difficulty: 'beginner',
      estimatedTime: '30-60 minutes',
      allowsUpload: true,
      createdAt: new Date()
    }
  ],
  'photography': [
    {
      id: 'photography-1',
      title: 'Storytelling Reflection',
      disciplineType: 'photography',
      description: 'Find and photograph a reflection that tells a visual story',
      instructions: 'Capture a photograph featuring a reflection (in water, glass, metal, etc.) that tells a story or creates visual interest. Focus on composition, lighting, and the narrative elements created by the reflection.',
      difficulty: 'intermediate',
      estimatedTime: '45-60 minutes',
      allowsUpload: true,
      createdAt: new Date()
    },
    {
      id: 'photography-2',
      title: 'Emotional Portrait',
      disciplineType: 'photography',
      description: 'Create a portrait that captures a genuine emotional moment',
      instructions: 'Photograph a portrait that authentically captures an emotion. This can be staged or candid, but should feel genuine. Consider lighting, framing, and timing to enhance the emotional impact.',
      difficulty: 'advanced',
      estimatedTime: '60 minutes',
      allowsUpload: true,
      createdAt: new Date()
    }
  ],
  'filmmaking': [
    {
      id: 'filmmaking-1',
      title: 'One-Minute Internal Conflict Scene',
      disciplineType: 'filmmaking',
      description: 'Write a one-minute scene featuring a character with internal conflict',
      instructions: 'Write a screenplay for a one-minute scene (approximately one page) that reveals a character's internal conflict without explicitly stating it. Focus on visual storytelling, subtext, and character actions.',
      difficulty: 'intermediate',
      estimatedTime: '30-45 minutes',
      allowsUpload: false,
      createdAt: new Date()
    },
    {
      id: 'filmmaking-2',
      title: 'Visual Storyboard Sequence',
      disciplineType: 'filmmaking',
      description: 'Create a storyboard sequence for a pivotal moment',
      instructions: 'Design a 6-12 panel storyboard sequence for a key dramatic moment. Focus on shot composition, camera movement suggestions, and visual storytelling. Can be sketched, photographed, or described in detail.',
      difficulty: 'advanced',
      estimatedTime: '60-90 minutes',
      allowsUpload: true,
      createdAt: new Date()
    }
  ]
};

const DisciplineChallenges: React.FC<DisciplineChallengesProps> = ({ disciplineType, onBack }) => {
  const challenges = disciplineChallenges[disciplineType] || [];
  const colors = getDisciplineColors(disciplineType);
  
  // Helper to get discipline display name
  const getDisciplineTitle = () => {
    const discipline = disciplineType.replace('-', ' ');
    return discipline.charAt(0).toUpperCase() + discipline.slice(1);
  };
  
  // Helper to get emoji for discipline
  const getDisciplineEmoji = () => {
    switch (disciplineType) {
      case 'comedy': return '🎭';
      case 'songwriting': return '🎶';
      case 'visual-arts': return '🎨';
      case 'photography': return '📸';
      case 'filmmaking': return '🎬';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {getDisciplineIcon(disciplineType)}
          {getDisciplineEmoji()} {getDisciplineTitle()} Challenges
        </h2>
      </div>
      
      <p className="text-muted-foreground">
        Complete these challenges to improve your skills in {getDisciplineTitle().toLowerCase()} and earn XP.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{challenge.title}</CardTitle>
                <Badge variant={challenge.difficulty === 'beginner' ? 'secondary' : 
                               challenge.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                  {challenge.difficulty}
                </Badge>
              </div>
              <CardDescription>
                {challenge.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4">
                <p>{challenge.instructions}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {challenge.estimatedTime && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                      <Clock className="h-3 w-3" />
                      {challenge.estimatedTime}
                    </div>
                  )}
                  {challenge.allowsUpload && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                      <Upload className="h-3 w-3" />
                      File upload
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className={`w-full ${colors.bg} ${colors.hover}`}>
                Start Challenge
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisciplineChallenges;
