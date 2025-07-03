
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt } from '@/types/receipt';
import jsPDF from 'jspdf';
import { useReceiptImageToPDF } from '@/hooks/useReceiptImageToPDF';
import { formatAmountInWords } from '@/lib/numberToWords';

interface ReceiptCardProps {
  receipt: Receipt;
  onEdit: () => void;
}

const ReceiptCard = ({ receipt, onEdit }: ReceiptCardProps) => {
  const { downloadReceiptAsPDF } = useReceiptImageToPDF();
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPreviewAsPDF = async () => {
    const fileName = `Receipt_Preview_${receipt.studentName.replace(/\s+/g, '_')}_${receipt.receiptNumber}.pdf`;
    const success = await downloadReceiptAsPDF('receipt-preview', fileName);
    
    if (!success) {
      console.error('Failed to generate PDF from preview');
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Add logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      // Logo centered at top
      const logoSize = 40;
      const logoX = (pageWidth - logoSize) / 2;
      pdf.addImage(img, 'PNG', logoX, 15, logoSize, logoSize);
      
      // School name - large and bold
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('BAYHOOD PREPARATORY SCHOOL', pageWidth/2, 65, { align: 'center' });
      
      // Tagline - blue and smaller
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('CRECHE | PRESCHOOL | AFTER SCHOOL', pageWidth/2, 75, { align: 'center' });
      
      // Address and contact - smaller gray text
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Creche | Preschool | Nursery | Afterschool', pageWidth/2, 85, { align: 'center' });
      pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, 92, { align: 'center' });
      pdf.text('Phone: 0809 811 2378', pageWidth/2, 99, { align: 'center' });
      
      // Divider line
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.line(20, 110, pageWidth - 20, 110);
      
      // Two-column layout for receipt info and amount
      // Left side - Receipt info
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('OFFICIAL RECEIPT', 25, 130);
      
      // Amount box on the right
      pdf.setFillColor(224, 242, 254);
      pdf.roundedRect(pageWidth - 85, 115, 65, 25, 5, 5, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AMOUNT PAID', pageWidth - 52, 125, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatCurrency(receipt.amountPaid), pageWidth - 52, 135, { align: 'center' });
      
      // Receipt details
      pdf.setFontSize(10);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont('helvetica', 'normal');
      
      pdf.text('Receipt No:', 25, 150);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receipt.receiptNumber, 70, 150);
      
      pdf.setTextColor(59, 130, 246);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date Issued:', 25, 160);
      pdf.setTextColor(34, 197, 94);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatDate(receipt.paymentDate), 70, 160);
      
      // Student Information section
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(20, 175, pageWidth - 40, 50, 5, 5, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(20, 175, pageWidth - 40, 50, 5, 5, 'S');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('STUDENT INFORMATION', 25, 190);
      
      pdf.setFontSize(10);
      
      // Two columns for student info
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Student Name:', 25, 205);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text(receipt.studentName, 25, 213);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Term:', 110, 205);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(34, 197, 94);
      pdf.text(receipt.term, 110, 213);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Class:', 25, 223);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text(receipt.studentClass, 25, 231);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Session:', 110, 223);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(147, 51, 234);
      pdf.text(receipt.session, 110, 231);
      
      // Payment description
      if (receipt.description) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Payment Description:', 25, 250);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(75, 85, 99);
        const descLines = pdf.splitTextToSize(receipt.description, pageWidth - 50);
        pdf.text(descLines, 25, 260);
      }
      
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
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Receipt Preview</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onEdit}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 text-sm sm:text-base"
          >
            Edit Receipt
          </Button>
          <Button 
            onClick={handleDownloadPreviewAsPDF}
            className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
          >
            Download Preview PDF
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50 text-sm sm:text-base"
          >
            Generate PDF
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
      <Card className="bg-white shadow-xl border-0 print:shadow-none">
        <CardContent id="receipt-preview" className="p-6 sm:p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              BAYHOOD PREPARATORY SCHOOL
            </h1>
            <p className="text-sm sm:text-base font-bold text-blue-600 mb-4">
              CRECHE | PRESCHOOL | AFTER SCHOOL
            </p>
            <div className="text-xs sm:text-sm text-slate-600 space-y-1">
              <p>Creche | Preschool | Nursery | Afterschool</p>
              <p>House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos</p>
              <p>Phone: 0809 811 2378</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-300 mb-8"></div>

          {/* Receipt Header with Amount */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600">OFFICIAL RECEIPT</h2>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center min-w-[200px]">
              <p className="text-sm font-semibold text-slate-700 mb-1">AMOUNT PAID</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{formatCurrency(receipt.amountPaid)}</p>
              <p className="text-xs text-slate-600 mt-2 italic">({formatAmountInWords(receipt.amountPaid)})</p>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-blue-600 font-medium text-sm sm:text-base">Receipt No:</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">{receipt.receiptNumber}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-blue-600 font-medium text-sm sm:text-base">Date Issued:</span>
                <span className="font-bold text-green-600 text-sm sm:text-base">{formatDate(receipt.paymentDate)}</span>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-6">STUDENT INFORMATION</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Student Name:</span>
                  <span className="font-bold text-blue-600 text-base sm:text-lg">{receipt.studentName}</span>
                </div>
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Class:</span>
                  <span className="font-bold text-blue-600 text-base sm:text-lg">{receipt.studentClass}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Term:</span>
                  <span className="font-bold text-green-600 text-base sm:text-lg">{receipt.term}</span>
                </div>
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Session:</span>
                  <span className="font-bold text-purple-600 text-base sm:text-lg">{receipt.session}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Description */}
          {receipt.description && (
            <div className="mb-8">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3">Payment Description:</h4>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                {receipt.description}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-slate-500 italic mt-8">
            Thank you for your payment. Keep this receipt for your records.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptCard;
