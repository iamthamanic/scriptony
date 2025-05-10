
import React, { useState, useEffect } from 'react';
import { useCreativeGym } from '@/contexts/creative-gym';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChallengeInstructions from './ChallengeInstructions';
import ChallengeCompletion from './ChallengeCompletion';

const ChallengeRunner: React.FC = () => {
  const { activeChallengeId, challenges, completeChallenge, cancelChallenge } = useCreativeGym();
  const { toast } = useToast();
  
  const [content, setContent] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [startTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  const activeChallenge = challenges.find(c => c.id === activeChallengeId);
  
  // Handle timer for timed challenges
  useEffect(() => {
    if (!activeChallenge) return;
    
    let intervalId: number;
    
    if (activeChallenge.duration) {
      intervalId = window.setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        // Auto-complete when time is up
        if (elapsed >= activeChallenge.duration) {
          handleComplete();
          clearInterval(intervalId);
        }
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeChallenge, startTime]);
  
  // If no active challenge, return early
  if (!activeChallenge) {
    return <div className="p-8 text-center">No active challenge found</div>;
  }
  
  // Count words in content
  const countWords = (text: string): number => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };
  
  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(countWords(newContent));
  };
  
  // Handle challenge completion
  const handleComplete = () => {
    if (content.trim().length === 0) {
      toast({
        title: "Cannot submit empty content",
        description: "Please write something before submitting your challenge.",
        variant: "destructive"
      });
      return;
    }
    
    completeChallenge(content);
    setIsComplete(true);
    
    toast({
      title: "Challenge completed!",
      description: "Your creative work has been saved.",
    });
  };
  
  // Handle challenge cancellation
  const handleCancel = () => {
    if (content.trim().length > 0) {
      if (!window.confirm("Are you sure you want to cancel? All your progress will be lost.")) {
        return;
      }
    }
    
    cancelChallenge();
    
    toast({
      title: "Challenge cancelled",
      description: "You can start a new challenge anytime.",
      variant: "default"
    });
  };
  
  // Handle saving to a project
  const handleSaveToProject = () => {
    // This functionality will be implemented in Phase 4
    toast({
      title: "Coming Soon!",
      description: "This feature will be available in a future update.",
    });
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate time progress percentage for timed challenges
  const getTimeProgress = (): number => {
    if (!activeChallenge.duration) return 0;
    return (elapsedTime / activeChallenge.duration) * 100;
  };
  
  if (isComplete) {
    return <ChallengeCompletion content={content} wordCount={wordCount} />;
  }
  
  return (
    <div className="py-8 px-4 md:px-6 w-full animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Exit Challenge
            </Button>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold">{activeChallenge.title}</h1>
        </header>
        
        {/* Challenge instructions */}
        <ChallengeInstructions challenge={activeChallenge} />
        
        {/* Timer for timed challenges */}
        {activeChallenge.duration && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(elapsedTime)} / {formatTime(activeChallenge.duration)}
              </span>
              <span>
                {Math.floor((activeChallenge.duration - elapsedTime) / 60)}:{((activeChallenge.duration - elapsedTime) % 60).toString().padStart(2, '0')} remaining
              </span>
            </div>
            <Progress value={getTimeProgress()} className="h-2" />
          </div>
        )}
        
        {/* Editor */}
        <div className="mb-6">
          <Textarea 
            placeholder="Start writing here..."
            className="w-full h-80 p-4 resize-none font-mono text-base"
            value={content}
            onChange={handleContentChange}
            autoFocus
          />
          
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{content.length} characters</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <Trash2 className="w-4 h-4 mr-1" />
            Discard
          </Button>
          <Button size="sm" onClick={handleSaveToProject}>
            <Save className="w-4 h-4 mr-1" />
            Save as Project
          </Button>
          <Button 
            className="bg-anime-purple hover:bg-anime-dark-purple"
            size="sm"
            onClick={handleComplete}
          >
            Complete Challenge
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeRunner;
