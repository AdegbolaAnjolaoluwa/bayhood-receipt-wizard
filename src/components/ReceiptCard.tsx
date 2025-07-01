
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt } from '@/types/receipt';
import jsPDF from 'jspdf';

interface ReceiptCardProps {
  receipt: Receipt;
  onEdit: () => void;
}

const ReceiptCard = ({ receipt, onEdit }: ReceiptCardProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Load and add the logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      // Add logo centered at the top
      const logoWidth = 60;
      const logoHeight = 60;
      const logoX = (pageWidth - logoWidth) / 2;
      pdf.addImage(img, 'PNG', logoX, 15, logoWidth, logoHeight);
      
      // School name and tagline
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text('BAYHOOD PREPARATORY SCHOOL', pageWidth/2, 85, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFont(undefined, 'bold');
      pdf.text('CRECHE | PRESCHOOL | AFTER SCHOOL', pageWidth/2, 95, { align: 'center' });
      
      // School details
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont(undefined, 'normal');
      pdf.text('Crèche | Preschool | Nursery | Afterschool', pageWidth/2, 105, { align: 'center' });
      pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, 112, { align: 'center' });
      pdf.text('Phone: 0809 811 2378', pageWidth/2, 119, { align: 'center' });
      
      // Horizontal line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(20, 130, pageWidth - 20, 130);
      
      // Receipt title and amount section
      pdf.setFontSize(18);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFont(undefined, 'bold');
      pdf.text('OFFICIAL RECEIPT', 20, 150);
      
      // Amount box on the right
      const amountBoxX = pageWidth - 80;
      const amountBoxY = 140;
      pdf.setFillColor(173, 216, 230); // Light blue
      pdf.roundedRect(amountBoxX, amountBoxY, 60, 25, 5, 5, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text('AMOUNT PAID', amountBoxX + 30, amountBoxY + 8, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(34, 197, 94); // Green
      pdf.setFont(undefined, 'bold');
      pdf.text(formatCurrency(receipt.amountPaid), amountBoxX + 30, amountBoxY + 20, { align: 'center' });
      
      // Receipt details
      pdf.setFontSize(12);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFont(undefined, 'normal');
      pdf.text('Receipt No:', 20, 170);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text(receipt.receiptNumber, 55, 170);
      
      pdf.setFontSize(12);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFont(undefined, 'normal');
      pdf.text('Date Issued:', 20, 180);
      pdf.setTextColor(34, 197, 94); // Green
      pdf.setFont(undefined, 'bold');
      pdf.text(formatDate(receipt.createdAt), 60, 180);
      
      // Student Information section
      pdf.setFillColor(240, 248, 255); // Very light blue
      pdf.roundedRect(20, 195, pageWidth - 40, 50, 5, 5, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFont(undefined, 'bold');
      pdf.text('STUDENT INFORMATION', 25, 210);
      
      // Student details in grid
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text('Student Name:', 25, 225);
      pdf.setFont(undefined, 'bold');
      pdf.text(receipt.studentName, 25, 233);
      
      pdf.setFont(undefined, 'normal');
      pdf.text('Term:', pageWidth - 80, 225);
      pdf.setTextColor(34, 197, 94); // Green
      pdf.setFont(undefined, 'bold');
      pdf.text(receipt.term, pageWidth - 80, 233);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text('Class:', 25, 245);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFont(undefined, 'bold');
      pdf.text(receipt.studentClass, 25, 253);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text('Session:', pageWidth - 80, 245);
      pdf.setTextColor(147, 51, 234); // Purple
      pdf.setFont(undefined, 'bold');
      pdf.text(receipt.session, pageWidth - 80, 253);
      
      // Payment Details section
      pdf.setFillColor(240, 253, 244); // Very light green
      pdf.roundedRect(20, 265, pageWidth - 40, 50, 5, 5, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(34, 197, 94); // Green
      pdf.setFont(undefined, 'bold');
      pdf.text('PAYMENT DETAILS', 25, 280);
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text('Payment Date:', 25, 295);
      pdf.setTextColor(34, 197, 94); // Green
      pdf.setFont(undefined, 'bold');
      pdf.text(formatDate(receipt.paymentDate), 25, 303);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text('Payment For:', 25, 315);
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFont(undefined, 'bold');
      
      // Handle long descriptions by wrapping text
      const description = receipt.description || 'School Fees';
      const maxWidth = pageWidth - 50;
      const lines = pdf.splitTextToSize(description, maxWidth);
      pdf.text(lines, 25, 323);
      
      // Footer signature line
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.line(120, 350, 180, 350);
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      pdf.text('Authorized Signature', 150, 360, { align: 'center' });
      
      // Save the PDF
      const fileName = `Receipt_${receipt.studentName.replace(/\s+/g, '_')}_${receipt.receiptNumber}.pdf`;
      pdf.save(fileName);
    };
    
    img.src = '/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4">
      {/* Action buttons - responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Receipt Preview
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
          <Button 
            onClick={onEdit}
            variant="outline"
            className="flex-1 sm:flex-none border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold text-xs sm:text-sm"
          >
            Edit Receipt
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-lg text-xs sm:text-sm"
          >
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg text-xs sm:text-sm"
          >
            Print Receipt
          </Button>
        </div>
      </div>

      {/* Receipt Card - fully responsive */}
      <Card className="w-full bg-white border-0 shadow-xl print:border-none print:shadow-none print:max-w-none">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* School Header */}
          <div className="text-center pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-gray-200">
            <div className="flex justify-center items-center mb-4 sm:mb-6">
              <img 
                src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-16 sm:h-20 lg:h-24 w-auto"
              />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              BAYHOOD PREPARATORY SCHOOL
            </h1>
            <p className="text-sm sm:text-base font-bold text-blue-600 mb-3">
              CRECHE | PRESCHOOL | AFTER SCHOOL
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Crèche | Preschool | Nursery | Afterschool
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Phone: 0809 811 2378
            </p>
          </div>

          {/* Receipt Header - responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-4">
                OFFICIAL RECEIPT
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base">
                  <span className="font-medium text-blue-600">Receipt No:</span>{' '}
                  <span className="font-bold text-gray-800">{receipt.receiptNumber}</span>
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium text-blue-600">Date Issued:</span>{' '}
                  <span className="font-bold text-green-600">{formatDate(receipt.createdAt)}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-start lg:justify-end">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 sm:p-6 rounded-xl border-2 border-blue-300 shadow-lg w-full max-w-xs">
                <h3 className="text-sm sm:text-base font-bold text-gray-700 mb-2 text-center">
                  AMOUNT PAID
                </h3>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 text-center">
                  {formatCurrency(receipt.amountPaid)}
                </p>
              </div>
            </div>
          </div>

          {/* Student Information - responsive */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8 rounded-xl border border-blue-200 mb-6 sm:mb-8 shadow-sm">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">
              STUDENT INFORMATION
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base block">Student Name:</span>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 break-words">{receipt.studentName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base block">Class:</span>
                  <p className="text-lg sm:text-xl font-bold text-blue-600">{receipt.studentClass}</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base block">Term:</span>
                  <p className="text-lg sm:text-xl font-bold text-green-600">{receipt.term}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base block">Session:</span>
                  <p className="text-lg sm:text-xl font-bold text-purple-600">{receipt.session}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details - responsive */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 lg:p-8 rounded-xl border border-green-200 mb-6 sm:mb-8 shadow-sm">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-4 sm:mb-6">
              PAYMENT DETAILS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <span className="font-medium text-gray-700 text-sm sm:text-base block">Payment Date:</span>
                <p className="text-lg sm:text-xl font-bold text-green-600">{formatDate(receipt.paymentDate)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 text-sm sm:text-base block">Payment For:</span>
                <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 break-words">
                  {receipt.description || 'School Fees'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer - responsive */}
          <div className="border-t-2 border-gray-300 pt-6 sm:pt-8">
            <div className="flex justify-center sm:justify-start">
              <div className="text-center sm:text-left">
                <div className="border-t-2 border-gray-400 pt-4 mt-8 sm:mt-12 w-32 sm:w-40">
                  <p className="text-sm sm:text-base font-bold text-gray-700">Authorized Signature</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">BAYHOOD PREPARATORY SCHOOL</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptCard;
