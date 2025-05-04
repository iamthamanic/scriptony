
import { Genre, ProjectType, TimeOfDay, EmotionalSignificance, VideoFormat } from "../types";

export const projectTypes: ProjectType[] = [
  'movie', 
  'series', 
  'short', 
  'theaterstück', 
  'hörspiel', 
  'buch', 
  'social_video'
];

export const videoFormats: VideoFormat[] = ['shortform', 'longform'];

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

export const projectTypeOptions = projectTypes.map(type => {
  let label;
  switch(type) {
    case 'movie': label = 'Film'; break;
    case 'series': label = 'Serie'; break;
    case 'short': label = 'Kurzfilm'; break;
    case 'theaterstück': label = 'Theaterstück'; break;
    case 'hörspiel': label = 'Hörspiel'; break;
    case 'buch': label = 'Buch'; break;
    case 'social_video': label = 'Social Media Video'; break;
    default: label = type.charAt(0).toUpperCase() + type.slice(1);
  }
  return { value: type, label };
});

export const videoFormatOptions = videoFormats.map(format => {
  let label;
  switch(format) {
    case 'shortform': label = 'Kurzform (TikTok, Reels, Shorts)'; break;
    case 'longform': label = 'Langform (YouTube)'; break;
    default: label = format.charAt(0).toUpperCase() + format.slice(1);
  }
  return { value: format, label };
});
