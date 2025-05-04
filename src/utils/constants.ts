
import { Genre, ProjectType, TimeOfDay, EmotionalSignificance } from "../types";

export const projectTypes: ProjectType[] = ['movie', 'series', 'short'];

export const genres: Genre[] = [
  'action',
  'adventure',
  'comedy',
  'drama',
  'fantasy',
  'horror',
  'mystery',
  'romance',
  'sci-fi',
  'slice-of-life',
  'supernatural',
  'thriller'
];

export const timesOfDay: TimeOfDay[] = [
  'morning',
  'day',
  'evening', 
  'night'
];

export const emotionalSignificances: EmotionalSignificance[] = [
  'introduction',
  'buildup',
  'climax',
  'turning-point',
  'resolution',
  'finale',
  'other'
];

export const timeOfDayOptions = timesOfDay.map(time => ({
  value: time,
  label: time.charAt(0).toUpperCase() + time.slice(1)
}));

export const emotionalSignificanceOptions = emotionalSignificances.map(significance => ({
  value: significance,
  label: significance.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}));
