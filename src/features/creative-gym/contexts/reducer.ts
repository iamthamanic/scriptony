
import { CreativeGymState, CreativeGymAction } from './types';

export const creativeGymReducer = (
  state: CreativeGymState,
  action: CreativeGymAction
): CreativeGymState => {
  switch (action.type) {
    case 'SET_CHALLENGES':
      return {
        ...state,
        challenges: action.payload
      };
    
    case 'ADD_CHALLENGE':
      return {
        ...state,
        challenges: [...state.challenges, action.payload]
      };
    
    case 'SET_ACTIVE_CHALLENGE':
      return {
        ...state,
        activeChallengeId: action.payload
      };
    
    case 'COMPLETE_CHALLENGE': {
      const { challengeId, result } = action.payload;
      
      // Update the challenge
      const updatedChallenges = state.challenges.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            completedAt: new Date()
          };
        }
        return challenge;
      });
      
      // Add the result
      const updatedResults = [...state.results, result];
      
      return {
        ...state,
        challenges: updatedChallenges,
        results: updatedResults,
        activeChallengeId: null
      };
    }
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          ...action.payload
        }
      };
    
    case 'SET_TRAINING_PLANS':
      return {
        ...state,
        trainingPlans: action.payload
      };
    
    case 'ADD_TRAINING_PLAN':
      return {
        ...state,
        trainingPlans: [...state.trainingPlans, action.payload]
      };
    
    case 'UPDATE_TRAINING_PLAN': {
      const { id, updates } = action.payload;
      
      const updatedPlans = state.trainingPlans.map(plan => {
        if (plan.id === id) {
          return {
            ...plan,
            ...updates
          };
        }
        return plan;
      });
      
      return {
        ...state,
        trainingPlans: updatedPlans
      };
    }
    
    case 'SET_DISCIPLINE_CHALLENGES':
      return {
        ...state,
        disciplineChallenges: action.payload
      };
    
    case 'ADD_DISCIPLINE_CHALLENGE':
      return {
        ...state,
        disciplineChallenges: [...state.disciplineChallenges, action.payload]
      };
    
    case 'COMPLETE_DISCIPLINE_CHALLENGE': {
      const { challengeId, content, attachments } = action.payload;
      
      const updatedChallenges = state.disciplineChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            completedAt: new Date(),
            userContent: content,
            userAttachments: attachments
          };
        }
        return challenge;
      });
      
      return {
        ...state,
        disciplineChallenges: updatedChallenges
      };
    }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};
