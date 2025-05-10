
import React from 'react';
import { useCreativeGym } from '@/features/creative-gym/hooks/useCreativeGym';

const ChallengeRunner = () => {
  const { 
    challenges, 
    activeChallengeId, 
    completeChallenge, 
    cancelChallenge 
  } = useCreativeGym();
  
  const activeChallenge = challenges.find(c => c.id === activeChallengeId);
  
  // Placeholder function for challenge completion
  const handleComplete = (content: string) => {
    completeChallenge(content);
  };
  
  if (!activeChallenge) {
    return null;
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{activeChallenge.title}</h1>
      <p className="mb-6">{activeChallenge.description}</p>
      
      {/* Challenge UI will vary based on challenge type */}
      <div className="border rounded-lg p-6 mb-6">
        <textarea 
          className="w-full h-64 p-4 border rounded-lg mb-4"
          placeholder="Start writing here..."
        />
        
        <div className="flex justify-between">
          <button
            onClick={() => cancelChallenge()}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => handleComplete("Example content")}
            className="px-4 py-2 bg-anime-purple text-white rounded-md"
          >
            Complete Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeRunner;
