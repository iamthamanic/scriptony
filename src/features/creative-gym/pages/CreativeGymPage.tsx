
import React, { useState, useEffect } from 'react';
import { useCreativeGym } from '@/features/creative-gym/hooks/useCreativeGym';
import { trackPageView } from '@/lib/trackUsage';
import ChallengeRunner from '../components/ChallengeRunner';
import CreativeGymHeader from '../components/CreativeGymHeader';
import UserProgressOverview from '../components/UserProgressOverview';
import ChallengesTab from '../components/tabs/ChallengesTab';
import ArtFormsTab from '../components/tabs/ArtFormsTab';
import TrainingPlansTab from '../components/tabs/TrainingPlansTab';
import AchievementsTab from '../components/tabs/AchievementsTab';
import HistorySection from '../components/HistorySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CreativeGymPage = () => {
  const {
    userProgress,
    activeChallengeId,
    startChallenge,
    completeChallenge
  } = useCreativeGym();
  
  const [selectedTab, setSelectedTab] = useState<string>('challenges');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  
  // If there's an active challenge, show the challenge interface
  if (activeChallengeId) {
    return <ChallengeRunner />;
  }
  
  // Add usage tracking
  useEffect(() => {
    // Track page view
    trackPageView('creative_gym');
  }, []);
  
  return (
    <div className="py-8 px-4 md:px-6 w-full animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <CreativeGymHeader />
        
        {/* User Progress Overview */}
        <UserProgressOverview userProgress={userProgress} />
        
        {/* Main Content Tabs */}
        <Tabs 
          defaultValue="challenges" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="artforms">Art Forms</TabsTrigger>
            <TabsTrigger value="training">Training Plans</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            <ChallengesTab onStartChallenge={startChallenge} />
          </TabsContent>

          {/* Art Forms Tab */}
          <TabsContent value="artforms" className="mt-6">
            <ArtFormsTab 
              selectedDiscipline={selectedDiscipline}
              onSelectDiscipline={setSelectedDiscipline}
            />
          </TabsContent>
          
          {/* Training Plans Tab */}
          <TabsContent value="training" className="mt-6">
            <TrainingPlansTab />
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <AchievementsTab />
          </TabsContent>
        </Tabs>
        
        {/* History Section */}
        <HistorySection userProgress={userProgress} />
      </div>
    </div>
  );
};

export default CreativeGymPage;
