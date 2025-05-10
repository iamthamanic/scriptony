
import React from 'react';

const AchievementsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Achievement cards will go here */}
      <div className="col-span-full text-center p-12">
        <h3 className="text-lg font-medium mb-2">Complete challenges to earn achievements!</h3>
        <p className="text-muted-foreground">
          Your achievements and medals will be displayed here as you progress through Creative Gym exercises.
        </p>
      </div>
    </div>
  );
};

export default AchievementsTab;
