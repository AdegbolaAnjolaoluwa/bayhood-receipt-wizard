
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
      // Logo
      const logoSize = 35;
      const logoX = (pageWidth - logoSize) / 2;
      pdf.addImage(img, 'PNG', logoX, yPosition, logoSize, logoSize);
      yPosition += 45;
      
      // School Name
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('BAYHOOD PREPARATORY SCHOOL', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 8;
      
      // School Details
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text('House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 5;
      pdf.text('Phone: 0809 811 2378', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Receipt Title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('OFFICIAL FEE RECEIPT', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Receipt Details Box
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(15, yPosition, pageWidth - 30, 35, 3, 3, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(15, yPosition, pageWidth - 30, 35, 3, 3, 'S');
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      // Left column
      pdf.text('Receipt No:', 20, yPosition + 10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(receiptNumber, 50, yPosition + 10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Date:', 20, yPosition + 20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(currentDate, 50, yPosition + 20);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment Method:', 20, yPosition + 30);
      pdf.setFont('helvetica', 'bold');
      pdf.text(paymentMethod, 60, yPosition + 30);
      
      // Right column
      pdf.setFont('helvetica', 'normal');
      pdf.text('Issued By:', pageWidth - 80, yPosition + 10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(issuedBy, pageWidth - 50, yPosition + 10);
      
      yPosition += 50;
      
      // Student Information
      pdf.setFillColor(59, 130, 246);
      pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('STUDENT INFORMATION', 20, yPosition + 6);
      yPosition += 15;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Student details in two columns
      pdf.text('Student Name:', 20, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(studentName, 55, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Class:', pageWidth - 80, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(studentClass, pageWidth - 55, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Term:', 20, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(term, 40, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Session:', pageWidth - 80, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(session, pageWidth - 50, yPosition);
      yPosition += 20;
      
      // Fee Breakdown
      pdf.setFillColor(34, 197, 94);
      pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FEE BREAKDOWN', 20, yPosition + 6);
      yPosition += 15;
      
      // Table headers
      pdf.setFillColor(248, 250, 252);
      pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('S/N', 20, yPosition + 6);
      pdf.text('DESCRIPTION', 35, yPosition + 6);
      pdf.text('AMOUNT (₦)', pageWidth - 40, yPosition + 6);
      yPosition += 12;
      
      // Fee items
      pdf.setFont('helvetica', 'normal');
      feeCategories.forEach((fee, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text((index + 1).toString(), 20, yPosition);
        pdf.text(fee.name, 35, yPosition);
        pdf.text(fee.amount.toLocaleString(), pageWidth - 40, yPosition, { align: 'right' });
        yPosition += 8;
      });
      
      yPosition += 5;
      
      // Total
      pdf.setDrawColor(0, 0, 0);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;
      
      pdf.setFillColor(34, 197, 94);
      pdf.rect(15, yPosition, pageWidth - 30, 12, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL AMOUNT PAID:', 20, yPosition + 8);
      pdf.text(formatCurrency(totalAmount), pageWidth - 20, yPosition + 8, { align: 'right' });
      yPosition += 20;
      
      // Status
      pdf.setTextColor(34, 197, 94);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('✓ PAID IN FULL', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Footer
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text('"Thank you for your payment. Education is the best investment."', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 8;
      pdf.text('School Motto: "Discipline, Knowledge, Excellence."', pageWidth/2, yPosition, { align: 'center' });
      
      // Save
      const fileName = `Receipt_${studentName.replace(/\s+/g, '_')}_${receiptNumber}.pdf`;
      pdf.save(fileName);
    };
    
    img.src = '/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png';
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
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              BAYHOOD PREPARATORY SCHOOL
            </h1>
            <div className="text-xs sm:text-sm text-slate-600 space-y-1">
              <p>House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos</p>
              <p>Phone: 0809 811 2378</p>
            </div>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-600 bg-blue-50 py-3 px-6 rounded-lg inline-block">
              OFFICIAL FEE RECEIPT
            </h2>
          </div>

          {/* Receipt Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="block text-slate-600 font-medium text-sm mb-1">Receipt No:</span>
                <span className="font-bold text-slate-900">{receiptNumber}</span>
              </div>
              <div>
                <span className="block text-slate-600 font-medium text-sm mb-1">Date:</span>
                <span className="font-bold text-slate-900">{currentDate}</span>
              </div>
              <div>
                <span className="block text-slate-600 font-medium text-sm mb-1">Payment Method:</span>
                <span className="font-bold text-slate-900">{paymentMethod}</span>
              </div>
              <div className="sm:col-start-2 lg:col-start-1">
                <span className="block text-slate-600 font-medium text-sm mb-1">Issued By:</span>
                <span className="font-bold text-slate-900">{issuedBy}</span>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="mb-8">
            <div className="bg-blue-600 text-white p-3 rounded-t-lg">
              <h3 className="font-bold text-lg">STUDENT INFORMATION</h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 border-t-0 rounded-b-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Student Name:</span>
                  <span className="font-bold text-blue-700 text-lg">{studentName}</span>
                </div>
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Class:</span>
                  <span className="font-bold text-blue-700 text-lg">{studentClass}</span>
                </div>
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Term:</span>
                  <span className="font-bold text-blue-700 text-lg">{term}</span>
                </div>
                <div>
                  <span className="block text-slate-700 font-medium text-sm mb-1">Session:</span>
                  <span className="font-bold text-blue-700 text-lg">{session}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="mb-8">
            <div className="bg-green-600 text-white p-3 rounded-t-lg">
              <h3 className="font-bold text-lg">FEE BREAKDOWN</h3>
            </div>
            <div className="bg-white border border-green-200 border-t-0 rounded-b-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-100 border-b border-slate-200 p-3 grid grid-cols-12 gap-2 font-bold text-sm">
                <div className="col-span-1 text-center">S/N</div>
                <div className="col-span-7 sm:col-span-8">DESCRIPTION</div>
                <div className="col-span-4 sm:col-span-3 text-right">AMOUNT (₦)</div>
              </div>
              
              {/* Fee Items */}
              {feeCategories.map((fee, index) => (
                <div key={index} className="border-b border-slate-100 p-3 grid grid-cols-12 gap-2 hover:bg-slate-50 text-sm">
                  <div className="col-span-1 text-center font-medium">{index + 1}</div>
                  <div className="col-span-7 sm:col-span-8 font-medium">{fee.name}</div>
                  <div className="col-span-4 sm:col-span-3 text-right font-bold">{fee.amount.toLocaleString()}</div>
                </div>
              ))}
              
              {/* Total */}
              <div className="bg-green-600 text-white p-4 grid grid-cols-12 gap-2 font-bold text-lg">
                <div className="col-span-8 sm:col-span-9">TOTAL AMOUNT PAID:</div>
                <div className="col-span-4 sm:col-span-3 text-right">{formatCurrency(totalAmount)}</div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-lg border border-green-300">
              <span className="text-2xl mr-2">✅</span>
              <span className="font-bold text-lg">PAID IN FULL</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3 pt-8 border-t border-slate-200">
            <p className="text-slate-700 italic text-sm sm:text-base">
              "Thank you for your payment. Education is the best investment."
            </p>
            <p className="text-slate-600 italic text-xs sm:text-sm font-medium">
              School Motto: "Discipline, Knowledge, Excellence."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedReceiptCard;
