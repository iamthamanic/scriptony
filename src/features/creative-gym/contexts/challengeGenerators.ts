
import { v4 as uuidv4 } from 'uuid';
import { Challenge, ChallengeType } from '@/types/creative-gym';

// Sample writing prompts
const writingPrompts = [
  'A character finds a mysterious key',
  'Two strangers meet in an elevator during a power outage',
  'A letter arrives 50 years too late',
  'Someone discovers they can suddenly understand animal language',
  'A famous painting comes to life at night'
];

// Sample writing styles
const writingStyles = [
  'Shakespearean dialogue',
  'Film noir narration',
  'Modern texting language',
  'Victorian era formal prose',
  'Stream of consciousness'
];

// Sample constraints
const writingConstraints = [
  'No words containing the letter E',
  'Every sentence must be exactly 7 words',
  'Include at least 10 color descriptions',
  'Write only using dialogue',
  'Every paragraph must begin with the same letter'
];

// Sample content for remixing
const remixContent = [
  'It was a dark and stormy night. The wind howled through the trees as Mary approached the abandoned house.',
  'Dear Sir, I regret to inform you that your application has been denied due to insufficient qualifications.',
  'The CEO announced record profits today, sending the company stock soaring to new heights.'
];

export const generateChallenge = (type: ChallengeType): Challenge => {
  const now = new Date();
  const baseChallenge = {
    id: uuidv4(),
    type,
    createdAt: now
  };
  
  switch (type) {
    case 'prompt-forge': {
      const prompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
      return {
        ...baseChallenge,
        title: 'Prompt Forge Challenge',
        description: 'Create a compelling scene based on this prompt:',
        prompts: [prompt]
      };
    }
    
    case 'style-lock': {
      const style = writingStyles[Math.floor(Math.random() * writingStyles.length)];
      return {
        ...baseChallenge,
        title: 'Style Lock Challenge',
        description: `Write a short passage in the following style: ${style}`,
        style
      };
    }
    
    case 'constraint-bench': {
      const constraintsCount = 1 + Math.floor(Math.random() * 2); // 1-2 constraints
      const selectedConstraints = [];
      const availableConstraints = [...writingConstraints];
      
      for (let i = 0; i < constraintsCount; i++) {
        if (availableConstraints.length === 0) break;
        
        const index = Math.floor(Math.random() * availableConstraints.length);
        selectedConstraints.push(availableConstraints[index]);
        availableConstraints.splice(index, 1);
      }
      
      return {
        ...baseChallenge,
        title: 'Constraint Bench Challenge',
        description: 'Write a passage following these constraints:',
        constraints: selectedConstraints
      };
    }
    
    case 'time-puncher': {
      // Random time between 3-5 minutes (180-300 seconds)
      const duration = 180 + Math.floor(Math.random() * 120);
      
      return {
        ...baseChallenge,
        title: 'Time Puncher Challenge',
        description: `You have ${Math.floor(duration / 60)} minutes to write as much quality content as you can.`,
        duration
      };
    }
    
    case 'remix-mode': {
      const content = remixContent[Math.floor(Math.random() * remixContent.length)];
      
      return {
        ...baseChallenge,
        title: 'Remix Mode Challenge',
        description: 'Transform this content into something completely different:',
        remixContent: content
      };
    }
    
    default:
      return {
        ...baseChallenge,
        title: 'Writing Challenge',
        description: 'Complete this writing challenge to earn XP.'
      };
  }
};
