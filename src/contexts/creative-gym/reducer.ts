
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
    case 'SET_DISCIPLINE_CHALLENGES':
      return { ...state, disciplineChallenges: action.payload };
    case 'ADD_DISCIPLINE_CHALLENGE':
      return { ...state, disciplineChallenges: [...state.disciplineChallenges, action.payload] };
    case 'COMPLETE_DISCIPLINE_CHALLENGE': {
      const updatedDisciplineChallenges = state.disciplineChallenges.map(challenge =>
        challenge.id === action.payload.challengeId
          ? { 
              ...challenge, 
              completedAt: new Date(),
              userContent: action.payload.content,
              userAttachments: action.payload.attachments 
            }
          : challenge
      );
      
      // Find the completed challenge to get its discipline type
      const completedChallenge = state.disciplineChallenges.find(
        challenge => challenge.id === action.payload.challengeId
      );
      
      if (completedChallenge) {
        const disciplineType = completedChallenge.disciplineType;
        const currentCount = state.userProgress.completedDisciplines?.[disciplineType] || 0;
        
        // Update the completed disciplines count
        const updatedCompletedDisciplines = {
          ...state.userProgress.completedDisciplines,
          [disciplineType]: currentCount + 1
        };
        
        return {
          ...state,
          disciplineChallenges: updatedDisciplineChallenges,
          userProgress: {
            ...state.userProgress,
            completedDisciplines: updatedCompletedDisciplines,
            completedChallenges: state.userProgress.completedChallenges + 1,
            totalChallenges: state.userProgress.totalChallenges + 1,
            xp: state.userProgress.xp + 15 // Base XP for discipline challenges
          }
        };
      }
      
      return {
        ...state,
        disciplineChallenges: updatedDisciplineChallenges
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}
