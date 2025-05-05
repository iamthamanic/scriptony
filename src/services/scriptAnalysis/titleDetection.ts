
import nlp from 'compromise';

/**
 * Try to detect the title from script content
 */
export function detectScriptTitle(lines: string[]): string {
  // Try to detect the title (often at the beginning of the script)
  const potentialTitles = lines.slice(0, 20).filter(line => 
    line.match(/^[\s\t]*[A-Z][A-Z\s]+$/) && 
    !line.match(/^(INT|EXT|INT\/EXT|INT\.\/EXT\.|INT\s*?[.-]\s*?EXT|SCENE)\b/i)
  );
  
  if (potentialTitles.length > 0) {
    return potentialTitles[0].trim();
  } else {
    // Fallback title based on content
    const joinedText = lines.slice(0, 100).join(' ');
    const doc = nlp(joinedText.substring(0, 5000));
    const nouns = doc.nouns().out('array');
    return nouns.length > 0 
      ? `${nouns[0]} ${nouns.length > 1 ? nouns[1] : ''}`.trim() 
      : 'Untitled Script';
  }
}
