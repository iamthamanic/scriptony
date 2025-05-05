
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadAndAnalyzeScript } from "@/services/scriptAnalysis";
import { AnalysisResult } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface ScriptAnalysisHandlerProps {
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  setAnalysisResult: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  setIsAnalysisResultsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useScriptAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [isAnalysisResultsOpen, setIsAnalysisResultsOpen] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleUploadScript = async (file: File) => {
    if (!file) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload and analyze scripts",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      toast({
        title: "Analyzing script",
        description: "Please wait while we analyze your script...",
      });
      
      const { analysisResult } = await uploadAndAnalyzeScript(file);
      setAnalysisResult(analysisResult);
      setIsAnalysisResultsOpen(true);
      
      toast({
        title: "Analysis complete",
        description: "Script analysis completed successfully",
      });
    } catch (error) {
      console.error("Error analyzing script:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(fileExt || '')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive"
      });
      // Reset the file input
      event.target.value = '';
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      // Reset the file input
      event.target.value = '';
      return;
    }
    
    handleUploadScript(file);
    // Reset the file input
    event.target.value = '';
  };

  return {
    isAnalyzing,
    analysisResult,
    isAnalysisResultsOpen,
    setIsAnalysisResultsOpen,
    handleFileChange
  };
};

// This is a utility component to manage script analysis
const ScriptAnalysisHandler: React.FC<ScriptAnalysisHandlerProps> = ({ 
  setIsAnalyzing,
  setAnalysisResult, 
  setIsAnalysisResultsOpen 
}) => {
  // This is a utility component that doesn't render anything
  return null;
};

export default ScriptAnalysisHandler;
