
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt } from './Dashboard';

interface ReceiptFormProps {
  onSubmit: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => void;
  initialData?: Receipt | null;
  onCancel?: () => void;
}

const ReceiptForm = ({ onSubmit, initialData, onCancel }: ReceiptFormProps) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    term: '',
    session: '',
    amountPaid: '',
    paymentDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentName: initialData.studentName,
        studentClass: initialData.studentClass,
        term: initialData.term,
        session: initialData.session,
        amountPaid: initialData.amountPaid.toString(),
        paymentDate: initialData.paymentDate,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      studentName: formData.studentName,
      studentClass: formData.studentClass,
      term: formData.term,
      session: formData.session,
      amountPaid: parseFloat(formData.amountPaid),
      paymentDate: formData.paymentDate,
    });
    
    if (!initialData) {
      setFormData({
        studentName: '',
        studentClass: '',
        term: '',
        session: '',
        amountPaid: '',
        paymentDate: '',
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const sessions = [
    `${currentYear - 1}/${currentYear}`,
    `${currentYear}/${currentYear + 1}`,
    `${currentYear + 1}/${currentYear + 2}`,
  ];

  const classes = [
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount Paid (₦) *
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.amountPaid}
            onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
            placeholder="Enter amount paid"
            className="border-2 border-gray-300 focus:border-blue-500"
            required
          />
        </div>

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
      </div>

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold px-8 py-3"
        >
          {initialData ? 'Update Receipt' : 'Generate Receipt'}
        </Button>
        {initialData && onCancel && (
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

export default ReceiptForm;
