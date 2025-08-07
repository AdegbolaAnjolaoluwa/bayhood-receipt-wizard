import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Plus, X, DollarSign } from 'lucide-react';
import { FeeTemplate } from '@/types/feeTemplate';
import { getFeeTemplates } from '@/services/feeTemplateService';

interface SelectedFee {
  template: FeeTemplate;
  quantity: number;
  customAmount?: number;
}

interface EnhancedReceiptFormProps {
  onGenerate: (receiptData: {
    studentName: string;
    studentClass: string;
    term: string;
    session: string;
    paymentDate: string;
    description: string;
    amountPaid: number;
    feeBreakdown?: Array<{
      name: string;
      category: string;
      amount: number;
      quantity: number;
    }>;
  }) => void;
  loading?: boolean;
}

const EnhancedReceiptForm: React.FC<EnhancedReceiptFormProps> = ({ onGenerate, loading = false }) => {
  const [feeTemplates, setFeeTemplates] = useState<FeeTemplate[]>([]);
  const [selectedFees, setSelectedFees] = useState<SelectedFee[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    term: 'First Term',
    session: '2024/2025',
    paymentDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadFeeTemplates();
  }, []);

  const loadFeeTemplates = async () => {
    const templates = await getFeeTemplates();
    setFeeTemplates(templates);
    setTemplatesLoading(false);
  };

  const addFeeTemplate = (templateId: string) => {
    const template = feeTemplates.find(t => t.id === templateId);
    if (template && !selectedFees.find(f => f.template.id === templateId)) {
      setSelectedFees([...selectedFees, { template, quantity: 1 }]);
    }
  };

  const removeFeeTemplate = (templateId: string) => {
    setSelectedFees(selectedFees.filter(f => f.template.id !== templateId));
  };

  const updateFeeQuantity = (templateId: string, quantity: number) => {
    setSelectedFees(selectedFees.map(f => 
      f.template.id === templateId ? { ...f, quantity: Math.max(1, quantity) } : f
    ));
  };

  const updateCustomAmount = (templateId: string, amount: number) => {
    setSelectedFees(selectedFees.map(f => 
      f.template.id === templateId ? { ...f, customAmount: amount } : f
    ));
  };

  const calculateTotal = () => {
    return selectedFees.reduce((total, fee) => {
      const amount = fee.customAmount || fee.template.amount;
      return total + (amount * fee.quantity);
    }, 0);
  };

  const generateDescription = () => {
    if (selectedFees.length === 0) return '';
    
    return selectedFees.map(fee => {
      const amount = fee.customAmount || fee.template.amount;
      return `${fee.template.name}${fee.quantity > 1 ? ` (x${fee.quantity})` : ''}: ₦${(amount * fee.quantity).toLocaleString()}`;
    }).join(', ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentClass) {
      toast({
        title: "Validation Error",
        description: "Please fill in student name and class",
        variant: "destructive",
      });
      return;
    }

    if (selectedFees.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one fee item",
        variant: "destructive",
      });
      return;
    }

    const feeBreakdown = selectedFees.map(fee => ({
      name: fee.template.name,
      category: fee.template.category,
      amount: fee.customAmount || fee.template.amount,
      quantity: fee.quantity,
    }));

    onGenerate({
      ...formData,
      description: generateDescription(),
      amountPaid: calculateTotal(),
      feeBreakdown,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Tuition': 'bg-blue-100 text-blue-800',
      'Books': 'bg-green-100 text-green-800',
      'Transport': 'bg-yellow-100 text-yellow-800',
      'Uniform': 'bg-purple-100 text-purple-800',
      'Examination': 'bg-red-100 text-red-800',
      'Activities': 'bg-indigo-100 text-indigo-800',
      'Summer School': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['Other'];
  };

  const availableTemplates = feeTemplates.filter(template => 
    !selectedFees.find(f => f.template.id === template.id)
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Enhanced Receipt Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name *
              </label>
              <Input
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                placeholder="Enter student full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class *
              </label>
              <Select value={formData.studentClass} onValueChange={(value) => setFormData({...formData, studentClass: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nursery 1">Nursery 1</SelectItem>
                  <SelectItem value="Nursery 2">Nursery 2</SelectItem>
                  <SelectItem value="Reception">Reception</SelectItem>
                  <SelectItem value="Year 1">Year 1</SelectItem>
                  <SelectItem value="Year 2">Year 2</SelectItem>
                  <SelectItem value="Year 3">Year 3</SelectItem>
                  <SelectItem value="Year 4">Year 4</SelectItem>
                  <SelectItem value="Year 5">Year 5</SelectItem>
                  <SelectItem value="Year 6">Year 6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term
              </label>
              <Select value={formData.term} onValueChange={(value) => setFormData({...formData, term: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First Term">First Term</SelectItem>
                  <SelectItem value="Second Term">Second Term</SelectItem>
                  <SelectItem value="Third Term">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session
              </label>
              <Select value={formData.session} onValueChange={(value) => setFormData({...formData, session: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2026/2027">2026/2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <Input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Fee Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Fee Items</h3>
            
            {/* Add Fee Template */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Fee Template
              </label>
              <Select onValueChange={addFeeTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder={templatesLoading ? "Loading templates..." : "Select a fee template to add"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{template.name}</span>
                        <span className="ml-2 text-sm text-gray-500">₦{template.amount.toLocaleString()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Fees */}
            <div className="space-y-3">
              {selectedFees.map((fee) => (
                <div key={fee.template.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{fee.template.name}</h4>
                      <Badge className={getCategoryColor(fee.template.category)}>
                        {fee.template.category}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeeTemplate(fee.template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={fee.quantity}
                        onChange={(e) => updateFeeQuantity(fee.template.id, parseInt(e.target.value) || 1)}
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Unit Amount (₦)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={fee.customAmount || fee.template.amount}
                        onChange={(e) => updateCustomAmount(fee.template.id, parseFloat(e.target.value) || fee.template.amount)}
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Total
                      </label>
                      <div className="bg-white border rounded px-3 py-2 text-sm font-medium">
                        ₦{((fee.customAmount || fee.template.amount) * fee.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedFees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No fee items selected</p>
                <p className="text-sm">Select fee templates from the dropdown above</p>
              </div>
            )}
          </div>

          {/* Total */}
          {selectedFees.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-900">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || selectedFees.length === 0}
          >
            {loading ? 'Generating Receipt...' : 'Generate Receipt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedReceiptForm;