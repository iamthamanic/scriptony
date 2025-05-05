import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateUnlockCode } from '@/services/admin';
import { toast } from 'sonner';
const UnlockTab = () => {
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
  return <div className="space-y-6">
      <form onSubmit={handleUnlockSubmit}>
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Freischaltcode eingeben</h3>
          <p className="text-sm text-muted-foreground mb-4">Wenn du einen Freischaltcode für Scriptony erhalten hast, kannst du ihn hier eingeben.</p>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input id="unlock-code" value={unlockCode} onChange={e => setUnlockCode(e.target.value)} placeholder="Gib deinen Code ein" required />
              
              <Button type="submit" className="bg-anime-purple hover:bg-anime-dark-purple" disabled={isSubmittingCode || !unlockCode.trim()}>
                {isSubmittingCode ? 'Validiere...' : 'Einlösen'}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Codes sind einmalig verwendbar und können nicht übertragen werden.
            </p>
          </div>
        </div>
      </form>
    </div>;
};
export default UnlockTab;