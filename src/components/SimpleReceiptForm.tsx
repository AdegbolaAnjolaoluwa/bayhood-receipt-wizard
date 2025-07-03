import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SimpleReceiptFormProps {
  onSubmit: (receiptData: {
    studentName: string;
    studentClass: string;
    term: string;
    session: string;
    amountPaid: number;
    paymentDate: string;
    description: string;
    feeCategories: { category: string; amount: number }[];
    discount: { type: string; value: number; amount: number };
    paymentMethod: string;
    totalAmount: number;
    outstandingBalance: number;
    paymentStatus: string;
  }) => void;
  onCancel?: () => void;
}

const SimpleReceiptForm = ({ onSubmit, onCancel }: SimpleReceiptFormProps) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    term: '',
    session: '',
    amountPaid: '',
    paymentDate: '',
    description: '',
    paymentMethod: 'Cash',
  });

  const [feeCategories, setFeeCategories] = useState([
    { category: 'Tuition', amount: 0 },
  ]);

  const [discount, setDiscount] = useState({
    type: 'none',
    value: 0,
    amount: 0,
  });

  const quickAmounts = [10000, 20000, 50000];
  const discountOptions = [
    { label: 'No Discount', value: 'none' },
    { label: '10% Discount', value: '10' },
    { label: '20% Discount', value: '20' },
    { label: 'Custom Discount', value: 'custom' },
  ];

  const feeTypeOptions = [
    'Tuition',
    'PTA Dues',
    'Uniforms',
    'Textbook and Stationery',
    'Development Fee',
    'Late Pickup Fee',
    'Registration Fee',
    'Weekend Childcare Fee',
    'Lesson Fee - January',
    'Lesson Fee - February',
    'Lesson Fee - March',
    'Lesson Fee - April',
    'Lesson Fee - May',
    'Lesson Fee - June',
    'Lesson Fee - July',
    'Lesson Fee - August',
    'Lesson Fee - September',
    'Lesson Fee - October',
    'Lesson Fee - November',
    'Lesson Fee - December',
    'Dailycare Service Fee',
    'Sportwear',
    'Friday Wear',
    'Computer Classes'
  ];

  const paymentMethods = ['Cash', 'POS', 'Bank Transfer', 'Cheque'];

  // Calculate totals
  const subtotal = feeCategories.reduce((sum, fee) => sum + fee.amount, 0);
  const discountAmount = discount.type === 'none' ? 0 : 
    discount.type === 'custom' ? discount.amount : 
    (subtotal * parseInt(discount.type)) / 100;
  const totalAmount = subtotal - discountAmount;
  const amountPaid = parseFloat(formData.amountPaid) || 0;
  const outstandingBalance = Math.max(0, totalAmount - amountPaid);
  const paymentStatus = outstandingBalance === 0 ? 'PAID IN FULL' : `BALANCE ₦${outstandingBalance.toLocaleString()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      studentName: formData.studentName,
      studentClass: formData.studentClass,
      term: formData.term,
      session: formData.session,
      amountPaid: parseFloat(formData.amountPaid),
      paymentDate: formData.paymentDate,
      description: formData.description,
      feeCategories: feeCategories.filter(fee => fee.amount > 0),
      discount: {
        type: discount.type,
        value: discount.type === 'custom' ? discount.amount : parseInt(discount.type) || 0,
        amount: discountAmount,
      },
      paymentMethod: formData.paymentMethod,
      totalAmount,
      outstandingBalance,
      paymentStatus,
    });
    
    // Reset form
    setFormData({
      studentName: '',
      studentClass: '',
      term: '',
      session: '',
      amountPaid: '',
      paymentDate: '',
      description: '',
      paymentMethod: 'Cash',
    });
    setFeeCategories([{ category: 'Tuition', amount: 0 }]);
    setDiscount({ type: 'none', value: 0, amount: 0 });
  };

  const handleQuickAmount = (amount: number) => {
    setFormData({ ...formData, amountPaid: amount.toString() });
  };

  const addFeeCategory = () => {
    setFeeCategories([...feeCategories, { category: 'Tuition', amount: 0 }]);
  };

  const removeFeeCategory = (index: number) => {
    setFeeCategories(feeCategories.filter((_, i) => i !== index));
  };

  const updateFeeCategory = (index: number, field: string, value: string | number) => {
    const updated = [...feeCategories];
    updated[index] = { ...updated[index], [field]: value };
    setFeeCategories(updated);
  };

  const handleDiscountChange = (type: string) => {
    setDiscount({ ...discount, type, amount: type === 'custom' ? discount.amount : 0 });
  };

  const currentYear = new Date().getFullYear();
  const sessions = [
    `${currentYear - 1}/${currentYear}`,
    `${currentYear}/${currentYear + 1}`,
    `${currentYear + 1}/${currentYear + 2}`,
  ];

  const classes = [
    'Creche', 'Playgroup', 'Preschool 1', 'Preschool 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'
  ];

  const getClassColor = (className: string) => {
    if (className.includes('Playgroup')) return 'bg-sky-100 border-sky-300 text-sky-800';
    if (className.includes('Preschool')) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (className.includes('Nursery')) return 'bg-pink-100 border-pink-300 text-pink-800';
    if (className.includes('Primary')) return 'bg-green-100 border-green-300 text-green-800';
    if (className.includes('JSS') || className.includes('SSS')) return 'bg-purple-100 border-purple-300 text-purple-800';
    return 'bg-gray-100 border-gray-300 text-gray-800';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student Name *
            </label>
            <Input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              placeholder="Enter student's full name"
              className="border-2 border-gray-300 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Class *
            </label>
            <Select 
              value={formData.studentClass} 
              onValueChange={(value) => setFormData({...formData, studentClass: value})}
            >
              <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    <div className="flex items-center space-x-2">
                      <Badge className={getClassColor(cls)}>{cls}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Term *
            </label>
            <Select 
              value={formData.term} 
              onValueChange={(value) => setFormData({...formData, term: value})}
            >
              <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Session *
            </label>
            <Select 
              value={formData.session} 
              onValueChange={(value) => setFormData({...formData, session: value})}
            >
              <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session} value={session}>{session}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">Fee Breakdown</CardTitle>
          <Button type="button" onClick={addFeeCategory} variant="outline" size="sm">
            Add Fee Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {feeCategories.map((fee, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Select
                value={fee.category}
                onValueChange={(value) => updateFeeCategory(index, 'category', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {feeTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={fee.amount}
                onChange={(e) => updateFeeCategory(index, 'amount', parseFloat(e.target.value) || 0)}
                className="w-32"
              />
              {feeCategories.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeFeeCategory(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          
          <Separator />
          
          <div className="flex justify-between items-center font-semibold">
            <span>Subtotal:</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Discount Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Discount</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={discount.type} onValueChange={handleDiscountChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {discountOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {discount.type === 'custom' && (
            <Input
              type="number"
              placeholder="Enter discount amount"
              value={discount.amount}
              onChange={(e) => setDiscount({...discount, amount: parseFloat(e.target.value) || 0})}
            />
          )}
          
          {discount.type !== 'none' && (
            <div className="flex justify-between items-center text-green-600 font-semibold">
              <span>Discount Applied:</span>
              <span>-₦{discountAmount.toLocaleString()}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total Amount:</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Date *
            </label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
              className="border-2 border-gray-300 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Method *
            </label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
            >
              <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount Paid (₦) *
            </label>
            
            <div className="mb-3 flex flex-wrap gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount(amount)}
                  className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  ₦{amount.toLocaleString()}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickAmount(totalAmount)}
                className="border-2 border-green-300 text-green-600 hover:bg-green-50"
              >
                Pay Full Amount (₦{totalAmount.toLocaleString()})
              </Button>
            </div>

            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amountPaid}
              onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
              placeholder="Enter amount paid"
              className="border-2 border-gray-300 focus:border-blue-500"
              required
            />
          </div>

          {/* Payment Status Display */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Amount Paid:</span>
                <span className="text-green-600 font-bold">₦{amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Outstanding Balance:</span>
                <span className={`font-bold ${outstandingBalance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₦{outstandingBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <Badge className={outstandingBalance === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {paymentStatus}
                </Badge>
              </div>
            </div>
            
            {outstandingBalance === 0 && amountPaid >= totalAmount && totalAmount > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-bold">🎯 EARLY PAYMENT BONUS ✅</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Full payment completed - Thank you!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Payment Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="e.g., Payment for second term tuition and feeding fee"
            className="border-2 border-gray-300 focus:border-blue-500 min-h-[80px]"
          />
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold px-8 py-3"
        >
          Generate Receipt
        </Button>
        {onCancel && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-3"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default SimpleReceiptForm;
