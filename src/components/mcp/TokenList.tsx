
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { LockIcon, UnlockIcon, Trash2Icon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import TokenCreationDialog from './TokenCreationDialog';

interface Token {
  id: string;
  name: string;
  token_preview: string;
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  scopes: string[];
  is_active: boolean;
  call_count: number;
}

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: de
      });
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('mcp/tokens/list');
        
        if (error) {
          throw error;
        }
        
        setTokens(data.data);
      } catch (error: any) {
        console.error('Failed to fetch tokens:', error);
        toast.error('Fehler beim Laden der Tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [refreshTrigger]);

  const toggleTokenStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.functions.invoke('mcp/tokens/update', {
        body: { id, is_active: !currentStatus }
      });
      
      if (error) {
        throw error;
      }
      
      setTokens(prev => prev.map(token => 
        token.id === id ? { ...token, is_active: !currentStatus } : token
      ));
      
      toast.success(`Token ${!currentStatus ? 'aktiviert' : 'deaktiviert'}`);
    } catch (error: any) {
      console.error('Failed to update token status:', error);
      toast.error('Fehler beim Aktualisieren des Tokens');
    }
  };

  const deleteToken = async (id: string) => {
    if (!confirm('Möchten Sie diesen Token wirklich löschen?')) {
      return;
    }
    
    try {
      const { error } = await supabase.functions.invoke('mcp/tokens/delete', {
        body: { id },
        method: 'DELETE'
      });
      
      if (error) {
        throw error;
      }
      
      setTokens(prev => prev.filter(token => token.id !== id));
      toast.success('Token gelöscht');
    } catch (error: any) {
      console.error('Failed to delete token:', error);
      toast.error('Fehler beim Löschen des Tokens');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Meine API-Tokens</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
          <TokenCreationDialog onSuccess={refresh} />
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {tokens.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token-Name</TableHead>
                  <TableHead>Token-Vorschau</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead>Läuft ab</TableHead>
                  <TableHead>Zuletzt verwendet</TableHead>
                  <TableHead>Nutzung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map(token => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">{token.name}</TableCell>
                    <TableCell className="font-mono">••••{token.token_preview}</TableCell>
                    <TableCell>{formatDate(token.created_at)}</TableCell>
                    <TableCell>
                      {token.expires_at ? formatDate(token.expires_at) : 'Unbegrenzt'}
                    </TableCell>
                    <TableCell>{token.last_used_at ? formatDate(token.last_used_at) : 'Nie'}</TableCell>
                    <TableCell>{token.call_count} Aufrufe</TableCell>
                    <TableCell>
                      <Badge variant={token.is_active ? "success" : "destructive"}>
                        {token.is_active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleTokenStatus(token.id, token.is_active)}
                        >
                          {token.is_active ? (
                            <LockIcon className="h-4 w-4 text-amber-500" />
                          ) : (
                            <UnlockIcon className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteToken(token.id)}
                        >
                          <Trash2Icon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Sie haben noch keine API-Tokens erstellt.</p>
              <p className="text-sm text-muted-foreground mt-2">
                API-Tokens werden benötigt, um externe KI-Modelle mit ScriptBuddy zu verbinden.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenList;
