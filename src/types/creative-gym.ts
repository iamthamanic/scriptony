
export type ChallengeType = 'prompt-forge' | 'style-lock' | 'constraint-bench' | 'time-puncher' | 'remix-mode';

export interface Challenge {
  id: string;
  title: string;
  type: ChallengeType;
  description: string;
  duration?: number; // In seconds, optional for non-timed challenges
  constraints?: string[];
  prompts?: string[];
  style?: string;
  remixContent?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ChallengeResult {
  id: string;
  challengeId: string;
  content: string;
  wordCount: number;
  duration: number; // In seconds
  completedAt: Date;
  xpEarned: number;
  achievements: string[];
}

export interface UserProgress {
  level: number;
  xp: number;
  totalChallenges: number;
  completedChallenges: number;
  streak: number; // Days in a row with completed challenges
  achievements: Achievement[];
  personalRecords: Record<string, number>; // e.g. {"fastest-completion": 120, "longest-streak": 7}
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  challenges: PlannedChallenge[];
  startDate: Date;
  endDate?: Date;
  active: boolean;
}

export interface PlannedChallenge {
  challengeTemplate: Partial<Challenge>;
  scheduledFor: Date;
  completed: boolean;
}
