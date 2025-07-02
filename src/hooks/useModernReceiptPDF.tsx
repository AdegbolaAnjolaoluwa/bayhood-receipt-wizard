import jsPDF from 'jspdf';

interface ModernReceiptData {
  payerName: string;
  paymentAmount: number;
  paymentDate: string;
  purpose: string;
  studentClass: string;
  term: string;
  session: string;
  receiptNumber: string;
  customFields: { [key: string]: string };
}

export const useModernReceiptPDF = () => {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const generateModernPDF = (data: ModernReceiptData) => {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 25;

    // Set up colors
    const primaryBlue = [59, 130, 246];
    const secondaryGreen = [34, 197, 94];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];

    // Header with logo placeholder
    const logoSize = 20;
    const logoX = (pageWidth - logoSize) / 2;
    
    // Draw logo placeholder (you can replace with actual logo)
    pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.circle(logoX + logoSize/2, yPosition + logoSize/2, logoSize/2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BPS', logoX + logoSize/2, yPosition + logoSize/2 + 2, { align: 'center' });
    
    yPosition += logoSize + 15;

    // School name and details
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BAYHOOD PREPARATORY SCHOOL', pageWidth/2, yPosition, { align: 'center' });
    
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.text('CRECHE | PRESCHOOL | AFTER SCHOOL', pageWidth/2, yPosition, { align: 'center' });
    
    yPosition += 6;
    pdf.setFontSize(10);
    pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, yPosition, { align: 'center' });
    
    yPosition += 4;
    pdf.text('Phone: 0809 811 2378', pageWidth/2, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Elegant divider line
    pdf.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.setLineWidth(0.8);
    pdf.line(30, yPosition, pageWidth - 30, yPosition);
    
    yPosition += 20;

    // Receipt title with modern styling
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(30, yPosition - 8, pageWidth - 60, 20, 5, 5, 'F');
    pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OFFICIAL PAYMENT RECEIPT', pageWidth/2, yPosition + 2, { align: 'center' });
    
    yPosition += 25;

    // Receipt number and date in a clean layout
    pdf.setFontSize(11);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFont('helvetica', 'normal');
    
    // Left side - Receipt number
    pdf.text('Receipt No:', 35, yPosition);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.receiptNumber, 70, yPosition);
    
    // Right side - Date
    pdf.setFont('helvetica', 'normal');
    pdf.text('Date Issued:', pageWidth - 80, yPosition);
    pdf.setFont('helvetica', 'bold');
    pdf.text(formatDate(data.paymentDate), pageWidth - 40, yPosition, { align: 'right' });
    
    yPosition += 20;

    // Amount paid - prominent display
    const amountBoxWidth = 120;
    const amountBoxHeight = 35;
    const amountBoxX = (pageWidth - amountBoxWidth) / 2;
    
    pdf.setFillColor(secondaryGreen[0], secondaryGreen[1], secondaryGreen[2]);
    pdf.roundedRect(amountBoxX, yPosition, amountBoxWidth, amountBoxHeight, 8, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AMOUNT PAID', amountBoxX + amountBoxWidth/2, yPosition + 12, { align: 'center' });
    
    pdf.setFontSize(20);
    pdf.text(formatCurrency(data.paymentAmount), amountBoxX + amountBoxWidth/2, yPosition + 27, { align: 'center' });
    
    yPosition += amountBoxHeight + 25;

    // Payer details section
    pdf.setFillColor(250, 250, 250);
    const detailsBoxHeight = 80;
    pdf.roundedRect(30, yPosition, pageWidth - 60, detailsBoxHeight, 5, 5, 'F');
    
    pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT DETAILS', 40, yPosition + 15);
    
    // Details in two columns
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Left column
    const leftColX = 40;
    let detailY = yPosition + 28;
    
    pdf.text('Payer Name:', leftColX, detailY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.payerName, leftColX + 30, detailY);
    
    detailY += 12;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Class:', leftColX, detailY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.studentClass, leftColX + 30, detailY);
    
    detailY += 12;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Term:', leftColX, detailY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.term, leftColX + 30, detailY);
    
    // Right column
    const rightColX = pageWidth/2 + 20;
    detailY = yPosition + 28;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Session:', rightColX, detailY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.session, rightColX + 25, detailY);
    
    yPosition += detailsBoxHeight + 20;

    // Purpose section
    if (data.purpose) {
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Purpose of Payment:', 35, yPosition);
      
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const purposeLines = pdf.splitTextToSize(data.purpose, pageWidth - 70);
      pdf.text(purposeLines, 35, yPosition);
      yPosition += purposeLines.length * 5 + 15;
    }

    // Custom fields if any
    const customFieldsEntries = Object.entries(data.customFields).filter(([_, value]) => value.trim());
    if (customFieldsEntries.length > 0) {
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Additional Details:', 35, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      customFieldsEntries.forEach(([key, value]) => {
        const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        pdf.text(`${fieldName}: ${value}`, 40, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
    }

    // Status indicator
    const statusY = Math.min(yPosition + 20, pageHeight - 60);
    pdf.setFillColor(34, 197, 94, 20);
    pdf.roundedRect(30, statusY - 5, pageWidth - 60, 15, 5, 5, 'F');
    pdf.setTextColor(secondaryGreen[0], secondaryGreen[1], secondaryGreen[2]);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ PAYMENT RECEIVED', pageWidth/2, statusY + 2, { align: 'center' });

    // Footer
    const footerY = pageHeight - 30;
    pdf.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Thank you for your payment. This receipt serves as proof of payment.', pageWidth/2, footerY, { align: 'center' });
    pdf.text('For inquiries, please contact the school administration.', pageWidth/2, footerY + 5, { align: 'center' });

    // Save the PDF
    const fileName = `Receipt_${data.payerName.replace(/\s+/g, '_')}_${data.receiptNumber}.pdf`;
    pdf.save(fileName);
  };

  return { generateModernPDF };
};