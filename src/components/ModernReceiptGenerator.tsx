import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useModernReceiptPDF } from '@/hooks/useModernReceiptPDF';
import { useReceiptImageToPDF } from '@/hooks/useReceiptImageToPDF';
import { Download, FileText, Image } from 'lucide-react';

interface ReceiptData {
  payerName: string;
  paymentAmount: number;
  paymentDate: string;
  purpose: string;
  studentClass: string;
  term: string;
  session: string;
  receiptNumber: string;
  customFields: { [key: string]: string };
}

const ModernReceiptGenerator = () => {
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    payerName: '',
    paymentAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    purpose: '',
    studentClass: '',
    term: '',
    session: '',
    receiptNumber: '',
    customFields: {}
  });

  const { generateModernPDF } = useModernReceiptPDF();
  const { downloadReceiptAsPDF } = useReceiptImageToPDF();

  const generateReceiptNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BPS-${timestamp}-${random}`;
  };

  const handleInputChange = (field: keyof ReceiptData, value: string | number) => {
    setReceiptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    setReceiptData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [key]: value
      }
    }));
  };

  const handleGenerateReceipt = () => {
    if (!receiptData.receiptNumber) {
      setReceiptData(prev => ({ ...prev, receiptNumber: generateReceiptNumber() }));
    }
    
    generateModernPDF(receiptData);
  };

  const handleDownloadPreviewAsPDF = async () => {
    let finalReceiptNumber = receiptData.receiptNumber;
    if (!finalReceiptNumber) {
      finalReceiptNumber = generateReceiptNumber();
      setReceiptData(prev => ({ ...prev, receiptNumber: finalReceiptNumber }));
    }
    
    const fileName = `Receipt_Preview_${receiptData.payerName.replace(/\s+/g, '_')}_${finalReceiptNumber}.pdf`;
    const success = await downloadReceiptAsPDF('receipt-preview', fileName);
    
    if (!success) {
      // Fallback to showing an error or alternative action
      console.error('Failed to generate PDF from preview');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const isFormValid = () => {
    return receiptData.payerName && 
           receiptData.paymentAmount > 0 && 
           receiptData.purpose && 
           receiptData.studentClass && 
           receiptData.term && 
           receiptData.session;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Modern Receipt Generator</h1>
        <p className="text-slate-600">Create professional, clean PDF receipts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Receipt Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Basic Information</h3>
              
              <div>
                <Label htmlFor="payerName">Payer's Name</Label>
                <Input
                  id="payerName"
                  value={receiptData.payerName}
                  onChange={(e) => handleInputChange('payerName', e.target.value)}
                  placeholder="Enter payer's full name"
                />
              </div>

              <div>
                <Label htmlFor="paymentAmount">Payment Amount (₦)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={receiptData.paymentAmount || ''}
                  onChange={(e) => handleInputChange('paymentAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={receiptData.paymentDate}
                  onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="purpose">Purpose of Payment</Label>
                <Textarea
                  id="purpose"
                  value={receiptData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="e.g., School fees for First Term 2024/2025"
                  rows={3}
                />
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Academic Details</h3>
              
              <div>
                <Label htmlFor="studentClass">Class/Level</Label>
                <Select onValueChange={(value) => handleInputChange('studentClass', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Creche">Creche</SelectItem>
                    <SelectItem value="Playgroup">Playgroup</SelectItem>
                    <SelectItem value="Nursery 1">Nursery 1</SelectItem>
                    <SelectItem value="Nursery 2">Nursery 2</SelectItem>
                    <SelectItem value="Reception">Reception</SelectItem>
                    <SelectItem value="Year 1">Year 1</SelectItem>
                    <SelectItem value="Year 2">Year 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="term">Term</Label>
                <Select onValueChange={(value) => handleInputChange('term', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Term">First Term</SelectItem>
                    <SelectItem value="Second Term">Second Term</SelectItem>
                    <SelectItem value="Third Term">Third Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="session">Academic Session</Label>
                <Input
                  id="session"
                  value={receiptData.session}
                  onChange={(e) => handleInputChange('session', e.target.value)}
                  placeholder="e.g., 2024/2025"
                />
              </div>

              <div>
                <Label htmlFor="receiptNumber">Receipt Number (auto-generated if empty)</Label>
                <Input
                  id="receiptNumber"
                  value={receiptData.receiptNumber}
                  onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                  placeholder="Will be auto-generated"
                />
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Additional Details (Optional)</h3>
              
              <div>
                <Label htmlFor="customField1">Weekend Care</Label>
                <Input
                  id="customField1"
                  value={receiptData.customFields.weekendCare || ''}
                  onChange={(e) => handleCustomFieldChange('weekendCare', e.target.value)}
                  placeholder="e.g., Weekend childcare service"
                />
              </div>

              <div>
                <Label htmlFor="customField2">Computer Classes</Label>
                <Input
                  id="customField2"
                  value={receiptData.customFields.computerClasses || ''}
                  onChange={(e) => handleCustomFieldChange('computerClasses', e.target.value)}
                  placeholder="e.g., Computer literacy program"
                />
              </div>

              <div>
                <Label htmlFor="customField3">Special Notes</Label>
                <Textarea
                  id="customField3"
                  value={receiptData.customFields.specialNotes || ''}
                  onChange={(e) => handleCustomFieldChange('specialNotes', e.target.value)}
                  placeholder="Any additional notes or remarks"
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview and Generate */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Full Professional Receipt Preview */}
            <div 
              id="receipt-preview" 
              className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm"
              style={{ minHeight: '500px' }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">BPS</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  BAYHOOD PREPARATORY SCHOOL
                </h1>
                <p className="text-sm font-semibold text-blue-600 mb-2">
                  CRECHE | PRESCHOOL | AFTER SCHOOL
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>House 20, Diamond Estate, Rd 18, Idimu, Lagos 100275, Lagos</p>
                  <p>Phone: 0809 811 2378</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-blue-600 mb-6"></div>

              {/* Receipt Title */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold text-blue-600 text-center">
                  OFFICIAL PAYMENT RECEIPT
                </h2>
              </div>

              {/* Receipt Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-600">Receipt No:</span>
                  <span className="font-bold ml-2">
                    {receiptData.receiptNumber || 'Auto-generated'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-600">Date Issued:</span>
                  <span className="font-bold ml-2">
                    {formatDate(receiptData.paymentDate)}
                  </span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-green-600 text-white rounded-lg p-4 mb-6 text-center">
                <p className="text-sm font-semibold mb-1">AMOUNT PAID</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(receiptData.paymentAmount)}
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-bold text-blue-600 mb-3">PAYMENT DETAILS</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-600">Payer Name:</p>
                    <p className="font-semibold">{receiptData.payerName || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Session:</p>
                    <p className="font-semibold">{receiptData.session || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Class:</p>
                    <p className="font-semibold">{receiptData.studentClass || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Term:</p>
                    <p className="font-semibold">{receiptData.term || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              {receiptData.purpose && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Purpose of Payment:</h4>
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded border">
                    {receiptData.purpose}
                  </p>
                </div>
              )}

              {/* Custom Fields */}
              {Object.entries(receiptData.customFields).some(([_, value]) => value.trim()) && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Additional Details:</h4>
                  <div className="text-xs space-y-1">
                    {Object.entries(receiptData.customFields)
                      .filter(([_, value]) => value.trim())
                      .map(([key, value]) => (
                        <p key={key}>
                          <span className="font-semibold">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>{' '}
                          {value}
                        </p>
                      ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-center">
                <p className="text-sm font-bold text-green-800">✓ PAYMENT RECEIVED</p>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 space-y-1">
                <p className="italic">Thank you for your payment. This receipt serves as proof of payment.</p>
                <p className="italic">For inquiries, please contact the school administration.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleDownloadPreviewAsPDF}
                disabled={!isFormValid()}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Image className="w-4 h-4 mr-2" />
                Download Preview as PDF
              </Button>
              
              <Button 
                onClick={handleGenerateReceipt}
                disabled={!isFormValid()}
                className="w-full"
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Programmatic PDF
              </Button>
              
              {!isFormValid() && (
                <p className="text-sm text-red-600 text-center">
                  Please fill in all required fields to generate receipt
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernReceiptGenerator;