import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Challenge,
  ChallengeResult,
  UserProgress,
  TrainingPlan,
  ChallengeType
} from '@/types/creative-gym';

// Initial state
interface CreativeGymState {
  challenges: Challenge[];
  results: ChallengeResult[];
  userProgress: UserProgress;
  trainingPlans: TrainingPlan[];
  activeChallengeId: string | null;
  isLoading: boolean;
}

const initialUserProgress: UserProgress = {
  level: 1,
  xp: 0,
  totalChallenges: 0,
  completedChallenges: 0,
  streak: 0,
  achievements: [],
  personalRecords: {}
};

const initialState: CreativeGymState = {
  challenges: [],
  results: [],
  userProgress: initialUserProgress,
  trainingPlans: [],
  activeChallengeId: null,
  isLoading: false
};

// Actions
type Action = 
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'SET_ACTIVE_CHALLENGE'; payload: string | null }
  | { type: 'COMPLETE_CHALLENGE'; payload: { challengeId: string, result: ChallengeResult } }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'SET_TRAINING_PLANS'; payload: TrainingPlan[] }
  | { type: 'ADD_TRAINING_PLAN'; payload: TrainingPlan }
  | { type: 'UPDATE_TRAINING_PLAN'; payload: { id: string, updates: Partial<TrainingPlan> } }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
function creativeGymReducer(state: CreativeGymState, action: Action): CreativeGymState {
  switch (action.type) {
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'ADD_CHALLENGE':
      return { ...state, challenges: [...state.challenges, action.payload] };
    case 'SET_ACTIVE_CHALLENGE':
      return { ...state, activeChallengeId: action.payload };
    case 'COMPLETE_CHALLENGE': {
      const updatedChallenges = state.challenges.map(challenge =>
        challenge.id === action.payload.challengeId
          ? { ...challenge, completedAt: new Date() }
          : challenge
      );
      return {
        ...state,
        challenges: updatedChallenges,
        results: [...state.results, action.payload.result],
        activeChallengeId: null
      };
    }
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: { ...state.userProgress, ...action.payload }
      };
    case 'SET_TRAINING_PLANS':
      return { ...state, trainingPlans: action.payload };
    case 'ADD_TRAINING_PLAN':
      return { ...state, trainingPlans: [...state.trainingPlans, action.payload] };
    case 'UPDATE_TRAINING_PLAN': {
      const updatedPlans = state.trainingPlans.map(plan =>
        plan.id === action.payload.id
          ? { ...plan, ...action.payload.updates }
          : plan
      );
      return { ...state, trainingPlans: updatedPlans };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// Context
interface CreativeGymContextType extends CreativeGymState {
  startChallenge: (type: ChallengeType) => void;
  completeChallenge: (content: string) => void;
  cancelChallenge: () => void;
  createTrainingPlan: (plan: Omit<TrainingPlan, 'id'>) => void;
}

const CreativeGymContext = createContext<CreativeGymContextType | undefined>(undefined);

// Provider component
export function CreativeGymProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(creativeGymReducer, initialState);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const loadState = () => {
      try {
        const savedState = localStorage.getItem('creativeGymState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          
          // Convert string dates back to Date objects
          const challenges = parsedState.challenges.map((challenge: any) => ({
            ...challenge,
            createdAt: new Date(challenge.createdAt),
            completedAt: challenge.completedAt ? new Date(challenge.completedAt) : undefined
          }));
          
          const results = parsedState.results.map((result: any) => ({
            ...result,
            completedAt: new Date(result.completedAt)
          }));
          
          const achievements = parsedState.userProgress?.achievements?.map((achievement: any) => ({
            ...achievement,
            earnedAt: new Date(achievement.earnedAt)
          })) || [];
          
          const trainingPlans = parsedState.trainingPlans?.map((plan: any) => ({
            ...plan,
            startDate: new Date(plan.startDate),
            endDate: plan.endDate ? new Date(plan.endDate) : undefined,
            challenges: plan.challenges.map((challenge: any) => ({
              ...challenge,
              scheduledFor: new Date(challenge.scheduledFor)
            }))
          })) || [];
          
          dispatch({ type: 'SET_CHALLENGES', payload: challenges });
          dispatch({ 
            type: 'UPDATE_PROGRESS', 
            payload: {
              ...parsedState.userProgress,
              achievements
            } 
          });
          dispatch({ type: 'SET_TRAINING_PLANS', payload: trainingPlans });
        }
      } catch (error) {
        console.error('Error loading Creative Gym state from localStorage:', error);
      }
    };
    
    loadState();
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('creativeGymState', JSON.stringify({
      challenges: state.challenges,
      results: state.results,
      userProgress: state.userProgress,
      trainingPlans: state.trainingPlans
    }));
  }, [state.challenges, state.results, state.userProgress, state.trainingPlans]);
  
  // Generate a random challenge
  const generateChallenge = (type: ChallengeType): Challenge => {
    const newChallenge: Challenge = {
      id: uuidv4(),
      title: `New ${type.split('-').join(' ')} Challenge`,
      type,
      description: '',
      createdAt: new Date()
    };
    
    switch (type) {
      case 'prompt-forge':
        const prompts = getRandomPrompts();
        newChallenge.title = `Forge a Scene with: ${prompts.join(', ')}`;
        newChallenge.description = `Create a compelling scene using these words: ${prompts.join(', ')}`;
        newChallenge.prompts = prompts;
        break;
      case 'style-lock':
        const style = getRandomStyle();
        newChallenge.title = `Write in ${style} Style`;
        newChallenge.description = `Create content mimicking the style of ${style}`;
        newChallenge.style = style;
        break;
      case 'constraint-bench':
        const constraints = getRandomConstraints();
        newChallenge.title = `Write with Constraints: ${constraints[0]}`;
        newChallenge.description = `Write a scene while following these constraints: ${constraints.join(', ')}`;
        newChallenge.constraints = constraints;
        break;
      case 'time-puncher':
        const duration = getRandomDuration();
        newChallenge.title = `${duration / 60}-Minute Speed Challenge`;
        newChallenge.description = `Write as much as you can in ${duration / 60} minutes`;
        newChallenge.duration = duration;
        break;
      case 'remix-mode':
        const remixContent = getRemixContent();
        newChallenge.title = 'Remix This Content';
        newChallenge.description = 'Transform the provided content into something new and creative';
        newChallenge.remixContent = remixContent;
        break;
    }
    
    return newChallenge;
  };
  
  // Helper functions for generating random challenges
  const getRandomPrompts = (): string[] => {
    const wordPool = [
      'shadow', 'echo', 'whisper', 'dream', 'mirror', 'clock', 'memory',
      'storm', 'silence', 'secret', 'door', 'key', 'letter', 'ocean',
      'mountain', 'flower', 'bird', 'tree', 'fire', 'star', 'moon'
    ];
    
    const count = Math.floor(Math.random() * 2) + 2; // 2-3 prompts
    const prompts = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * wordPool.length);
      prompts.push(wordPool[randomIndex]);
      wordPool.splice(randomIndex, 1); // Remove the selected word
    }
    
    return prompts;
  };
  
  const getRandomStyle = (): string => {
    const styles = [
      'Noir Detective', 'Shakespearean', 'Sci-Fi', 'Western', 
      'Gothic Horror', 'Romance Novel', 'Fantasy Epic', 'Children\'s Story',
      'Cyberpunk', 'Victorian Era', 'Gen Z Slang', 'Fairy Tale',
      'Film Script', 'News Report', 'Poetry'
    ];
    
    return styles[Math.floor(Math.random() * styles.length)];
  };
  
  const getRandomConstraints = (): string[] => {
    const constraints = [
      'No adjectives', 'Maximum 100 words', 'Only dialogue', 'Every sentence must be a question',
      'No use of the letter "e"', 'Each sentence must start with a different letter',
      'Include exactly three similes', 'Use only present tense', 'No names for characters'
    ];
    
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 constraints
    const selectedConstraints = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * constraints.length);
      selectedConstraints.push(constraints[randomIndex]);
      constraints.splice(randomIndex, 1); // Remove the selected constraint
    }
    
    return selectedConstraints;
  };
  
  const getRandomDuration = (): number => {
    const durations = [300, 600, 900, 1200]; // 5, 10, 15, 20 minutes in seconds
    return durations[Math.floor(Math.random() * durations.length)];
  };
  
  const getRemixContent = (): string => {
    const contents = [
      "The old house on the hill stood empty for years. Local children told stories about it being haunted.",
      "As the spaceship approached the unknown planet, the crew prepared for first contact.",
      "The detective examined the crime scene carefully, noting the strange pattern of footprints in the dust.",
      "Once upon a time, in a kingdom far away, a young princess defied tradition by becoming a master blacksmith."
    ];
    
    return contents[Math.floor(Math.random() * contents.length)];
  };
  
  // Context functions
  const startChallenge = (type: ChallengeType) => {
    const newChallenge = generateChallenge(type);
    dispatch({ type: 'ADD_CHALLENGE', payload: newChallenge });
    dispatch({ type: 'SET_ACTIVE_CHALLENGE', payload: newChallenge.id });
  };
  
  const completeChallenge = (content: string) => {
    if (!state.activeChallengeId) return;
    
    const challenge = state.challenges.find(c => c.id === state.activeChallengeId);
    if (!challenge) return;
    
    const wordCount = content.split(/\s+/).length;
    const startTime = challenge.createdAt;
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // Duration in seconds
    
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
    
    // Create result
    const result: ChallengeResult = {
      id: uuidv4(),
      challengeId: state.activeChallengeId,
      content,
      wordCount,
      duration,
      completedAt: endTime,
      xpEarned,
      achievements
    };
    
    // Update state
    dispatch({ 
      type: 'COMPLETE_CHALLENGE', 
      payload: { challengeId: state.activeChallengeId, result } 
    });
    
    // Update user progress
    const newTotalXP = state.userProgress.xp + xpEarned;
    const newLevel = Math.floor(newTotalXP / 100) + 1; // Level up every 100 XP
    
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        level: newLevel,
        xp: newTotalXP,
        completedChallenges: state.userProgress.completedChallenges + 1,
        totalChallenges: state.userProgress.totalChallenges + 1
      }
    });
  };
  
  const cancelChallenge = () => {
    dispatch({ type: 'SET_ACTIVE_CHALLENGE', payload: null });
  };
  
  const createTrainingPlan = (plan: Omit<TrainingPlan, 'id'>) => {
    const newPlan: TrainingPlan = {
      ...plan,
      id: uuidv4()
    };
    
    dispatch({ type: 'ADD_TRAINING_PLAN', payload: newPlan });
  };
  
  return (
    <CreativeGymContext.Provider
      value={{
        ...state,
        startChallenge,
        completeChallenge,
        cancelChallenge,
        createTrainingPlan
      }}
    >
      {children}
    </CreativeGymContext.Provider>
  );
}

// Custom hook for using the Creative Gym context
export function useCreativeGym() {
  const context = useContext(CreativeGymContext);
  if (context === undefined) {
    throw new Error('useCreativeGym must be used within a CreativeGymProvider');
  }
  return context;
}
