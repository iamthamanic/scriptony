
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChallengeType, TrainingPlan, DisciplineType } from '@/types/creative-gym';
import { 
  CreativeGymContextType, 
  initialState 
} from './types';
import { creativeGymReducer } from './reducer';
import { 
  generateChallenge
} from './challengeGenerators';
import { 
  calculateXpForChallenge, 
  createChallengeResult, 
  updateUserProgress 
} from './challengeCompletion';
import { 
  saveStateToLocalStorage, 
  loadStateFromLocalStorage 
} from './storage';

// Context
const CreativeGymContext = createContext<CreativeGymContextType | undefined>(undefined);

// Provider component
export function CreativeGymProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(creativeGymReducer, initialState);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const loadedState = loadStateFromLocalStorage();
    if (loadedState) {
      if (loadedState.challenges) {
        dispatch({ type: 'SET_CHALLENGES', payload: loadedState.challenges });
      }
      
      if (loadedState.userProgress) {
        dispatch({ type: 'UPDATE_PROGRESS', payload: loadedState.userProgress });
      }
      
      if (loadedState.trainingPlans) {
        dispatch({ type: 'SET_TRAINING_PLANS', payload: loadedState.trainingPlans });
      }

      if (loadedState.disciplineChallenges) {
        dispatch({ type: 'SET_DISCIPLINE_CHALLENGES', payload: loadedState.disciplineChallenges });
      }
    }
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    saveStateToLocalStorage({
      challenges: state.challenges,
      results: state.results,
      userProgress: state.userProgress,
      trainingPlans: state.trainingPlans,
      disciplineChallenges: state.disciplineChallenges
    });
  }, [state.challenges, state.results, state.userProgress, state.trainingPlans, state.disciplineChallenges]);
  
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
    
    // Create the base result
    const baseResult = createChallengeResult(
      state.activeChallengeId,
      content,
      challenge.createdAt
    );
    
    // Calculate XP and achievements
    const { xpEarned, achievements } = calculateXpForChallenge(
      challenge,
      content,
      baseResult.duration
    );
    
    // Create the final result object
    const result = {
      ...baseResult,
      xpEarned,
      achievements
    };
    
    // Update state
    dispatch({ 
      type: 'COMPLETE_CHALLENGE', 
      payload: { challengeId: state.activeChallengeId, result } 
    });
    
    // Update user progress
    const progressUpdates = updateUserProgress(state.userProgress, xpEarned);
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: progressUpdates
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

  // New discipline challenge functions
  const startDisciplineChallenge = (disciplineType: DisciplineType, challengeId: string) => {
    // For future implementation: set active discipline challenge
    console.log(`Starting discipline challenge: ${disciplineType} - ${challengeId}`);
  };

  const completeDisciplineChallenge = (challengeId: string, content?: string, attachments?: string[]) => {
    dispatch({
      type: 'COMPLETE_DISCIPLINE_CHALLENGE',
      payload: { challengeId, content, attachments }
    });
  };
  
  return (
    <CreativeGymContext.Provider
      value={{
        ...state,
        startChallenge,
        completeChallenge,
        cancelChallenge,
        createTrainingPlan,
        startDisciplineChallenge,
        completeDisciplineChallenge
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
