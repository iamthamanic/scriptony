
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { uploadAndAnalyzeScript } from '@/services/scriptAnalysis';
import { AnalysisResult } from '@/types';
import ScriptAnalysisResults from '@/components/script-analysis/ScriptAnalysisResults';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectState } from '@/hooks/project/useProjectState';
import DragDropUploader from '@/components/upload/DragDropUploader';
import FileTypeInfoCards from '@/components/upload/FileTypeInfoCards';
import { useFileValidation } from '@/hooks/useFileValidation';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateFile } = useFileValidation();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalysisResultsOpen, setIsAnalysisResultsOpen] = useState(false);
  
  const { handleCreateProject } = useProjectState();
  
  const handleFiles = async (file: File) => {
    if (!validateFile(file)) {
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
            <DragDropUploader 
              isAnalyzing={isAnalyzing} 
              onFileSelect={handleFiles} 
            />
          </CardContent>
        </Card>
        
        <FileTypeInfoCards />
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
