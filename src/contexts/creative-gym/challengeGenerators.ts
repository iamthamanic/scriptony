
import { v4 as uuidv4 } from 'uuid';
import { Challenge, ChallengeType } from '@/types/creative-gym';

// Generate a random challenge
export const generateChallenge = (type: ChallengeType): Challenge => {
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
export const getRandomPrompts = (): string[] => {
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

export const getRandomStyle = (): string => {
  const styles = [
    'Noir Detective', 'Shakespearean', 'Sci-Fi', 'Western', 
    'Gothic Horror', 'Romance Novel', 'Fantasy Epic', 'Children\'s Story',
    'Cyberpunk', 'Victorian Era', 'Gen Z Slang', 'Fairy Tale',
    'Film Script', 'News Report', 'Poetry'
  ];
  
  return styles[Math.floor(Math.random() * styles.length)];
};

export const getRandomConstraints = (): string[] => {
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

export const getRandomDuration = (): number => {
  const durations = [300, 600, 900, 1200]; // 5, 10, 15, 20 minutes in seconds
  return durations[Math.floor(Math.random() * durations.length)];
};

export const getRemixContent = (): string => {
  const contents = [
    "The old house on the hill stood empty for years. Local children told stories about it being haunted.",
    "As the spaceship approached the unknown planet, the crew prepared for first contact.",
    "The detective examined the crime scene carefully, noting the strange pattern of footprints in the dust.",
    "Once upon a time, in a kingdom far away, a young princess defied tradition by becoming a master blacksmith."
  ];
  
  return contents[Math.floor(Math.random() * contents.length)];
};
