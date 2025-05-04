
import React from 'react';
import { useErrorContext } from '@/contexts/ErrorContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ErrorDisplay = () => {
  const { errors, clearError, clearAllErrors } = useErrorContext();

  if (errors.length === 0) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog">
      <div className="bg-background rounded-lg shadow-lg border border-border max-w-lg w-full p-6 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Fehlermeldungen</h2>
          <Button variant="ghost" size="sm" onClick={clearAllErrors}>
            Alle schließen
          </Button>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="space-y-3">
            {errors.map((error) => (
              <Alert key={error.id} variant={error.severity === 'warning' ? 'default' : 'destructive'} className="relative">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(error.severity)}
                  <div className="flex-1">
                    <AlertTitle>{error.message}</AlertTitle>
                    {error.details && (
                      <AlertDescription className="mt-2 text-xs">
                        {error.details}
                      </AlertDescription>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {error.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 absolute top-2 right-2"
                    onClick={() => clearError(error.id)}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Schließen</span>
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={clearAllErrors}>
            Schließen
          </Button>
        </div>
      </div>
    </div>
  );
};
