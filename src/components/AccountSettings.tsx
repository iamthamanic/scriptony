
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';

// Import the newly created components
import AccountTabsList from './settings/AccountTabsList';
import ProfileTab from './settings/ProfileTab';
import SubscriptionTab from './settings/SubscriptionTab';
import SecurityTab from './settings/SecurityTab';
import UnlockTab from './settings/UnlockTab';
import IntegrationTab from './settings/IntegrationTab';
import StorageTab from './settings/StorageTab';

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  accountEmail?: string;
  onSignOut?: () => void;
}

const AccountSettings = ({
  isOpen,
  onClose,
  accountName,
  accountEmail = "user@example.com",
  onSignOut
}: AccountSettingsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" /> Account Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="mt-4">
          <AccountTabsList />
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileTab accountName={accountName} accountEmail={accountEmail} />
          </TabsContent>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <SubscriptionTab />
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <SecurityTab onSignOut={onSignOut} />
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
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettings;
