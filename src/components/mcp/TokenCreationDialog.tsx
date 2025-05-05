
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusIcon, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TokenCreationDialogProps {
  onSuccess?: () => void;
}

interface FunctionDef {
  name: string;
  description: string;
}

const TokenCreationDialog = ({ onSuccess }: TokenCreationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [tokenName, setTokenName] = useState('');
  const [expiry, setExpiry] = useState<string>('never');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [availableFunctions, setAvailableFunctions] = useState<FunctionDef[]>([]);
  const [isBulkSelecting, setIsBulkSelecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newToken, setNewToken] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Fetch available functions from the MCP manifest
  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('mcp/manifest');
        
        if (error) {
          throw error;
        }
        
        if (data && data.functions) {
          setAvailableFunctions(data.functions);
        }
      } catch (error) {
        console.error('Failed to fetch MCP manifest:', error);
      }
    };

    if (open) {
      fetchManifest();
    }
  }, [open]);

  const toggleScope = (scopeName: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeName) 
        ? prev.filter(name => name !== scopeName)
        : [...prev, scopeName]
    );
  };

  const toggleAllScopes = () => {
    if (isBulkSelecting || selectedScopes.length !== availableFunctions.length) {
      setSelectedScopes(availableFunctions.map(func => func.name));
      setIsBulkSelecting(true);
    } else {
      setSelectedScopes([]);
      setIsBulkSelecting(false);
    }
  };

  const handleCreateToken = async () => {
    if (!tokenName.trim()) {
      toast.error('Bitte geben Sie einen Token-Namen ein');
      return;
    }
    
    if (selectedScopes.length === 0) {
      toast.error('Bitte wählen Sie mindestens eine Berechtigung');
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('mcp/tokens/create', {
        body: {
          name: tokenName,
          scopes: selectedScopes,
          expiresIn: expiry !== 'never' ? expiry : null
        }
      });
      
      if (error) {
        throw error;
      }
      
      setNewToken(data.token);
      setStep('success');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Failed to create token:', error);
      toast.error('Fehler beim Erstellen des Tokens');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(newToken);
    setCopied(true);
    toast.success('Token in die Zwischenablage kopiert');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('form');
      setTokenName('');
      setExpiry('never');
      setSelectedScopes([]);
      setNewToken('');
      setCopied(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="h-4 w-4 mr-1" />
          Neuen API-Token erstellen
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Neuen API-Token erstellen</DialogTitle>
              <DialogDescription>
                API-Tokens ermöglichen externen Anwendungen und KI-Modellen den Zugriff auf ScriptBuddy.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="token-name">Token-Name</Label>
                <Input 
                  id="token-name" 
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="z.B. Claude für Projekt A"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="token-expiry">Gültigkeit</Label>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger id="token-expiry">
                    <SelectValue placeholder="Wählen Sie eine Gültigkeit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Unbegrenzt</SelectItem>
                    <SelectItem value="7days">7 Tage</SelectItem>
                    <SelectItem value="1month">1 Monat</SelectItem>
                    <SelectItem value="6months">6 Monate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Berechtigungen</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    type="button" 
                    onClick={toggleAllScopes}
                    className="h-8 text-xs"
                  >
                    {isBulkSelecting || selectedScopes.length === availableFunctions.length
                      ? "Alle abwählen"
                      : "Alle auswählen"}
                  </Button>
                </div>
                
                <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                  {availableFunctions.length > 0 ? (
                    <div className="grid gap-2">
                      {availableFunctions.map((func) => (
                        <div key={func.name} className="flex items-start space-x-2">
                          <Checkbox
                            id={`scope-${func.name}`}
                            checked={selectedScopes.includes(func.name)}
                            onCheckedChange={() => toggleScope(func.name)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`scope-${func.name}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {func.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {func.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Lade verfügbare Funktionen...
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button 
                onClick={handleCreateToken} 
                disabled={!tokenName.trim() || selectedScopes.length === 0 || loading}
              >
                {loading ? 'Erstelle...' : 'Token erstellen'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API-Token erstellt</DialogTitle>
              <DialogDescription>
                Bitte kopieren Sie diesen Schlüssel jetzt – er wird später nicht mehr vollständig angezeigt.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="relative">
                <Input
                  value={newToken}
                  readOnly
                  className="pr-10 font-mono text-sm overflow-x-auto"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={copyToken}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-amber-800 mb-2">Verwendung mit Claude</h4>
                <p className="text-xs text-amber-800 mb-2">
                  Verbinde dein Claude-Modell mit ScriptBuddy über diese Einstellungen:
                </p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold">Manifest URL:</p>
                    <p className="text-xs font-mono bg-white border border-amber-200 rounded p-1.5">
                      https://suvxmnrnldfhfwxvkntv.supabase.co/functions/v1/mcp/manifest
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold">API Endpoint:</p>
                    <p className="text-xs font-mono bg-white border border-amber-200 rounded p-1.5">
                      https://suvxmnrnldfhfwxvkntv.supabase.co/functions/v1/mcp/execute
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold">Authorization Header:</p>
                    <p className="text-xs font-mono bg-white border border-amber-200 rounded p-1.5">
                      Authorization: Bearer {newToken}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleClose}>
                Schließen
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TokenCreationDialog;
