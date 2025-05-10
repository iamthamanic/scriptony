
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// This is a stub component that would be implemented with the full FileTypeInfoCards functionality
const FileTypeInfoCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">PDF Files</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Most common format for screenplays. Works best with standard screenplay format.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">DOCX Files</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Microsoft Word format. Works well with most screenplay templates.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">TXT Files</CardTitle>
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
