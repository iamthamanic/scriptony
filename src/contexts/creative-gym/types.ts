
import { Challenge, ChallengeResult, UserProgress, TrainingPlan, ChallengeType, DisciplineChallenge, DisciplineType } from '@/types/creative-gym';

// State interface
export interface CreativeGymState {
  challenges: Challenge[];
  disciplineChallenges: DisciplineChallenge[];
  results: ChallengeResult[];
  userProgress: UserProgress;
  trainingPlans: TrainingPlan[];
  activeChallengeId: string | null;
  isLoading: boolean;
}

// Actions
export type CreativeGymAction = 
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'SET_ACTIVE_CHALLENGE'; payload: string | null }
  | { type: 'COMPLETE_CHALLENGE'; payload: { challengeId: string, result: ChallengeResult } }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'SET_TRAINING_PLANS'; payload: TrainingPlan[] }
  | { type: 'ADD_TRAINING_PLAN'; payload: TrainingPlan }
  | { type: 'UPDATE_TRAINING_PLAN'; payload: { id: string, updates: Partial<TrainingPlan> } }
  | { type: 'SET_DISCIPLINE_CHALLENGES'; payload: DisciplineChallenge[] }
  | { type: 'ADD_DISCIPLINE_CHALLENGE'; payload: DisciplineChallenge }
  | { type: 'COMPLETE_DISCIPLINE_CHALLENGE'; payload: { challengeId: string, content?: string, attachments?: string[] } }
  | { type: 'SET_LOADING'; payload: boolean };

// Context interface
export interface CreativeGymContextType extends CreativeGymState {
  startChallenge: (type: ChallengeType) => void;
  completeChallenge: (content: string) => void;
  cancelChallenge: () => void;
  createTrainingPlan: (plan: Omit<TrainingPlan, 'id'>) => void;
  startDisciplineChallenge: (disciplineType: DisciplineType, challengeId: string) => void;
  completeDisciplineChallenge: (challengeId: string, content?: string, attachments?: string[]) => void;
}

// Initial state
export const initialUserProgress: UserProgress = {
  level: 1,
  xp: 0,
  totalChallenges: 0,
  completedChallenges: 0,
  streak: 0,
  achievements: [],
  personalRecords: {},
  completedDisciplines: {
    'comedy': 0,
    'songwriting': 0,
    'visual-arts': 0,
    'photography': 0,
    'filmmaking': 0
  }
};

export const initialState: CreativeGymState = {
  challenges: [],
  disciplineChallenges: [],
  results: [],
  userProgress: initialUserProgress,
  trainingPlans: [],
  activeChallengeId: null,
  isLoading: false
};
