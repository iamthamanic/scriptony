
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
