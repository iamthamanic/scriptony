
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';

// Import the settings components
import AccountTabsList from '@/components/settings/AccountTabsList';
import ProfileTab from '@/components/settings/ProfileTab';
import SubscriptionTab from '@/components/settings/SubscriptionTab';
import SecurityTab from '@/components/settings/SecurityTab';
import UnlockTab from '@/components/settings/UnlockTab';
import IntegrationTab from '@/components/settings/IntegrationTab';
import StorageTab from '@/components/settings/StorageTab';

const Account = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Set the active tab based on URL parameter or default to 'profile'
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'subscription', 'security', 'storage', 'unlock', 'mcp-integration'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
  return (
    <div className="py-8 px-4 md:px-6 w-full animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Einstellungen</h1>
          <p className="text-muted-foreground">Verwalte dein Konto und deine Einstellungen</p>
        </header>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
          <AccountTabsList />
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileTab 
              accountName={user?.email?.split('@')[0] || "Demo User"} 
              accountEmail={user?.email || "demo@example.com"} 
            />
          </TabsContent>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <SubscriptionTab />
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
          
          {/* Storage Tab */}
          <TabsContent value="storage">
            <StorageTab />
          </TabsContent>
          
          {/* Unlock Tab */}
          <TabsContent value="unlock">
            <UnlockTab />
          </TabsContent>
          
          {/* MCP Integration Tab */}
          <TabsContent value="mcp-integration">
            <IntegrationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
