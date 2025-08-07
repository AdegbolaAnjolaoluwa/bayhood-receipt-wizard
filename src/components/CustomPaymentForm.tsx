import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CustomPaymentFormProps {
  onPaymentAdded?: () => void;
}

const CustomPaymentForm = ({ onPaymentAdded }: CustomPaymentFormProps) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    term: '',
    session: '',
    description: '',
    amount: '',
    paymentDate: '',
    paymentMethod: 'Cash',
  });
  const [loading, setLoading] = useState(false);

  const paymentMethods = ['Cash', 'POS', 'Bank Transfer', 'Cheque'];
  
  const currentYear = new Date().getFullYear();
  const sessions = [
    `${currentYear - 1}/${currentYear}`,
    `${currentYear}/${currentYear + 1}`,
    `${currentYear + 1}/${currentYear + 2}`,
    '2025/2026',
  ];

  const classes = [
    'Creche', 'Playgroup', 'Preschool 1', 'Preschool 2',
    'Nursery 1', 'Nursery 2', 'Nursery 3',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentClass || !formData.term || 
        !formData.description || !formData.amount || !formData.paymentDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add payments",
          variant: "destructive",
        });
        return;
      }

      // Insert custom payment
      const { error: paymentError } = await supabase
        .from('custom_payments')
        .insert({
          student_name: formData.studentName,
          student_class: formData.studentClass,
          term: formData.term,
          session: formData.session || null,
          description: formData.description,
          amount: parseFloat(formData.amount),
          payment_date: formData.paymentDate,
          payment_method: formData.paymentMethod,
          created_by: user.id,
        });

      if (paymentError) throw paymentError;

      // Update or create student account balance
      const { data: existingAccount } = await supabase
        .from('student_accounts')
        .select('*')
        .eq('student_name', formData.studentName)
        .eq('student_class', formData.studentClass)
        .eq('term', formData.term)
        .eq('session', formData.session || '')
        .single();

      if (existingAccount) {
        // Update existing account
        const { error: updateError } = await supabase
          .from('student_accounts')
          .update({
            total_paid: existingAccount.total_paid + parseFloat(formData.amount),
            last_payment_date: formData.paymentDate,
          })
          .eq('id', existingAccount.id);

        if (updateError) throw updateError;
      } else {
        // Create new account
        const { error: createError } = await supabase
          .from('student_accounts')
          .insert({
            student_name: formData.studentName,
            student_class: formData.studentClass,
            term: formData.term,
            session: formData.session || null,
            total_fees_assigned: 0,
            total_paid: parseFloat(formData.amount),
            last_payment_date: formData.paymentDate,
            created_by: user.id,
          });

        if (createError) throw createError;
      }

      toast({
        title: "Success",
        description: "Custom payment recorded successfully!",
      });

      // Reset form
      setFormData({
        studentName: '',
        studentClass: '',
        term: '',
        session: '',
        description: '',
        amount: '',
        paymentDate: '',
        paymentMethod: 'Cash',
      });

      onPaymentAdded?.();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-xl font-bold text-slate-800">Custom Payment Entry</CardTitle>
        <p className="text-slate-600">Record payments for services not in standard fee templates</p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Session
              </label>
              <Select 
                value={formData.session} 
                onValueChange={(value) => setFormData({...formData, session: value})}
              >
                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="Select session (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what this payment is for (e.g., 'Field trip to National Museum', 'Extra coaching fees', 'Special event contribution')"
                className="border-2 border-gray-300 focus:border-blue-500"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₦) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
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
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Custom Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomPaymentForm;