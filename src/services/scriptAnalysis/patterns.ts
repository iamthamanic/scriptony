
// Script format patterns used for analysis
export const SCENE_HEADER_PATTERN = /^(INT|EXT|INT\/EXT|INT\.\/EXT\.|INT\s*?[.-]\s*?EXT|SCENE)\b.*?$/i;
export const CHARACTER_NAME_PATTERN = /^[A-Z][A-Z\s\d.,'\-!?()]*(?:\(.*?\))?$/;
export const SHOT_PATTERN = /^(WIDE SHOT|MEDIUM SHOT|CLOSE UP|CU|MS|WS|ECU|EXTREME CLOSE UP|POV)/i;

// Genre keyword definitions for content analysis
export const GENRE_KEYWORDS = {
  'action': ['fight', 'explosion', 'chase', 'gun', 'weapon', 'battle'],
  'adventure': ['journey', 'exploration', 'quest', 'discover', 'expedition'],
  'comedy': ['laugh', 'joke', 'funny', 'humor', 'hilarious', 'comedy'],
  'drama': ['emotional', 'conflict', 'relationship', 'struggle', 'tension'],
  'fantasy': ['magic', 'dragon', 'spell', 'wizard', 'enchant', 'mythical'],
  'horror': ['fear', 'terrify', 'scream', 'monster', 'ghost', 'blood'],
  'mystery': ['clue', 'suspect', 'detective', 'mystery', 'solve', 'secret'],
  'romance': ['love', 'kiss', 'romantic', 'relationship', 'date', 'passion'],
  'sci-fi': ['technology', 'space', 'alien', 'future', 'robot', 'science'],
  'thriller': ['suspense', 'danger', 'threat', 'tension', 'killer', 'chase']
};
