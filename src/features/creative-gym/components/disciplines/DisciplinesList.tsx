
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DisciplineType } from "@/types/creative-gym";

interface DisciplinesListProps {
  onSelectDiscipline: (discipline: DisciplineType) => void;
}

const DisciplinesList = ({ onSelectDiscipline }: DisciplinesListProps) => {
  const disciplines = [
    { 
      type: 'comedy' as DisciplineType, 
      title: 'Comedy Writing', 
      description: 'Develop your humor skills',
      color: 'text-yellow-500'
    },
    { 
      type: 'songwriting' as DisciplineType, 
      title: 'Songwriting', 
      description: 'Create lyrics and melodies',
      color: 'text-blue-500'
    },
    { 
      type: 'visual-arts' as DisciplineType, 
      title: 'Visual Arts', 
      description: 'Explore visual storytelling',
      color: 'text-green-500'
    },
    { 
      type: 'photography' as DisciplineType, 
      title: 'Photography', 
      description: 'Capture moments with purpose',
      color: 'text-purple-500'
    },
    { 
      type: 'filmmaking' as DisciplineType, 
      title: 'Filmmaking', 
      description: 'Learn cinematic storytelling',
      color: 'text-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {disciplines.map((discipline) => (
        <Card key={discipline.type}>
          <CardHeader>
            <CardTitle className={`${discipline.color}`}>{discipline.title}</CardTitle>
            <CardDescription>{discipline.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Specialized exercises to improve your skills in {discipline.title.toLowerCase()}.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onSelectDiscipline(discipline.type)}
              className="w-full"
            >
              Explore Exercises
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DisciplinesList;
