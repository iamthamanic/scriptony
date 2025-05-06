import { ProjectType, Genre, TimeOfDay, EmotionalSignificance, VideoFormat } from "../types";
import { projectTypes, genres, timesOfDay, emotionalSignificances, videoFormats } from "./constants";
import { NarrativeStructureType } from "@/types";

export const projectTypeOptions = projectTypes.map((type) => {
  let label: string;
  switch(type) {
    case 'movie': label = 'Film'; break;
    case 'series': label = 'Serie'; break;
    case 'short': label = 'Kurzfilm'; break;
    case 'theaterstück': label = 'Theaterstück'; break;
    case 'hörspiel': label = 'Hörspiel'; break;
    case 'buch': label = 'Buch'; break;
    case 'social_video': label = 'Social Media Video'; break;
    default: label = type as string; // Cast to string
  }
  
  if (typeof label === 'string') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }
  
  return { value: type, label };
});

export const videoFormatOptions = videoFormats.map((format) => {
  let label: string;
  switch(format) {
    case 'shortform': label = 'Kurzform (TikTok, Reels, Shorts)'; break;
    case 'longform': label = 'Langform (YouTube)'; break;
    default: label = format as string; // Cast to string
  }
  
  if (typeof label === 'string') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }
  
  return { value: format, label };
});

export const genreOptions = genres.map((genre) => {
  let label: string;
  switch(genre) {
    case 'action': label = 'Action'; break;
    case 'adventure': label = 'Abenteuer'; break;
    case 'comedy': label = 'Komödie'; break;
    case 'drama': label = 'Drama'; break;
    case 'fantasy': label = 'Fantasy'; break;
    case 'horror': label = 'Horror'; break;
    case 'mystery': label = 'Mystery'; break;
    case 'romance': label = 'Romantik'; break;
    case 'sci-fi': label = 'Science Fiction'; break;
    case 'slice-of-life': label = 'Slice of Life'; break;
    case 'supernatural': label = 'Übernatürlich'; break;
    case 'thriller': label = 'Thriller'; break;
    default: label = genre as string; // Cast to string
  }
  
  if (typeof label === 'string') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  }
  
  return { value: genre, label };
});

export const timeOfDayOptions = timesOfDay.map(time => ({
  value: time,
  label: time.charAt(0).toUpperCase() + time.slice(1)
}));

export const emotionalSignificanceOptions = emotionalSignificances.map(significance => ({
  value: significance,
  label: significance.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}));

// Helper function to generate random genres
export const getRandomGenres = (count: number): Genre[] => {
  const shuffled = [...genres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get a random entry from an array
export const getRandomEntry = <T>(array: T[]): T | undefined => {
  if (!array || array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const generateDefaultSceneForTemplate = (structureType: NarrativeStructureType) => {
  // Basic scene template
  const sceneTemplates = [
    {
      location: 'INT. MAIN LOCATION',
      timeOfDay: 'day',
      visualComposition: 'Medium shot',
      lighting: 'Natural lighting',
      colorGrading: 'Neutral',
      soundDesign: 'Ambient sounds',
      specialEffects: 'None',
      description: 'Opening scene description.',
      dialog: 'Character dialog goes here.',
      transitions: 'CUT TO:',
      productionNotes: 'Setup the story world.',
      emotionalSignificance: 'introduction'
    }
  ];
  
  return sceneTemplates;
};
