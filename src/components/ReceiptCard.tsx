
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
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Load and add the logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      // Add logo centered at the top
      const logoWidth = 50;
      const logoHeight = 50;
      const logoX = (pageWidth - logoWidth) / 2;
      pdf.addImage(img, 'PNG', logoX, 10, logoWidth, logoHeight);
      
      // School name - bold and centered
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BAYHOOD PREPARATORY SCHOOL', pageWidth/2, 70, { align: 'center' });
      
      // Tagline - smaller, colored
      pdf.setFontSize(10);
      pdf.setTextColor(0, 100, 200);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CRECHE | PRESCHOOL | AFTER SCHOOL', pageWidth/2, 78, { align: 'center' });
      
      // School address and contact
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.setFont('helvetica', 'normal');
      pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, 86, { align: 'center' });
      pdf.text('Phone: 0809 811 2378', pageWidth/2, 92, { align: 'center' });
      
      // Divider line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(15, 100, pageWidth - 15, 100);
      
      // Receipt title
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OFFICIAL RECEIPT', pageWidth/2, 115, { align: 'center' });
      
      // Receipt details section
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Left column
      pdf.text('Receipt No:', 20, 135);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receipt.receiptNumber, 55, 135);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date:', 20, 145);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatDate(receipt.createdAt), 55, 145);
      
      // Right column
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment Date:', 110, 135);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatDate(receipt.paymentDate), 155, 135);
      
      // Student information box
      pdf.setFillColor(248, 249, 250);
      pdf.roundedRect(15, 160, pageWidth - 30, 45, 3, 3, 'F');
      pdf.setDrawColor(220, 220, 220);
      pdf.roundedRect(15, 160, pageWidth - 30, 45, 3, 3, 'S');
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('STUDENT INFORMATION', 20, 175);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Student details in two columns
      pdf.text('Student Name:', 20, 185);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receipt.studentName, 20, 193);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Class:', 110, 185);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receipt.studentClass, 110, 193);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Term:', 20, 203);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receipt.term, 20, 211);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Session:', 110, 203);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receipt.session, 110, 211);
      
      // Payment details section
      pdf.setFillColor(240, 255, 240);
      pdf.roundedRect(15, 220, pageWidth - 30, 35, 3, 3, 'F');
      pdf.setDrawColor(200, 230, 200);
      pdf.roundedRect(15, 220, pageWidth - 30, 35, 3, 3, 'S');
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAYMENT DETAILS', 20, 235);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment For:', 20, 245);
      pdf.setFont('helvetica', 'bold');
      const description = receipt.description || 'School Fees';
      const lines = pdf.splitTextToSize(description, pageWidth - 50);
      pdf.text(lines, 20, 253);
      
      // Amount section - prominent
      pdf.setFillColor(255, 248, 220);
      pdf.roundedRect(15, 270, pageWidth - 30, 25, 3, 3, 'F');
      pdf.setDrawColor(255, 193, 7);
      pdf.setLineWidth(1);
      pdf.roundedRect(15, 270, pageWidth - 30, 25, 3, 3, 'S');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('AMOUNT PAID:', 20, 285);
      
      pdf.setFontSize(18);
      pdf.setTextColor(0, 150, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatCurrency(receipt.amountPaid), pageWidth - 20, 285, { align: 'right' });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Thank you for your payment. Keep this receipt for your records.', pageWidth/2, pageHeight - 30, { align: 'center' });
      
      // Signature line
      pdf.setDrawColor(150, 150, 150);
      pdf.line(pageWidth - 80, pageHeight - 45, pageWidth - 20, pageHeight - 45);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Authorized Signature', pageWidth - 50, pageHeight - 38, { align: 'center' });
      
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
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Receipt Preview</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onEdit}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Edit Receipt
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Print Receipt
          </Button>
        </div>
      </div>

      {/* Receipt Card */}
      <Card className="bg-white shadow-lg print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              BAYHOOD PREPARATORY SCHOOL
            </h1>
            <p className="text-sm font-semibold text-blue-600 mb-3">
              CRECHE | PRESCHOOL | AFTER SCHOOL
            </p>
            <p className="text-xs text-gray-600 mb-1">
              House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos
            </p>
            <p className="text-xs text-gray-600">
              Phone: 0809 811 2378
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 mb-6"></div>

          {/* Receipt Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">OFFICIAL RECEIPT</h2>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="text-gray-600">Receipt No:</span>
              <span className="font-bold ml-2 text-gray-900">{receipt.receiptNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Payment Date:</span>
              <span className="font-bold ml-2 text-gray-900">{formatDate(receipt.paymentDate)}</span>
            </div>
            <div>
              <span className="text-gray-600">Date Issued:</span>
              <span className="font-bold ml-2 text-gray-900">{formatDate(receipt.createdAt)}</span>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">STUDENT INFORMATION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">Student Name:</span>
                <span className="font-bold text-gray-900">{receipt.studentName}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Class:</span>
                <span className="font-bold text-gray-900">{receipt.studentClass}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Term:</span>
                <span className="font-bold text-gray-900">{receipt.term}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Session:</span>
                <span className="font-bold text-gray-900">{receipt.session}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-green-50 p-6 rounded-lg mb-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">PAYMENT DETAILS</h3>
            <div className="text-sm">
              <span className="text-gray-600 block mb-2">Payment For:</span>
              <span className="font-bold text-gray-900">{receipt.description || 'School Fees'}</span>
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-yellow-50 p-6 rounded-lg mb-8 border border-yellow-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">AMOUNT PAID:</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(receipt.amountPaid)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mb-6">
            Thank you for your payment. Keep this receipt for your records.
          </div>

          {/* Signature */}
          <div className="flex justify-end">
            <div className="text-center">
              <div className="border-t border-gray-400 w-32 mb-2"></div>
              <p className="text-xs text-gray-600">Authorized Signature</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptCard;
