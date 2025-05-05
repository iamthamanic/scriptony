
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const TokenConnectionHelp = () => {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    toast.success('In die Zwischenablage kopiert');
    
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [key]: false }));
    }, 3000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Claude verbinden</CardTitle>
        <CardDescription>
          Folgen Sie dieser Anleitung, um eine Verbindung zwischen Claude und ScriptBuddy herzustellen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">1. Manifest URL</p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => copyToClipboard(
                'https://suvxmnrnldfhfwxvkntv.supabase.co/functions/v1/mcp/manifest', 
                'manifest'
              )}
            >
              {copied['manifest'] ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="bg-muted px-3 py-2 rounded-md font-mono text-xs break-all">
            https://suvxmnrnldfhfwxvkntv.supabase.co/functions/v1/mcp/manifest
          </div>
          <p className="text-xs text-muted-foreground">
            Diese URL gibt Claude Informationen über alle verfügbaren Funktionen.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">2. API Endpoint</p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => copyToClipboard(
                'https://suvxmnrnldfhfwxvkntv.supabase.co/functions/v1/mcp/execute', 
                'endpoint'
              )}
            >
              {copied['endpoint'] ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          <div className="bg-muted px-3 py-2 rounded-md font-mono text-xs break-all">
            https://suvxmnrnldfhfwxvkntv.supabase.co/functions/v1/mcp/execute
          </div>
          <p className="text-xs text-muted-foreground">
            Über diesen Endpunkt werden API-Anfragen an ScriptBuddy gesendet.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">3. Für jede Anfrage im HTTP-Header mitgeben:</p>
          <div className="bg-muted px-3 py-2 rounded-md font-mono text-xs">
            Authorization: Bearer [IHR_API_TOKEN]
          </div>
          <p className="text-xs text-muted-foreground">
            Ersetzen Sie [IHR_API_TOKEN] durch den Token, den Sie erstellt haben.
          </p>
        </div>

        <div className="space-y-2 text-sm pt-2 border-t">
          <p className="font-medium">Beispiel für Claude-Konfiguration:</p>
          <p className="text-xs">
            "Ich werde Funktionen von ScriptBuddy nutzen, um deine Drehbuchprojekte zu verwalten. 
            Die Funktionen sind hier beschrieben: <span className="font-mono text-[10px]">https://suvxmnrnldfhfwxvkntv.supabase.co/functions/v1/mcp/manifest</span>"
          </p>
          <p className="text-xs">
            "Bitte rufe diese Funktionen für mich auf, wenn ich dich darum bitte."
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenConnectionHelp;
