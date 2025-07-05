import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt } from '@/types/receipt';
import jsPDF from 'jspdf';
import { useReceiptImageToPDF } from '@/hooks/useReceiptImageToPDF';
import { formatAmountInWords } from '@/lib/numberToWords';
import { Download } from 'lucide-react';
interface ReceiptCardProps {
  receipt: Receipt;
  onEdit: () => void;
}
const ReceiptCard = ({
  receipt,
  onEdit
}: ReceiptCardProps) => {
  const {
    downloadReceiptAsPDF
  } = useReceiptImageToPDF();
  const handlePrint = () => {
    window.print();
  };
  const handleDownloadPreviewAsPDF = async () => {
    const fileName = `${receipt.studentName.replace(/\s+/g, '_')}.pdf`;
    const success = await downloadReceiptAsPDF('receipt-preview', fileName);
    if (!success) {
      console.error('Failed to generate PDF from preview');
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  return <div className="w-full max-w-4xl mx-auto p-4">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Receipt Preview</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onEdit} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 text-sm sm:text-base">
            Edit Receipt
          </Button>
          <Button onClick={handleDownloadPreviewAsPDF} className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
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
              <img src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" alt="Bayhood Preparatory School Logo" className="h-16 sm:h-20 w-auto" />
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
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center min-w-[250px]">
              <p className="text-sm font-semibold text-slate-700 mb-2">AMOUNT PAID</p>
              <p className="text-4xl sm:text-5xl font-bold text-green-600">
                {formatCurrency(receipt.amountPaid)}
              </p>
              <p className="text-xs text-slate-600 mt-2 italic">
                ({formatAmountInWords(receipt.amountPaid)})
              </p>
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

          {/* Pupil Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-6">PUPIL INFORMATION</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Pupil Name:</span>
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
          {receipt.description && <div className="mb-8">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3">Payment Description:</h4>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                {receipt.description}
              </p>
            </div>}

          {/* Authorized Signature */}
          <div className="mt-8 mb-6 text-right">
            <div className="inline-block">
              <img src="/lovable-uploads/72861234-f1b5-4988-aa79-7f3a6829d66e.png" alt="Authorized Signature" className="h-16 w-auto mb-2" />
              <div className="text-sm text-slate-700 font-medium border-t border-slate-300 pt-2">
                Authorized Signature
              </div>
              <div className="text-xs text-slate-600 mt-1">Management</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-slate-500 italic">
            Thank you for your payment. Keep this receipt for your records.
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ReceiptCard;