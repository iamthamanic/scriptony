
import { CreativeGymState, CreativeGymAction } from './types';

// Reducer
export function creativeGymReducer(state: CreativeGymState, action: CreativeGymAction): CreativeGymState {
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
