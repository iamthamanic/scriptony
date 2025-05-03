
import { Scene, Project } from "../types";
import { jsPDF } from "jspdf";
import { Timepoint } from "jspdf";

// This is a utility function that will generate a PDF from a scene
export const generateScenePDF = (scene: Scene, project: Project): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Set font styles
  const titleFont = "helvetica";
  const bodyFont = "helvetica";
  const titleFontSize = 16;
  const subtitleFontSize = 12;
  const bodyFontSize = 10;
  
  let yPos = margin;
  
  // Header with project and scene info
  doc.setFont(titleFont, "bold");
  doc.setFontSize(titleFontSize);
  doc.text(`${project.title}`, margin, yPos);
  yPos += 10;
  
  doc.setFont(titleFont, "normal");
  doc.setFontSize(subtitleFontSize);
  if (scene.episodeTitle) {
    doc.text(`Episode: ${scene.episodeTitle}`, margin, yPos);
    yPos += 8;
  }
  
  doc.text(`Scene: ${scene.sceneNumber} - ${scene.location} (${scene.timeOfDay})`, margin, yPos);
  yPos += 8;
  
  doc.text(`Timecode: ${scene.timecodeStart} - ${scene.timecodeEnd}`, margin, yPos);
  yPos += 15;
  
  // Section: Visual Elements
  doc.setFont(titleFont, "bold");
  doc.text("Visual Elements", margin, yPos);
  yPos += 8;
  
  doc.setFont(bodyFont, "normal");
  doc.setFontSize(bodyFontSize);
  
  // Function to add text with word wrap
  const addText = (text: string, title: string) => {
    doc.setFont(bodyFont, "bold");
    doc.text(`${title}: `, margin, yPos);
    doc.setFont(bodyFont, "normal");
    
    // Calculate width of the title to start the text after it
    const titleWidth = doc.getTextWidth(`${title}: `);
    
    // Split the text to fit the page width minus margins and title width
    const splitText = doc.splitTextToSize(text, contentWidth - titleWidth);
    
    // Place first line after the title
    if (splitText[0]) {
      doc.text(splitText[0], margin + titleWidth, yPos);
    }
    
    // Place remaining lines with proper indentation
    if (splitText.length > 1) {
      for (let i = 1; i < splitText.length; i++) {
        yPos += 6;
        doc.text(splitText[i], margin, yPos);
      }
    }
    
    yPos += 8;
    
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = margin;
    }
  };
  
  // Add visual elements data
  addText(scene.visualComposition, "Visual Composition");
  addText(scene.lighting, "Lighting");
  addText(scene.colorGrading, "Color Grading");
  addText(scene.soundDesign, "Sound Design");
  addText(scene.specialEffects, "Special Effects");
  
  // Section: Action & Dialog
  yPos += 4;
  doc.setFont(titleFont, "bold");
  doc.setFontSize(subtitleFontSize);
  doc.text("Action & Dialog", margin, yPos);
  yPos += 8;
  
  doc.setFont(bodyFont, "normal");
  doc.setFontSize(bodyFontSize);
  
  // Description
  const descriptionLines = doc.splitTextToSize(scene.description, contentWidth);
  doc.text(descriptionLines, margin, yPos);
  yPos += descriptionLines.length * 6 + 8;
  
  // Check if we need a new page for dialog
  if (yPos > 240) {
    doc.addPage();
    yPos = margin;
  }
  
  // Dialog
  if (scene.dialog) {
    doc.setFont(bodyFont, "bold");
    doc.text("Dialog:", margin, yPos);
    yPos += 8;
    
    doc.setFont(bodyFont, "normal");
    const dialogLines = doc.splitTextToSize(scene.dialog, contentWidth - 10);
    doc.text(dialogLines, margin + 5, yPos);
    yPos += dialogLines.length * 6 + 8;
  }
  
  // Check if we need a new page for transitions
  if (yPos > 250) {
    doc.addPage();
    yPos = margin;
  }
  
  // Transitions
  if (scene.transitions) {
    addText(scene.transitions, "Transitions");
  }
  
  // Production Notes & Emotional Significance
  if (scene.productionNotes || scene.emotionalNotes) {
    yPos += 4;
    doc.setFont(titleFont, "bold");
    doc.setFontSize(subtitleFontSize);
    doc.text("Production & Meta", margin, yPos);
    yPos += 8;
    
    doc.setFont(bodyFont, "normal");
    doc.setFontSize(bodyFontSize);
    
    if (scene.productionNotes) {
      addText(scene.productionNotes, "Production Notes");
    }
    
    addText(
      scene.emotionalSignificance + (scene.emotionalNotes ? `: ${scene.emotionalNotes}` : ""),
      "Emotional Significance"
    );
  }
  
  // Add footer with page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont(bodyFont, "italic");
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, 285);
  }
  
  // Save the PDF
  doc.save(`${project.title}_Scene_${scene.sceneNumber}.pdf`);
};
