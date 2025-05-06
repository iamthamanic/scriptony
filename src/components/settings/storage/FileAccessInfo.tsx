
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileText, Cloud } from 'lucide-react';

const FileAccessInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datei-Zugriff</CardTitle>
        <CardDescription>
          Informationen über den Zugriff auf deine gespeicherten Dateien
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="p-2 bg-muted rounded-full">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">Upload</h4>
              <p className="text-sm text-muted-foreground">
                Automatischer Upload aller Projektdateien nach Google Drive
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="p-2 bg-muted rounded-full">
              <Download className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">Direktzugriff</h4>
              <p className="text-sm text-muted-foreground">
                Zugriff auf deine Dateien direkt über Google Drive
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="p-2 bg-muted rounded-full">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">Dateiformate</h4>
              <p className="text-sm text-muted-foreground">
                PDF, Bilder, Audio und andere Medien
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="p-2 bg-muted rounded-full">
              <Cloud className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">Datenhoheit</h4>
              <p className="text-sm text-muted-foreground">
                Volle Kontrolle über deine Dateien auch nach Scriptony-Nutzung
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileAccessInfo;
