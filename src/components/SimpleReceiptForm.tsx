
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SimpleReceiptFormProps {
  onSubmit: (receiptData: {
    payerName: string;
    purpose: string;
    amount: number;
  }) => void;
  onCancel?: () => void;
}

const SimpleReceiptForm = ({ onSubmit, onCancel }: SimpleReceiptFormProps) => {
  const [formData, setFormData] = useState({
    payerName: '',
    purpose: '',
    amount: '',
  });

  const quickAmounts = [10000, 20000, 50000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      payerName: formData.payerName,
      purpose: formData.purpose,
      amount: parseFloat(formData.amount),
    });
    
    // Reset form
    setFormData({
      payerName: '',
      purpose: '',
      amount: '',
    });
  };

  const handleQuickAmount = (amount: number) => {
    setFormData({ ...formData, amount: amount.toString() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Payer Name *
        </label>
        <Input
          type="text"
          value={formData.payerName}
          onChange={(e) => setFormData({...formData, payerName: e.target.value})}
          placeholder="Enter payer's name"
          className="border-2 border-gray-300 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Purpose/Description *
        </label>
        <Textarea
          value={formData.purpose}
          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
          placeholder="Enter payment purpose or description"
          className="border-2 border-gray-300 focus:border-orange-500 min-h-[80px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Amount (₦) *
        </label>
        
        {/* Quick Amount Buttons */}
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
        </div>

        {/* Manual Amount Input */}
        <Input
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          placeholder="Enter custom amount"
          className="border-2 border-gray-300 focus:border-orange-500"
          required
        />
      </div>

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold px-8 py-3"
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
