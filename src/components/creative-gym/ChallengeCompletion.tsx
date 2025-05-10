
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { WandSparkles as Wand2 } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Dumbbell } from 'lucide-react';
import { Clock } from 'lucide-react';
import { useCreativeGym } from '@/contexts/CreativeGymContext';
import { toast } from 'sonner';

interface ChallengeCompletionProps {
  content: string;
  wordCount: number;
}

const ChallengeCompletion: React.FC<ChallengeCompletionProps> = ({ content, wordCount }) => {
  const navigate = useNavigate();
  const { userProgress, startChallenge } = useCreativeGym();
  
  const handleStartNewChallenge = (type: 'prompt-forge' | 'style-lock' | 'constraint-bench' | 'time-puncher' | 'remix-mode') => {
    startChallenge(type);
  };
  
  const handleSaveAsProject = () => {
    toast.info("Coming Soon!", {
      description: "Converting challenges to projects will be available in a future update.",
      duration: 3000
    });
  };
  
  return (
    <div className="py-8 px-4 md:px-6 w-full animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Challenge Complete!</h1>
          <p className="text-muted-foreground">
            You've successfully completed the challenge and earned XP.
          </p>
        </div>
        
        {/* Stats Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-muted-foreground text-sm">Words</p>
                <p className="text-2xl font-bold">{wordCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Characters</p>
                <p className="text-2xl font-bold">{content.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Level</p>
                <p className="text-2xl font-bold">{userProgress.level}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total XP</p>
                <p className="text-2xl font-bold">{userProgress.xp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Content Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Writing</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none">
                {content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph || <br />}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={handleSaveAsProject}
            className="py-6"
            variant="outline"
          >
            <FileText className="mr-2 h-5 w-5" />
            Convert to Project
          </Button>
          <Button 
            onClick={() => navigate('/creative-gym')}
            className="py-6 bg-anime-purple hover:bg-anime-dark-purple"
          >
            <FileText className="mr-2 h-5 w-5" />
            Challenge History
          </Button>
        </div>
        
        {/* More Challenges */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Try Another Challenge</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <Button 
              variant="ghost" 
              className="flex flex-col py-6 h-auto"
              onClick={() => handleStartNewChallenge('prompt-forge')}
            >
              <span className="text-anime-purple mb-1">
                <Wand2 className="h-5 w-5 mx-auto" />
              </span>
              <span className="text-xs">Prompt Forge</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col py-6 h-auto"
              onClick={() => handleStartNewChallenge('style-lock')}
            >
              <span className="text-blue-500 mb-1">
                <FileText className="h-5 w-5 mx-auto" />
              </span>
              <span className="text-xs">Style Lock</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col py-6 h-auto"
              onClick={() => handleStartNewChallenge('constraint-bench')}
            >
              <span className="text-green-500 mb-1">
                <Dumbbell className="h-5 w-5 mx-auto" />
              </span>
              <span className="text-xs">Constraint Bench</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col py-6 h-auto"
              onClick={() => handleStartNewChallenge('time-puncher')}
            >
              <span className="text-orange-500 mb-1">
                <Clock className="h-5 w-5 mx-auto" />
              </span>
              <span className="text-xs">Time Puncher</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col py-6 h-auto"
              onClick={() => handleStartNewChallenge('remix-mode')}
            >
              <span className="text-purple-500 mb-1">
                <RotateCcw className="h-5 w-5 mx-auto" />
              </span>
              <span className="text-xs">Remix Mode</span>
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCompletion;
