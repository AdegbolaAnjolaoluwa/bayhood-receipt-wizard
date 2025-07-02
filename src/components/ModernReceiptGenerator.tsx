import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useModernReceiptPDF } from '@/hooks/useModernReceiptPDF';
import { Download, FileText } from 'lucide-react';

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
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-blue-600">BAYHOOD PREPARATORY SCHOOL</h3>
                <p className="text-sm text-slate-600">House 20, Diamond Estate, Rd 18, Idimu, Lagos</p>
                <p className="text-sm text-slate-600">Phone: 0809 811 2378</p>
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Payer:</span>
                  <span>{receiptData.payerName || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="font-bold text-green-600">
                    ₦{receiptData.paymentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{receiptData.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Class:</span>
                  <span>{receiptData.studentClass || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Term:</span>
                  <span>{receiptData.term || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Session:</span>
                  <span>{receiptData.session || 'Not specified'}</span>
                </div>
              </div>
              
              {receiptData.purpose && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-sm"><strong>Purpose:</strong> {receiptData.purpose}</p>
                </div>
              )}
            </div>

            <Button 
              onClick={handleGenerateReceipt}
              disabled={!isFormValid()}
              className="w-full"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Generate PDF Receipt
            </Button>
            
            {!isFormValid() && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Please fill in all required fields to generate receipt
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernReceiptGenerator;