
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileText, FileType2 } from 'lucide-react';
import { uploadAndAnalyzeScript } from '@/services/scriptAnalysis';
import { AnalysisResult } from '@/types';
import ScriptAnalysisResults from '@/components/script-analysis/ScriptAnalysisResults';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectState } from '@/hooks/project/useProjectState';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalysisResultsOpen, setIsAnalysisResultsOpen] = useState(false);
  
  const { handleCreateProject } = useProjectState();
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
      // Clear the input
      e.target.value = '';
    }
  };
  
  const handleFiles = async (file: File) => {
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(fileExt || '')) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte lade eine PDF-, DOCX- oder TXT-Datei hoch",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Maximale Dateigröße beträgt 10MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      toast({
        title: "Skript wird analysiert",
        description: "Bitte warten Sie, während wir Ihr Skript analysieren...",
      });
      
      const { analysisResult } = await uploadAndAnalyzeScript(file);
      setAnalysisResult(analysisResult);
      setIsAnalysisResultsOpen(true);
      
      toast({
        title: "Analyse abgeschlossen",
        description: "Skriptanalyse erfolgreich abgeschlossen",
      });
    } catch (error) {
      console.error("Fehler bei der Analyse des Skripts:", error);
      toast({
        title: "Analyse fehlgeschlagen",
        description: "Fehler bei der Analyse des Skripts. Bitte versuche es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="py-8 px-4 md:px-6 w-full animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skriptanalyse</h1>
          <p className="text-muted-foreground">Lade ein Skript hoch und lass es automatisch analysieren</p>
        </header>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skript hochladen</CardTitle>
            <CardDescription>
              Lade eine PDF-, DOCX- oder TXT-Datei hoch, um sie zu analysieren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-anime-purple bg-anime-light-purple/50' : 'border-gray-300'
              } transition-colors`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 rounded-full bg-anime-light-purple text-anime-purple">
                  <UploadCloud className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Ziehe dein Skript hierher oder</h3>
                  <p className="text-sm text-muted-foreground">
                    Unterstützte Dateien: PDF, DOCX, TXT (max. 10MB)
                  </p>
                </div>
                
                <label>
                  <Button 
                    className="bg-anime-purple hover:bg-anime-dark-purple"
                    disabled={isAnalyzing}
                  >
                    Datei auswählen
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      disabled={isAnalyzing}
                    />
                  </Button>
                </label>
              </div>
            </div>
            
            {isAnalyzing && (
              <div className="mt-4 text-center">
                <p className="text-muted-foreground animate-pulse">
                  Analyse läuft... Dies kann einen Moment dauern.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
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
      </div>
      
      <ScriptAnalysisResults
        isOpen={isAnalysisResultsOpen}
        onClose={() => setIsAnalysisResultsOpen(false)}
        analysisResult={analysisResult}
        onCreateProject={(data) => {
          handleCreateProject(data);
          setIsAnalysisResultsOpen(false);
          navigate('/projects');
        }}
        isLoading={isAnalyzing}
      />
    </div>
  );
};

export default Upload;
