
import React from 'react';
import { Challenge } from '@/types/creative-gym';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Dumbbell, Clock, RotateCcw } from 'lucide-react';
import { WandSparkles as Wand2 } from 'lucide-react';

interface ChallengeInstructionsProps {
  challenge: Challenge;
}

const ChallengeInstructions: React.FC<ChallengeInstructionsProps> = ({ challenge }) => {
  // Return appropriate icon based on challenge type
  const getChallengeIcon = () => {
    switch (challenge.type) {
      case 'prompt-forge':
        return <Wand2 className="h-5 w-5 text-anime-purple" />;
      case 'style-lock':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'constraint-bench':
        return <Dumbbell className="h-5 w-5 text-green-500" />;
      case 'time-puncher':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'remix-mode':
        return <RotateCcw className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-md bg-muted">
            {getChallengeIcon()}
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Instructions</h2>
            <p className="text-muted-foreground mb-4">{challenge.description}</p>
            
            {/* Display prompts for Prompt Forge */}
            {challenge.type === 'prompt-forge' && challenge.prompts && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Your Prompts:</h3>
                <div className="flex flex-wrap gap-2">
                  {challenge.prompts.map((prompt, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-anime-purple/10 text-anime-purple rounded-full text-sm"
                    >
                      {prompt}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display style for Style Lock */}
            {challenge.type === 'style-lock' && challenge.style && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Style:</h3>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm">
                  {challenge.style}
                </span>
              </div>
            )}
            
            {/* Display constraints for Constraint Bench */}
            {challenge.type === 'constraint-bench' && challenge.constraints && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Your Constraints:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {challenge.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm">{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Display duration for Time Puncher */}
            {challenge.type === 'time-puncher' && challenge.duration && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Time Limit:</h3>
                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm">
                  {Math.floor(challenge.duration / 60)} minutes
                </span>
              </div>
            )}
            
            {/* Display content to remix for Remix Mode */}
            {challenge.type === 'remix-mode' && challenge.remixContent && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Content to Remix:</h3>
                <div className="p-4 bg-muted/50 rounded-md italic text-sm border-l-4 border-purple-500">
                  "{challenge.remixContent}"
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Transform this content into something new: change the genre, perspective, setting, or tone.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeInstructions;
