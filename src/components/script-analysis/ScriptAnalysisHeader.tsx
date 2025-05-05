
import React from 'react';
import { FilmIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProjectType, Genre } from '@/types';
import { AnalysisResult } from '@/types';

// Project type display labels
const projectTypeLabels: Record<ProjectType, string> = {
  'movie': 'Film',
  'series': 'TV Series',
  'short': 'Short Film',
  'theaterstück': 'Theater Play',
  'hörspiel': 'Audio Drama',
  'buch': 'Book',
  'social_video': 'Social Video'
};

// Genre display labels
const genreLabels: Record<Genre, string> = {
  'action': 'Action',
  'adventure': 'Adventure',
  'comedy': 'Comedy',
  'drama': 'Drama',
  'fantasy': 'Fantasy',
  'horror': 'Horror',
  'mystery': 'Mystery',
  'romance': 'Romance',
  'sci-fi': 'Sci-Fi',
  'slice-of-life': 'Slice of Life',
  'supernatural': 'Supernatural',
  'thriller': 'Thriller'
};

interface ScriptAnalysisHeaderProps {
  analysisResult: AnalysisResult;
}

const ScriptAnalysisHeader = ({ analysisResult }: ScriptAnalysisHeaderProps) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{analysisResult.title || 'Untitled Script'}</h3>
          <div className="flex items-center mt-1">
            <FilmIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{projectTypeLabels[analysisResult.type] || analysisResult.type}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          {analysisResult.genres.map(genre => (
            <Badge key={genre} variant="secondary">{genreLabels[genre] || genre}</Badge>
          ))}
        </div>
      </div>
      <Separator />
    </>
  );
};

export { ScriptAnalysisHeader, projectTypeLabels, genreLabels };
