
import { useContext } from 'react';
import { CreativeGymContext } from '@/features/creative-gym/contexts/CreativeGymContext';

export function useCreativeGym() {
  const context = useContext(CreativeGymContext);
  if (context === undefined) {
    throw new Error('useCreativeGym must be used within a CreativeGymProvider');
  }
  return context;
}
