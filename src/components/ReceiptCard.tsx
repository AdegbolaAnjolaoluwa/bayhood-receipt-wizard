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
    
    // Set up fonts and colors
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    
    // School Header
    pdf.text('BAYHOOD PREPARATORY SCHOOL', pageWidth/2, 30, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Excellence in Education • Character Building • Academic Excellence', pageWidth/2, 40, { align: 'center' });
    pdf.text('123 Education Street, Lagos, Nigeria | Tel: +234-XXX-XXXX-XXX', pageWidth/2, 50, { align: 'center' });
    
    // Receipt Title
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 127); // Red color
    pdf.text('OFFICIAL RECEIPT', 20, 70);
    
    // Receipt Details
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Receipt No: ${receipt.receiptNumber}`, 20, 90);
    pdf.text(`Date Issued: ${formatDate(receipt.createdAt)}`, 20, 100);
    
    // Amount Box
    pdf.setFontSize(14);
    pdf.text('AMOUNT PAID', pageWidth - 60, 90, { align: 'center' });
    pdf.setFontSize(16);
    pdf.setTextColor(34, 197, 94); // Green color
    pdf.text(formatCurrency(receipt.amountPaid), pageWidth - 60, 105, { align: 'center' });
    
    // Student Information
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('STUDENT INFORMATION', 20, 130);
    pdf.setFontSize(12);
    pdf.text(`Student Name: ${receipt.studentName}`, 20, 145);
    pdf.text(`Class: ${receipt.studentClass}`, 20, 155);
    pdf.text(`Term: ${receipt.term}`, 20, 165);
    pdf.text(`Session: ${receipt.session}`, 20, 175);
    
    // Payment Details
    pdf.setFontSize(14);
    pdf.text('PAYMENT DETAILS', 20, 195);
    pdf.setFontSize(12);
    pdf.text(`Payment Date: ${formatDate(receipt.paymentDate)}`, 20, 210);
    pdf.text('Payment Type: School Fees', 20, 220);
    
    // Footer
    pdf.setFontSize(10);
    pdf.text('This receipt is computer generated and valid without signature.', 20, 250);
    pdf.text(`Generated on: ${formatDate(receipt.createdAt)}`, 20, 260);
    
    // School Motto
    pdf.setFontSize(12);
    pdf.text('"Excellence is Our Standard"', pageWidth/2, 280, { align: 'center' });
    
    // Save the PDF with student name and class
    const fileName = `Receipt_${receipt.studentName.replace(/\s+/g, '_')}_${receipt.studentClass.replace(/\s+/g, '_')}_${receipt.receiptNumber}.pdf`;
    pdf.save(fileName);
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">BPS</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">BAYHOOD PREPARATORY SCHOOL</h1>
            <p className="text-gray-600 mb-2">Excellence in Education • Character Building • Academic Excellence</p>
            <p className="text-sm text-gray-500">123 Education Street, Lagos, Nigeria | Tel: +234-XXX-XXXX-XXX</p>
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
                <span className="font-semibold text-gray-700">Payment Type:</span>
                <p className="text-lg font-semibold text-green-800">School Fees</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  This receipt is computer generated and valid without signature.
                </p>
                <p className="text-xs text-gray-500">
                  Generated on: {formatDate(receipt.createdAt)}
                </p>
              </div>
              <div className="text-right">
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
