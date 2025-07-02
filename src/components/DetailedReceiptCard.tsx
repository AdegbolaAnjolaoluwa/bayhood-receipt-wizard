
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';

interface FeeCategory {
  name: string;
  amount: number;
}

interface DetailedReceiptProps {
  studentName?: string;
  studentClass?: string;
  term?: string;
  session?: string;
  paymentMethod?: string;
  issuedBy?: string;
  onBack?: () => void;
}

const DetailedReceiptCard = ({ 
  studentName = "Aisha Bello",
  studentClass = "Nursery 2", 
  term = "First Term",
  session = "2024/2025",
  paymentMethod = "Cash",
  issuedBy = "Admin",
  onBack 
}: DetailedReceiptProps) => {
  
  const feeCategories: FeeCategory[] = [
    { name: "Tuition", amount: 40000 },
    { name: "PTA Dues", amount: 5000 },
    { name: "Uniforms", amount: 8000 },
    { name: "Textbook and Stationery", amount: 10000 },
    { name: "Development Fee", amount: 3000 },
    { name: "Late Pickup Fee", amount: 1000 },
    { name: "Registration Fee", amount: 2000 },
    { name: "Weekend Childcare Fee", amount: 4000 },
    { name: "Lesson Fee", amount: 5000 },
    { name: "Dailycare Service Fee", amount: 2500 },
    { name: "Sportwear", amount: 3500 },
    { name: "Friday Wear", amount: 1800 },
    { name: "Computer Classes", amount: 2000 }
  ];

  const totalAmount = feeCategories.reduce((sum, fee) => sum + fee.amount, 0);
  const receiptNumber = `BAY-2024-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">School Fee Receipt</h2>
        <div className="flex flex-wrap gap-2">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="outline"
              className="border-gray-500 text-gray-600 hover:bg-gray-50 text-sm sm:text-base"
            >
              ← Back
            </Button>
          )}
          <Button 
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
          >
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
          >
            Print Receipt
          </Button>
        </div>
      </div>

      {/* Receipt Card */}
      <Card className="bg-white shadow-xl border-0 print:shadow-none print-area">
        <CardContent className="p-6 sm:p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/ca706d69-cfe9-4cc0-80e4-21dcb229992a.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              BAYHOOD PREPARATORY SCHOOL
            </h1>
            <p className="text-sm sm:text-base font-bold text-blue-600 mb-4">
              CRECHE | PRESCHOOL | AFTER SCHOOL
            </p>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>Creche | Preschool | Nursery | Afterschool</p>
              <p>House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos</p>
              <p>Phone: 0809 811 2378</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 mb-8"></div>

          {/* Receipt Header with Amount */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">OFFICIAL RECEIPT</h2>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center min-w-[200px]">
              <p className="text-sm font-bold text-gray-700 mb-2">AMOUNT PAID</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium text-base">Receipt No:</span>
                <span className="font-bold text-slate-900 text-base">{receiptNumber}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium text-base">Date Issued:</span>
                <span className="font-bold text-green-600 text-base">{currentDate}</span>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-600 mb-6">STUDENT INFORMATION</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Student Name:</span>
                  <span className="font-bold text-blue-600 text-lg">{studentName}</span>
                </div>
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Class:</span>
                  <span className="font-bold text-blue-600 text-lg">{studentClass}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Term:</span>
                  <span className="font-bold text-green-600 text-lg">{term}</span>
                </div>
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Session:</span>
                  <span className="font-bold text-purple-600 text-lg">{session}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Description */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-slate-900 mb-3">Payment Description:</h4>
            <p className="text-slate-700 text-base leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {studentName} - Tuition: ₦{totalAmount.toLocaleString()} | Discount Applied: 0% | Payment Method: {paymentMethod} | Status: PAID IN FULL
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 italic">
            Thank you for your payment. Keep this receipt for your records.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedReceiptCard;
