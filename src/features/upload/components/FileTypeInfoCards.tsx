
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileCode, File } from 'lucide-react';

const FileTypeInfoCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <File className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg">PDF Files</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Most common format for screenplays. Works best with standard screenplay format.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">DOCX Files</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Microsoft Word format. Works well with most screenplay templates.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg">TXT Files</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Plain text format. Should follow standard screenplay formatting for best results.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileTypeInfoCards;
