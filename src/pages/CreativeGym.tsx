
import React, { useState } from 'react';
import { useCreativeGym } from '@/contexts/CreativeGymContext';
import { FileText, Dumbbell, Clock, RotateCcw, Zap } from 'lucide-react';
import { WandSparkles as Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChallengeRunner from '@/components/creative-gym/ChallengeRunner';

const CreativeGym = () => {
  const {
    userProgress,
    activeChallengeId,
    startChallenge
  } = useCreativeGym();
  
  const [selectedTab, setSelectedTab] = useState<string>('challenges');
  
  // Progress calculation
  const progressToNextLevel = userProgress.xp % 100;
  const percentToNextLevel = (progressToNextLevel / 100) * 100;
  
  // If there's an active challenge, show the challenge interface
  if (activeChallengeId) {
    return <ChallengeRunner />;
  }
  
  return (
    <div className="py-8 px-4 md:px-6 w-full animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Creative Gym</h1>
          <p className="text-muted-foreground">
            Overcome writer's block and enhance your creative skills with fun, gamified writing exercises
          </p>
        </header>
        
        {/* User Progress Overview */}
        <div className="mb-8 bg-muted/50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold">Level {userProgress.level}</h2>
              <p className="text-muted-foreground">
                {userProgress.completedChallenges} challenges completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                {userProgress.xp} XP
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {userProgress.streak} day streak
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{progressToNextLevel} / 100 XP</span>
              <span>Level {userProgress.level + 1}</span>
            </div>
            <Progress value={percentToNextLevel} className="h-2" />
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs 
          defaultValue="challenges" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="training">Training Plans</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Prompt Forge */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-anime-purple" />
                    Prompt Forge
                  </CardTitle>
                  <CardDescription>
                    Create a scene from random words
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Receive 2-4 random words and forge them into a creative scene or concept.
                    Stretch your imagination and create unexpected connections.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => startChallenge('prompt-forge')}
                    className="w-full bg-anime-purple hover:bg-anime-dark-purple"
                  >
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Style Lock */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Style Lock
                  </CardTitle>
                  <CardDescription>
                    Write in a specific style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Challenge yourself to write in a specific style, from Shakespearean dialog
                    to modern slang. Expand your stylistic range.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => startChallenge('style-lock')}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Constraint Bench */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-green-500" />
                    Constraint Bench
                  </CardTitle>
                  <CardDescription>
                    Write with creative limitations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Push your creativity by writing with specific constraints like
                    word limits, forbidden letters, or structural requirements.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => startChallenge('constraint-bench')}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Time Puncher */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Time Puncher
                  </CardTitle>
                  <CardDescription>
                    Race against the clock
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Write as much quality content as you can within a time limit.
                    Perfect for practicing writing under pressure.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => startChallenge('time-puncher')}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Remix Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    Remix Mode
                  </CardTitle>
                  <CardDescription>
                    Transform existing content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Take provided content and transform it into something completely new.
                    Change perspective, genre, or tone.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => startChallenge('remix-mode')}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Training Plans Tab */}
          <TabsContent value="training" className="mt-6">
            <div className="mb-8 p-6 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-4">Your Training Plan</h3>
              <p className="text-muted-foreground mb-6">
                Create a personalized training plan to systematically improve your creative writing skills.
                Daily or weekly challenges will be generated based on your preferences.
              </p>
              <Button variant="outline">Create Training Plan</Button>
            </div>
            
            <div className="text-center p-12">
              <p className="text-muted-foreground">
                You don't have any active training plans yet.
                Create one to start improving your skills systematically!
              </p>
            </div>
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievement cards will go here */}
              <div className="col-span-full text-center p-12">
                <h3 className="text-lg font-medium mb-2">Complete challenges to earn achievements!</h3>
                <p className="text-muted-foreground">
                  Your achievements and medals will be displayed here as you progress through Creative Gym exercises.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* History Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your History</h2>
          {userProgress.completedChallenges > 0 ? (
            <div className="space-y-4">
              {/* History content will go here */}
              <p className="text-muted-foreground">
                Your completed challenges will appear here.
              </p>
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                You haven't completed any challenges yet.
                Start a challenge to see your history!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeGym;
