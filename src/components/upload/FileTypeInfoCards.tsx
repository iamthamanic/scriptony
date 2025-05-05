
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileType2 } from 'lucide-react';

const FileTypeInfoCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-anime-purple" />
            PDF-Skripte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Fertige PDF-Skripte werden vollständig analysiert und in ein strukturiertes Projekt umgewandelt.
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileType2 className="h-5 w-5 text-anime-purple" />
            Text-Formate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            DOCX- und TXT-Dateien werden ebenfalls unterstützt und können automatisch in Szenen und Charaktere gegliedert werden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileTypeInfoCards;
