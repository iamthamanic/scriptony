
import { CreativeGymPage } from '@/features/creative-gym';
import { CreativeGymProvider } from '@/features/creative-gym/contexts/CreativeGymContext';

const CreativeGymRoute = () => {
  return (
    <CreativeGymProvider>
      <CreativeGymPage />
    </CreativeGymProvider>
  );
};

export default CreativeGymRoute;
