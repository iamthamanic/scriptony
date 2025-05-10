
import React from 'react';
import { UserProgress } from '@/types/creative-gym';

interface HistorySectionProps {
  userProgress: UserProgress;
}

const HistorySection = ({ userProgress }: HistorySectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your History</h2>
      {userProgress.completedChallenges > 0 ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Your completed challenges will appear here.
          </p>
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            You haven't completed any challenges yet.
            Start a challenge to see your history!
          </p>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
