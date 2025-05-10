
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { DisciplineType } from '@/types/creative-gym';

interface DisciplineChallengesProps {
  disciplineType: DisciplineType;
  onBack: () => void;
}

const DisciplineChallenges = ({ disciplineType, onBack }: DisciplineChallengesProps) => {
  // Here we would fetch challenges for the specific discipline
  const placeholderChallenges = [
    {
      id: '1',
      title: 'Beginner Exercise',
      description: 'An introductory exercise to get you started.',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Intermediate Challenge',
      description: 'A more complex challenge for those with some experience.',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'Advanced Masterclass',
      description: 'A challenging exercise for experienced practitioners.',
      difficulty: 'advanced'
    }
  ];

  const getDisciplineTitle = () => {
    switch (disciplineType) {
      case 'comedy':
        return 'Comedy Writing';
      case 'songwriting':
        return 'Songwriting';
      case 'visual-arts':
        return 'Visual Arts';
      case 'photography':
        return 'Photography';
      case 'filmmaking':
        return 'Filmmaking';
      default:
        return 'Discipline';
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold">{getDisciplineTitle()} Exercises</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderChallenges.map(challenge => (
          <Card key={challenge.id}>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>
                Difficulty: <span className="capitalize">{challenge.difficulty}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{challenge.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Exercise</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisciplineChallenges;
