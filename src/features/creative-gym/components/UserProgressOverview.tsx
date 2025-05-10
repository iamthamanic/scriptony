
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock } from 'lucide-react';
import { UserProgress } from '@/types/creative-gym';

interface UserProgressOverviewProps {
  userProgress: UserProgress;
}

const UserProgressOverview = ({ userProgress }: UserProgressOverviewProps) => {
  // Progress calculation
  const progressToNextLevel = userProgress.xp % 100;
  const percentToNextLevel = (progressToNextLevel / 100) * 100;
  
  return (
    <div className="mb-8 bg-muted/50 rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Level {userProgress.level}</h2>
          <p className="text-muted-foreground">
            {userProgress.completedChallenges} challenges completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            {userProgress.xp} XP
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {userProgress.streak} day streak
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>{progressToNextLevel} / 100 XP</span>
          <span>Level {userProgress.level + 1}</span>
        </div>
        <Progress value={percentToNextLevel} className="h-2" />
      </div>
    </div>
  );
};

export default UserProgressOverview;
