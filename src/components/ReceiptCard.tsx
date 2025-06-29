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
    
    // Set the image source to the new colorful logo
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
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Receipt Preview</h2>
        <div className="space-x-4">
          <Button 
            onClick={onEdit}
            variant="outline"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Edit Receipt
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-lg"
          >
            Download PDF
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
          >
            Print Receipt
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto bg-white border-0 shadow-2xl print:border-none print:shadow-none">
        <CardContent className="p-8">
          {/* School Header */}
          <div className="text-center border-b-4 border-gradient-to-r from-blue-500 to-green-500 pb-8 mb-8">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <img 
                src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-32 w-auto"
              />
            </div>
            <p className="text-gray-600 mb-2 font-medium">Crèche | Preschool | Nursery | Afterschool</p>
            <p className="text-sm text-gray-500 mb-1">House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos</p>
            <p className="text-sm text-gray-500">Phone: 0809 811 2378</p>
          </div>

          {/* Receipt Header */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4">OFFICIAL RECEIPT</h2>
              <div className="space-y-3">
                <p className="text-lg"><span className="font-semibold text-gray-700">Receipt No:</span> <span className="font-bold text-blue-600">{receipt.receiptNumber}</span></p>
                <p className="text-lg"><span className="font-semibold text-gray-700">Date Issued:</span> <span className="font-bold text-green-600">{formatDate(receipt.createdAt)}</span></p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-blue-100 via-green-100 to-blue-100 p-6 rounded-xl border-2 border-blue-200 shadow-lg">
                <h3 className="text-xl font-bold text-gray-700 mb-3">AMOUNT PAID</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{formatCurrency(receipt.amountPaid)}</p>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl border-2 border-gray-200 mb-8 shadow-md">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-6">STUDENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700 text-base">Student Name:</span>
                  <p className="text-xl font-bold text-gray-800">{receipt.studentName}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 text-base">Class:</span>
                  <p className="text-xl font-bold text-blue-600">{receipt.studentClass}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700 text-base">Term:</span>
                  <p className="text-xl font-bold text-green-600">{receipt.term}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 text-base">Session:</span>
                  <p className="text-xl font-bold text-purple-600">{receipt.session}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl border-2 border-green-200 mb-8 shadow-md">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent mb-6">PAYMENT DETAILS</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="font-semibold text-gray-700 text-base">Payment Date:</span>
                <p className="text-xl font-bold text-green-600">{formatDate(receipt.paymentDate)}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 text-base">Payment For:</span>
                <p className="text-xl font-bold text-blue-600">{receipt.description || 'School Fees'}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-t-2 border-gray-400 pt-4 mt-12">
                  <p className="text-base font-bold text-gray-700">Authorized Signature</p>
                  <p className="text-sm text-gray-500 font-medium">BAYHOOD PREPARATORY SCHOOL</p>
                </div>
              </div>
            </div>
          </div>

          {/* School Motto */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 text-white rounded-xl shadow-lg">
            <p className="font-bold text-xl">"Excellence is Our Standard"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptCard;
