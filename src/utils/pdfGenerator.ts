
import { Scene, Project } from "../types";
import { jsPDF } from "jspdf";

// This is a utility function that will generate a PDF from a scene
export const generateScenePDF = (scene: Scene, project: Project): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set initial y position
  let y = 20;
  
  // Add project title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(project.title, 105, y, { align: "center" });
  y += 10;
  
  // Add scene number and episode title if it exists
  doc.setFontSize(14);
  const sceneTitle = scene.episodeTitle 
    ? `Scene ${scene.sceneNumber} - ${scene.episodeTitle}` 
    : `Scene ${scene.sceneNumber}`;
  doc.text(sceneTitle, 105, y, { align: "center" });
  y += 15;
  
  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;
  
  // Scene metadata section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Scene Information", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  
  // Create a table for metadata
  const metadata = [
    ["Location:", scene.location],
    ["Time of Day:", scene.timeOfDay],
    ["Timecode:", `${scene.timecodeStart} - ${scene.timecodeEnd}`],
    ["Emotional Significance:", scene.emotionalSignificance]
  ];
  
  metadata.forEach((row) => {
    doc.setFont("helvetica", "bold");
    doc.text(row[0], 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(row[1], 70, y);
    y += 7;
  });
  y += 5;
  
  // Add keyframe image if it exists
  if (scene.keyframeImage) {
    try {
      doc.addImage(scene.keyframeImage, "JPEG", 20, y, 80, 45);
      y += 50;
    } catch (error) {
      console.error("Error adding image to PDF:", error);
      y += 5;
    }
  }
  
  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;
  
  // Visual Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Visual Details", 20, y);
  y += 7;
  
  const visualDetails = [
    { title: "Visual Composition:", content: scene.visualComposition },
    { title: "Lighting:", content: scene.lighting },
    { title: "Color Grading:", content: scene.colorGrading },
    { title: "Sound Design:", content: scene.soundDesign },
    { title: "Special Effects:", content: scene.specialEffects }
  ];
  
  visualDetails.forEach((detail) => {
    // Check if we need a new page
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(detail.title, 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    
    // Split text to fit page width
    const textLines = doc.splitTextToSize(detail.content, 160);
    doc.text(textLines, 20, y);
    y += textLines.length * 7 + 5;
  });
  
  // Add horizontal line
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;
  
  // Scene Description and Dialog
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Scene Description and Dialog", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  
  // Split text to fit page width
  const descriptionLines = doc.splitTextToSize(scene.description, 160);
  doc.text(descriptionLines, 20, y);
  y += descriptionLines.length * 7 + 10;
  
  // Check if we need a new page
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  
  // Dialog
  if (scene.dialog) {
    doc.setFont("helvetica", "bold");
    doc.text("Dialog:", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const dialogLines = doc.splitTextToSize(scene.dialog, 160);
    doc.text(dialogLines, 20, y);
    y += dialogLines.length * 7 + 10;
  }
  
  // Check if we need a new page
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  
  // Transitions
  if (scene.transitions) {
    doc.setFont("helvetica", "bold");
    doc.text("Transitions:", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const transitionLines = doc.splitTextToSize(scene.transitions, 160);
    doc.text(transitionLines, 20, y);
    y += transitionLines.length * 7 + 10;
  }
  
  // Production Notes
  if (scene.productionNotes) {
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text("Production Notes:", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const notesLines = doc.splitTextToSize(scene.productionNotes, 160);
    doc.text(notesLines, 20, y);
    y += notesLines.length * 7 + 10;
  }
  
  // Add page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
  }
  
  // Save the PDF
  doc.save(`${project.title} - Scene ${scene.sceneNumber}.pdf`);
};
