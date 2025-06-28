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
      // Add logo centered at the top - made much larger
      const logoWidth = 80;
      const logoHeight = 80;
      const logoX = (pageWidth - logoWidth) / 2;
      pdf.addImage(img, 'PNG', logoX, 10, logoWidth, logoHeight);
      
      // School contact information below logo
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99); // Gray color
      pdf.text('Crèche | Preschool | Nursery | Afterschool', pageWidth/2, 100, { align: 'center' });
      pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, 107, { align: 'center' });
      pdf.text('Phone: 0809 811 2378', pageWidth/2, 114, { align: 'center' });
      
      // Add a decorative border line
      pdf.setDrawColor(251, 146, 60); // Orange color
      pdf.setLineWidth(2);
      pdf.line(15, 120, pageWidth - 15, 120);
      
      // Receipt Title with colorful background
      pdf.setFillColor(251, 146, 60); // Orange background
      pdf.roundedRect(15, 125, pageWidth - 30, 18, 3, 3, 'F');
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255); // White text
      pdf.text('OFFICIAL RECEIPT', pageWidth/2, 137, { align: 'center' });
      
      // Receipt details section with blue background
      pdf.setFillColor(219, 234, 254); // Light blue background
      pdf.roundedRect(15, 150, (pageWidth - 30) * 0.6, 35, 3, 3, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(37, 99, 235); // Blue text
      pdf.text('Receipt Details:', 20, 160);
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Receipt No: ${receipt.receiptNumber}`, 20, 170);
      pdf.text(`Date Issued: ${formatDate(receipt.createdAt)}`, 20, 178);
      
      // Amount box with orange styling
      const amountBoxX = pageWidth - 80;
      pdf.setFillColor(254, 215, 170); // Light orange background
      pdf.roundedRect(amountBoxX, 150, 65, 35, 3, 3, 'F');
      pdf.setDrawColor(251, 146, 60); // Orange border
      pdf.setLineWidth(2);
      pdf.roundedRect(amountBoxX, 150, 65, 35, 3, 3, 'S');
      
      pdf.setFontSize(10);
      pdf.setTextColor(251, 146, 60); // Orange text
      pdf.text('AMOUNT PAID', amountBoxX + 32.5, 160, { align: 'center' });
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text(formatCurrency(receipt.amountPaid), amountBoxX + 32.5, 175, { align: 'center' });
      pdf.setFont(undefined, 'normal');
      
      // Student Information section with gradient-like background
      pdf.setFillColor(243, 244, 246); // Light gray background
      pdf.roundedRect(15, 195, pageWidth - 30, 50, 3, 3, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(37, 99, 235); // Blue color
      pdf.setFont(undefined, 'bold');
      pdf.text('STUDENT INFORMATION', 20, 210);
      pdf.setFont(undefined, 'normal');
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Student Name:', 20, 220);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.studentName, 55, 220);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Class:', 20, 230);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.studentClass, 40, 230);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Term:', pageWidth - 80, 220);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.term, pageWidth - 60, 220);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Session:', pageWidth - 80, 230);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(receipt.session, pageWidth - 50, 230);
      
      // Payment Details section with orange styling
      pdf.setFillColor(254, 215, 170); // Light orange background
      pdf.roundedRect(15, 255, pageWidth - 30, 40, 3, 3, 'F');
      
      pdf.setFontSize(14);
      pdf.setTextColor(251, 146, 60); // Orange color
      pdf.setFont(undefined, 'bold');
      pdf.text('PAYMENT DETAILS', 20, 270);
      pdf.setFont(undefined, 'normal');
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Payment Date:', 20, 280);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(251, 146, 60);
      pdf.text(formatDate(receipt.paymentDate), 60, 280);
      
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Payment For:', 20, 288);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(251, 146, 60);
      pdf.text(receipt.description || 'School Fees', 58, 288);
      
      // School Motto with blue gradient-like background
      pdf.setFillColor(37, 99, 235); // Blue background
      pdf.roundedRect(15, 305, pageWidth - 30, 15, 3, 3, 'F');
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255); // White text
      pdf.setFont(undefined, 'bold');
      pdf.text('"Excellence is Our Standard"', pageWidth/2, 315, { align: 'center' });
      
      // Save the PDF with student name and class
      const fileName = `Receipt_${receipt.studentName.replace(/\s+/g, '_')}_${receipt.studentClass.replace(/\s+/g, '_')}_${receipt.receiptNumber}.pdf`;
      pdf.save(fileName);
    };
    
    // Set the image source to the new logo
    img.src = '/lovable-uploads/0054f70d-58c4-4fcc-bd7c-426a6f6d8b13.png';
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
        <h2 className="text-2xl font-bold text-orange-600">Receipt Preview</h2>
        <div className="space-x-4">
          <Button 
            onClick={onEdit}
            variant="outline"
            className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Edit Receipt
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
          >
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
          >
            Print Receipt
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto bg-white border-2 border-gray-300 print:border-none print:shadow-none">
        <CardContent className="p-8">
          {/* School Header */}
          <div className="text-center border-b-4 border-gradient-to-r from-orange-500 to-blue-600 pb-6 mb-8">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <img 
                src="/lovable-uploads/0054f70d-58c4-4fcc-bd7c-426a6f6d8b13.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-orange-600 mb-2">BAYHOOD PREPARATORY SCHOOL</h1>
            <p className="text-gray-600 mb-2">Crèche | Preschool | Nursery | Afterschool</p>
            <p className="text-sm text-gray-500 mb-1">House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos</p>
            <p className="text-sm text-gray-500">Phone: 0809 811 2378</p>
          </div>

          {/* Receipt Header */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-orange-600 mb-4">OFFICIAL RECEIPT</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Receipt No:</span> {receipt.receiptNumber}</p>
                <p><span className="font-semibold">Date Issued:</span> {formatDate(receipt.createdAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-4 rounded-lg border-2 border-orange-200">
                <h3 className="text-lg font-bold text-orange-600 mb-2">AMOUNT PAID</h3>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(receipt.amountPaid)}</p>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-orange-600 mb-4">STUDENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Student Name:</span>
                  <p className="text-lg font-semibold text-blue-600">{receipt.studentName}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Class:</span>
                  <p className="text-lg font-semibold text-blue-600">{receipt.studentClass}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Term:</span>
                  <p className="text-lg font-semibold text-blue-600">{receipt.term}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Session:</span>
                  <p className="text-lg font-semibold text-blue-600">{receipt.session}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg border-2 border-orange-200 mb-8">
            <h3 className="text-xl font-bold text-orange-600 mb-4">PAYMENT DETAILS</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="font-semibold text-gray-700">Payment Date:</span>
                <p className="text-lg font-semibold text-orange-600">{formatDate(receipt.paymentDate)}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Payment For:</span>
                <p className="text-lg font-semibold text-orange-600">{receipt.description || 'School Fees'}</p>
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
          <div className="text-center mt-8 p-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg">
            <p className="font-bold text-lg">"Excellence is Our Standard"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptCard;
