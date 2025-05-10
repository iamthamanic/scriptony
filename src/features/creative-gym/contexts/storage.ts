
import { CreativeGymState } from './types';

export const saveStateToLocalStorage = (state: Partial<CreativeGymState>) => {
  try {
    localStorage.setItem('creativeGymState', JSON.stringify({
      challenges: state.challenges,
      results: state.results,
      userProgress: state.userProgress,
      trainingPlans: state.trainingPlans,
      disciplineChallenges: state.disciplineChallenges
    }));
  } catch (error) {
    console.error('Error saving Creative Gym state to localStorage:', error);
  }
};

export const loadStateFromLocalStorage = (): Partial<CreativeGymState> | null => {
  try {
    const savedState = localStorage.getItem('creativeGymState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      
      // Convert string dates back to Date objects
      const challenges = parsedState.challenges?.map((challenge: any) => ({
        ...challenge,
        createdAt: new Date(challenge.createdAt),
        completedAt: challenge.completedAt ? new Date(challenge.completedAt) : undefined
      })) || [];
      
      const results = parsedState.results?.map((result: any) => ({
        ...result,
        completedAt: new Date(result.completedAt)
      })) || [];
      
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

      const disciplineChallenges = parsedState.disciplineChallenges?.map((challenge: any) => ({
        ...challenge,
        createdAt: new Date(challenge.createdAt),
        completedAt: challenge.completedAt ? new Date(challenge.completedAt) : undefined
      })) || [];
      
      return {
        challenges,
        results,
        disciplineChallenges,
        userProgress: parsedState.userProgress ? {
          ...parsedState.userProgress,
          achievements
        } : undefined,
        trainingPlans
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading Creative Gym state from localStorage:', error);
    return null;
  }
};
