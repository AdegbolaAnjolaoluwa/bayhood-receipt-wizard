
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
      // Add logo centered at the top - made larger
      const logoWidth = 50;
      const logoHeight = 50;
      const logoX = (pageWidth - logoWidth) / 2;
      pdf.addImage(img, 'PNG', logoX, 15, logoWidth, logoHeight);
      
      // School contact information below logo
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99); // Gray color
      pdf.text('Crèche | Preschool | Nursery | Afterschool', pageWidth/2, 75, { align: 'center' });
      pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, 82, { align: 'center' });
      pdf.text('Phone: 0809 811 2378', pageWidth/2, 89, { align: 'center' });
      
      // Add a decorative border line
      pdf.setDrawColor(59, 130, 246); // Blue color
      pdf.setLineWidth(2);
      pdf.line(15, 95, pageWidth - 15, 95);
      
      // Receipt Title with colorful background
      pdf.setFillColor(239, 68, 68); // Red background
      pdf.roundedRect(15, 100, pageWidth - 30, 18, 3, 3, 'F');
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255); // White text
      pdf.text('OFFICIAL RECEIPT', pageWidth/2, 112, { align: 'center' });
      
      // Receipt details section with blue background
      pdf.setFillColor(219, 234, 254); // Light blue background
      pdf.roundedRect(15, 125, (pageWidth - 30) * 0.6, 35, 3, 3, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(37, 99, 235); // Blue text
      pdf.text('Receipt Details:', 20, 135);
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Receipt No: ${receipt.receiptNumber}`, 20, 145);
      pdf.text(`Date Issued: ${formatDate(receipt.createdAt)}`, 20, 153);
      
      // Amount box with green styling
      const amountBoxX = pageWidth - 80;
      pdf.setFillColor(220, 252, 231); // Light green background
      pdf.roundedRect(amountBoxX, 125, 65, 35, 3, 3, 'F');
      pdf.setDrawColor(34, 197, 94); // Green border
      pdf.setLineWidth(2);
      pdf.roundedRect(amountBoxX, 125, 65, 35, 3, 3, 'S');
      
      pdf.setFontSize(10);
      pdf.setTextColor(34, 197, 94); // Green text
      pdf.text('AMOUNT PAID', amountBoxX + 32.5, 135, { align: 'center' });
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(formatCurrency(receipt.amountPaid), amountBoxX + 32.5, 150, { align: 'center' });
      pdf.setFont(undefined, 'normal');
      
      // Student Information section with gradient-like background
      pdf.setFillColor(243, 244, 246); // Light gray background
      pdf.roundedRect(15, 170, pageWidth - 30, 50, 3, 3, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(37, 99, 235); // Blue color
      pdf.setFont(undefined, 'bold');
      pdf.text('STUDENT INFORMATION', 20, 185);
      pdf.setFont(undefined, 'normal');
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Student Name:', 20, 195);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.studentName, 55, 195);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Class:', 20, 205);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.studentClass, 40, 205);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Term:', pageWidth - 80, 195);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.term, pageWidth - 60, 195);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Session:', pageWidth - 80, 205);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.session, pageWidth - 50, 205);
      
      // Payment Details section with green styling
      pdf.setFillColor(240, 253, 244); // Light green background
      pdf.roundedRect(15, 230, pageWidth - 30, 40, 3, 3, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(34, 197, 94); // Green color
      pdf.setFont(undefined, 'bold');
      pdf.text('PAYMENT DETAILS', 20, 245);
      pdf.setFont(undefined, 'normal');
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Payment Date:', 20, 255);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(34, 197, 94);
      pdf.text(formatDate(receipt.paymentDate), 60, 255);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Payment For:', 20, 263);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(34, 197, 94);
      pdf.text(receipt.description || 'School Fees', 58, 263);
      
      // School Motto with blue gradient-like background
      pdf.setFillColor(59, 130, 246); // Blue background
      pdf.roundedRect(15, 280, pageWidth - 30, 15, 3, 3, 'F');
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFont(undefined, 'bold');
      pdf.text('"Excellence is Our Standard"', pageWidth/2, 290, { align: 'center' });
      
      // Save the PDF with student name and class
      const fileName = `Receipt_${receipt.studentName.replace(/\s+/g, '_')}_${receipt.studentClass.replace(/\s+/g, '_')}_${receipt.receiptNumber}.pdf`;
      pdf.save(fileName);
    };
    
    // Set the image source to the logo
    img.src = '/lovable-uploads/078af04c-c3bd-4605-9cee-39fb18d92842.png';
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
    <div className="space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-blue-800">Receipt Preview</h2>
        <div className="space-x-4">
          <Button 
            onClick={onEdit}
            variant="outline"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Edit Receipt
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
          >
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            Print Receipt
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto bg-white border-2 border-gray-300 print:border-none print:shadow-none">
        <CardContent className="p-8">
          {/* School Header */}
          <div className="text-center border-b-4 border-gradient-to-r from-blue-600 to-green-600 pb-6 mb-8">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <img 
                src="/lovable-uploads/078af04c-c3bd-4605-9cee-39fb18d92842.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">BAYHOOD PREPARATORY SCHOOL</h1>
            <p className="text-gray-600 mb-2">Crèche | Preschool | Nursery | Afterschool</p>
            <p className="text-sm text-gray-500 mb-1">House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos</p>
            <p className="text-sm text-gray-500">Phone: 0809 811 2378</p>
          </div>

          {/* Receipt Header */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">OFFICIAL RECEIPT</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Receipt No:</span> {receipt.receiptNumber}</p>
                <p><span className="font-semibold">Date Issued:</span> {formatDate(receipt.createdAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-lg border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-2">AMOUNT PAID</h3>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(receipt.amountPaid)}</p>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4">STUDENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Student Name:</span>
                  <p className="text-lg font-semibold text-blue-800">{receipt.studentName}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Class:</span>
                  <p className="text-lg font-semibold text-blue-800">{receipt.studentClass}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Term:</span>
                  <p className="text-lg font-semibold text-blue-800">{receipt.term}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Session:</span>
                  <p className="text-lg font-semibold text-blue-800">{receipt.session}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200 mb-8">
            <h3 className="text-xl font-bold text-green-800 mb-4">PAYMENT DETAILS</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="font-semibold text-gray-700">Payment Date:</span>
                <p className="text-lg font-semibold text-green-800">{formatDate(receipt.paymentDate)}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Payment For:</span>
                <p className="text-lg font-semibold text-green-800">{receipt.description || 'School Fees'}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-t border-gray-400 pt-2 mt-8">
                  <p className="text-sm font-semibold">Authorized Signature</p>
                  <p className="text-xs text-gray-500">BAYHOOD PREPARATORY SCHOOL</p>
                </div>
              </div>
            </div>
          </div>

          {/* School Motto */}
          <div className="text-center mt-8 p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg">
            <p className="font-bold text-lg">"Excellence is Our Standard"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptCard;
