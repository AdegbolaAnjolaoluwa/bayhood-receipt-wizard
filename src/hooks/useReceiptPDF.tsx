import jsPDF from 'jspdf';

interface ReceiptPDFProps {
  studentName: string;
  studentClass: string;
  term: string;
  session: string;
  paymentMethod: string;
  totalAmount: number;
  receiptNumber: string;
  currentDate: string;
}

export const useReceiptPDF = () => {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const generatePDF = ({
    studentName,
    studentClass,
    term,
    session,
    paymentMethod,
    totalAmount,
    receiptNumber,
    currentDate
  }: ReceiptPDFProps) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header - School Logo and Name
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      // Logo centered
      const logoSize = 40;
      const logoX = (pageWidth - logoSize) / 2;
      pdf.addImage(img, 'PNG', logoX, yPosition, logoSize, logoSize);
      yPosition += 50;
      
      // School Name - Large Black
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('BAYHOOD PREPARATORY SCHOOL', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;
      
      // Tagline - Blue
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('CRECHE | PRESCHOOL | AFTER SCHOOL', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 8;
      
      // Description line
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Creche | Preschool | Nursery | Afterschool', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 5;
      
      // Address and contact
      pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 5;
      pdf.text('Phone: 0809 811 2378', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Light gray line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;
      
      // Official Receipt and Amount Box layout
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('OFFICIAL RECEIPT', 25, yPosition);
      
      // Amount Paid Box (light blue background)
      const boxWidth = 80;
      const boxHeight = 25;
      const boxX = pageWidth - boxWidth - 25;
      const boxY = yPosition - 15;
      
      pdf.setFillColor(224, 242, 254);
      pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 5, 5, 'F');
      pdf.setDrawColor(190, 227, 248);
      pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 5, 5, 'S');
      
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AMOUNT PAID', boxX + boxWidth/2, boxY + 8, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatCurrency(totalAmount), boxX + boxWidth/2, boxY + 20, { align: 'center' });
      
      yPosition += 20;
      
      // Receipt Details - Blue labels
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(59, 130, 246);
      
      pdf.text('Receipt No:', 25, yPosition);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receiptNumber, 70, yPosition);
      
      pdf.setTextColor(59, 130, 246);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date Issued:', pageWidth - 100, yPosition);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont('helvetica', 'bold');
      pdf.text(currentDate, pageWidth - 50, yPosition);
      
      yPosition += 25;
      
      // Student Information Box
      pdf.setFillColor(248, 250, 252);
      const studentBoxHeight = 60;
      pdf.roundedRect(25, yPosition, pageWidth - 50, studentBoxHeight, 5, 5, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(25, yPosition, pageWidth - 50, studentBoxHeight, 5, 5, 'S');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('STUDENT INFORMATION', 30, yPosition + 15);
      
      // Student details in grid
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      // Left column
      pdf.text('Student Name:', 30, yPosition + 30);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont('helvetica', 'bold');
      pdf.text(studentName, 30, yPosition + 40);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Class:', 30, yPosition + 50);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont('helvetica', 'bold');
      pdf.text(studentClass, 30, yPosition + 60);
      
      // Right column
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Term:', pageWidth - 100, yPosition + 30);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont('helvetica', 'bold');
      pdf.text(term, pageWidth - 100, yPosition + 40);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Session:', pageWidth - 100, yPosition + 50);
      pdf.setTextColor(147, 51, 234);
      pdf.setFont('helvetica', 'bold');
      pdf.text(session, pageWidth - 100, yPosition + 60);
      
      yPosition += studentBoxHeight + 20;
      
      // Payment Description
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Payment Description:', 25, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      const description = `${studentName} - Tuition: ₦${totalAmount.toLocaleString()} | Discount Applied: 0% | Payment Method: ${paymentMethod} | Status: PAID IN FULL`;
      const descLines = pdf.splitTextToSize(description, pageWidth - 50);
      pdf.text(descLines, 25, yPosition);
      
      yPosition += 30;
      
      // Footer
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Thank you for your payment. Keep this receipt for your records.', pageWidth/2, yPosition, { align: 'center' });
      
      // Save
      const fileName = `Receipt_${studentName.replace(/\s+/g, '_')}_${receiptNumber}.pdf`;
      pdf.save(fileName);
    };
    
    img.src = '/lovable-uploads/ca706d69-cfe9-4cc0-80e4-21dcb229992a.png';
  };

  return { generatePDF };
};