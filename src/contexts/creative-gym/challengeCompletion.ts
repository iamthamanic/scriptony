import { v4 as uuidv4 } from 'uuid';
import { Challenge, ChallengeResult, UserProgress } from '@/types/creative-gym';

export const calculateXpForChallenge = (
  challenge: Challenge, 
  content: string,
  duration: number
): { xpEarned: number, achievements: string[] } => {
  const wordCount = content.split(/\s+/).length;
  
  // Calculate XP based on challenge type and performance
  const baseXP = 10;
  let xpMultiplier = 1;
  
  // Adjust multiplier based on challenge type
  switch (challenge.type) {
    case 'time-puncher':
      if (challenge.duration && duration <= challenge.duration) {
        // Completed within time limit
        xpMultiplier = 1.5;
      }
      break;
    case 'constraint-bench':
      // More constraints, higher multiplier
      xpMultiplier = challenge.constraints ? 1 + (challenge.constraints.length * 0.25) : 1;
      break;
    default:
      // Other challenges get base XP
      xpMultiplier = 1;
  }
  
  // Adjust based on word count
  if (wordCount > 300) xpMultiplier += 0.5;
  
  const xpEarned = Math.floor(baseXP * xpMultiplier);
  
  // Check for achievements
  const achievements: string[] = [];
  if (wordCount > 500) achievements.push('wordsmith');
  if (duration < 300) achievements.push('speed-writer');
  
  return { xpEarned, achievements };
};

export const createChallengeResult = (
  challengeId: string,
  content: string,
  startTime: Date,
  endTime = new Date()
): ChallengeResult => {
  const wordCount = content.split(/\s+/).length;
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // Duration in seconds
  
  // These will be calculated in the context based on the challenge type
  return {
    id: uuidv4(),
    challengeId,
    content,
    wordCount,
    duration,
    completedAt: endTime,
    xpEarned: 0, // Will be set by the context
    achievements: [] // Will be set by the context
  };
};

export const updateUserProgress = (
  currentProgress: UserProgress,
  xpEarned: number
): Partial<UserProgress> => {
  const newTotalXP = currentProgress.xp + xpEarned;
  const newLevel = Math.floor(newTotalXP / 100) + 1; // Level up every 100 XP
  
  return {
    level: newLevel,
    xp: newTotalXP,
    completedChallenges: currentProgress.completedChallenges + 1,
    totalChallenges: currentProgress.totalChallenges + 1
  };
};
