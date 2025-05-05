
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, User, CreditCard, Shield, LogOut, Key } from 'lucide-react';
import { validateUnlockCode } from '@/services/admin';
import { toast } from 'sonner';

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
  const [unlockCode, setUnlockCode] = useState('');
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!unlockCode.trim()) return;
    
    setIsSubmittingCode(true);
    try {
      const result = await validateUnlockCode(unlockCode);
      
      if (result.success) {
        toast.success(result.message || 'Code erfolgreich eingelöst!');
        setUnlockCode('');
      } else {
        toast.error(result.message || 'Ungültiger Code');
      }
    } catch (error) {
      console.error('Error validating code:', error);
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmittingCode(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" /> Account Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" /> Subscription
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="unlock" className="flex items-center gap-1">
              <Key className="h-4 w-4" /> Unlock
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={accountName} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={accountEmail} />
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-anime-purple hover:bg-anime-dark-purple">
                Save Changes
              </Button>
            </div>
          </TabsContent>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Current Plan</h3>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold">Free Tier</span>
                  <p className="text-sm text-muted-foreground">Basic access to ScriptBuddy</p>
                </div>
                
                <Button variant="outline" className="border-anime-purple text-anime-purple">
                  Upgrade
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Available Plans</h3>
              
              <div className="border rounded-lg p-4 hover:border-anime-purple transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">ScriptBuddy Pro</span>
                    <p className="text-sm text-muted-foreground">$9.99/month</p>
                  </div>
                  
                  <Button className="bg-anime-purple hover:bg-anime-dark-purple">
                    Select Plan
                  </Button>
                </div>
                <ul className="mt-3 text-sm space-y-1">
                  <li>✓ Unlimited projects</li>
                  <li>✓ Advanced AI assistance</li>
                  <li>✓ PDF exports</li>
                  <li>✓ Team collaboration</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 hover:border-anime-purple transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">ScriptBuddy Enterprise</span>
                    <p className="text-sm text-muted-foreground">$29.99/month</p>
                  </div>
                  
                  <Button className="bg-anime-purple hover:bg-anime-dark-purple">
                    Select Plan
                  </Button>
                </div>
                <ul className="mt-3 text-sm space-y-1">
                  <li>✓ All Pro features</li>
                  <li>✓ Priority support</li>
                  <li>✓ Custom branding</li>
                  <li>✓ API access</li>
                  <li>✓ Advanced analytics</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <Button 
                variant="outline" 
                className="text-red-500 hover:bg-red-50"
                onClick={onSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              <Button className="bg-anime-purple hover:bg-anime-dark-purple">
                Update Password
              </Button>
            </div>
          </TabsContent>
          
          {/* Unlock Tab */}
          <TabsContent value="unlock" className="space-y-6">
            <div className="space-y-2">
              <form onSubmit={handleUnlockSubmit}>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Freischaltcode eingeben</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wenn du einen Freischaltcode für ScriptBuddy erhalten hast, kannst du ihn hier eingeben, 
                    um erweiterte Funktionen freizuschalten oder den Admin-Modus zu aktivieren.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        id="unlock-code"
                        value={unlockCode}
                        onChange={(e) => setUnlockCode(e.target.value)}
                        placeholder="Gib deinen Code ein"
                        required
                      />
                      
                      <Button 
                        type="submit" 
                        className="bg-anime-purple hover:bg-anime-dark-purple"
                        disabled={isSubmittingCode || !unlockCode.trim()}
                      >
                        {isSubmittingCode ? 'Validiere...' : 'Einlösen'}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Codes sind einmalig verwendbar und können nicht übertragen werden.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettings;
