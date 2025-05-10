
import React from 'react';
import DisciplinesList from '../disciplines/DisciplinesList';
import DisciplineChallenges from '../disciplines/DisciplineChallenges';
import { DisciplineType } from '@/types/creative-gym';

interface ArtFormsTabProps {
  selectedDiscipline: string | null;
  onSelectDiscipline: (discipline: DisciplineType | null) => void;
}

const ArtFormsTab = ({ selectedDiscipline, onSelectDiscipline }: ArtFormsTabProps) => {
  const handleBackFromDiscipline = () => {
    onSelectDiscipline(null);
  };

  return (
    <>
      {!selectedDiscipline ? (
        <DisciplinesList onSelectDiscipline={onSelectDiscipline} />
      ) : (
        <DisciplineChallenges 
          disciplineType={selectedDiscipline as DisciplineType} 
          onBack={handleBackFromDiscipline} 
        />
      )}
    </>
  );
};

export default ArtFormsTab;
