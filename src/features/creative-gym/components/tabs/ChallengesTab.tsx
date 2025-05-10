
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Dumbbell, Clock, RotateCcw } from 'lucide-react';
import { WandSparkles as Wand2 } from 'lucide-react';
import { ChallengeType } from '@/types/creative-gym';
import { trackUsage } from '@/lib/trackUsage';

interface ChallengesTabProps {
  onStartChallenge: (type: ChallengeType) => void;
}

const ChallengesTab = ({ onStartChallenge }: ChallengesTabProps) => {
  // Add challenge start tracking
  const handleStartChallenge = (type: ChallengeType) => {
    // Track challenge start
    trackUsage('creative_gym', 'challenge_started', { type });
    onStartChallenge(type);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Prompt Forge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-anime-purple" />
            Prompt Forge
          </CardTitle>
          <CardDescription>
            Create a scene from random words
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Receive 2-4 random words and forge them into a creative scene or concept.
            Stretch your imagination and create unexpected connections.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleStartChallenge('prompt-forge')}
            className="w-full bg-anime-purple hover:bg-anime-dark-purple"
          >
            Start Challenge
          </Button>
        </CardFooter>
      </Card>
      
      {/* Style Lock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Style Lock
          </CardTitle>
          <CardDescription>
            Write in a specific style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Challenge yourself to write in a specific style, from Shakespearean dialog
            to modern slang. Expand your stylistic range.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleStartChallenge('style-lock')}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Start Challenge
          </Button>
        </CardFooter>
      </Card>
      
      {/* Constraint Bench */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-green-500" />
            Constraint Bench
          </CardTitle>
          <CardDescription>
            Write with creative limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Push your creativity by writing with specific constraints like
            word limits, forbidden letters, or structural requirements.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleStartChallenge('constraint-bench')}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Start Challenge
          </Button>
        </CardFooter>
      </Card>
      
      {/* Time Puncher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Time Puncher
          </CardTitle>
          <CardDescription>
            Race against the clock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Write as much quality content as you can within a time limit.
            Perfect for practicing writing under pressure.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleStartChallenge('time-puncher')}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Start Challenge
          </Button>
        </CardFooter>
      </Card>
      
      {/* Remix Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-purple-500" />
            Remix Mode
          </CardTitle>
          <CardDescription>
            Transform existing content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Take provided content and transform it into something completely new.
            Change perspective, genre, or tone.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleStartChallenge('remix-mode')}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Start Challenge
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChallengesTab;
