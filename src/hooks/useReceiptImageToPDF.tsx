import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const useReceiptImageToPDF = () => {
  const downloadReceiptAsPDF = async (elementId: string, fileName: string) => {
    try {
      // Get the element to capture
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Receipt preview element not found');
      }

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Create PDF with A4 size
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Small margin from top
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Convert canvas to image data URL
      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);

      // Save the PDF
      pdf.save(fileName);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF from image:', error);
      return false;
    }
  };

  return { downloadReceiptAsPDF };
};