
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useReceiptPDF } from '@/hooks/useReceiptPDF';
import ReceiptHeader from '@/components/receipt/ReceiptHeader';
import ReceiptDetails from '@/components/receipt/ReceiptDetails';
import StudentInfoSection from '@/components/receipt/StudentInfoSection';
import PaymentDescriptionSection from '@/components/receipt/PaymentDescriptionSection';

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

  const { generatePDF } = useReceiptPDF();

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generatePDF({
      studentName,
      studentClass,
      term,
      session,
      paymentMethod,
      totalAmount,
      receiptNumber,
      currentDate
    });
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
        </div>
      </div>

      {/* Receipt Card */}
      <Card className="bg-white shadow-xl border-0 print:shadow-none print-area">
        <CardContent className="p-6 sm:p-8 lg:p-12">
          <ReceiptHeader 
            logoSrc="/lovable-uploads/ca706d69-cfe9-4cc0-80e4-21dcb229992a.png"
            schoolName="BAYHOOD PREPARATORY SCHOOL"
            tagline="CRECHE | PRESCHOOL | AFTER SCHOOL"
            address="House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos"
            phone="0809 811 2378"
          />

          <ReceiptDetails 
            receiptNumber={receiptNumber}
            currentDate={currentDate}
            totalAmount={totalAmount}
          />

          <StudentInfoSection 
            studentName={studentName}
            studentClass={studentClass}
            term={term}
            session={session}
          />

          <PaymentDescriptionSection 
            studentName={studentName}
            totalAmount={totalAmount}
            paymentMethod={paymentMethod}
          />

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
