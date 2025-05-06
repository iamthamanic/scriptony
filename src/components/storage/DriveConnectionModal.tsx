
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cloud, Link, AlertCircle } from 'lucide-react';
import { connectToGoogleDrive } from '@/services/storage';

interface DriveConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
}

const DriveConnectionModal: React.FC<DriveConnectionModalProps> = ({ 
  isOpen, 
  onClose,
  showCloseButton = false
}) => {
  const [connecting, setConnecting] = React.useState(false);

  const handleConnect = () => {
    try {
      setConnecting(true);
      connectToGoogleDrive();
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      setConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={showCloseButton ? onClose : undefined}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" /> Google Drive Verbindung erforderlich
          </DialogTitle>
          <DialogDescription>
            Scriptony speichert deine Inhalte direkt in deinem eigenen Google Drive.
            So behältst du volle Kontrolle über deine kreativen Inhalte.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Warum Google Drive?</h4>
                <p className="text-sm text-muted-foreground">
                  Scriptony nutzt deinen eigenen Google Drive als Speicherort für alle 
                  kreativen Inhalte. So behältst du volle Datenhoheit – auch nach der Nutzung. 
                  Deine Dateien bleiben immer in deinem Besitz.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">1</span>
              </div>
              <p className="text-sm">
                Du gibst Scriptony Zugriff auf einen speziellen Ordner in Google Drive
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">2</span>
              </div>
              <p className="text-sm">
                Alle Dateien werden in diesem Ordner für dich organisiert gespeichert
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">3</span>
              </div>
              <p className="text-sm">
                Du kannst jederzeit direkt auf die Dateien in deinem Drive zugreifen
              </p>
            </div>
          </div>
          
          <div className="flex justify-center pt-2">
            <Button
              onClick={handleConnect}
              disabled={connecting}
              size="lg"
              className="gap-2"
            >
              <Link className="h-4 w-4" />
              {connecting ? 'Verbindung wird hergestellt...' : 'Google Drive verbinden'}
            </Button>
          </div>
          
          {showCloseButton && (
            <p className="text-center text-xs text-muted-foreground pt-2">
              Du kannst diese Verbindung später in deinen Kontoeinstellungen einrichten,
              aber einige Funktionen werden bis dahin eingeschränkt sein.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriveConnectionModal;
