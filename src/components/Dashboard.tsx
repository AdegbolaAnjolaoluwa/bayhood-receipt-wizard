import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ReceiptForm from './ReceiptForm';
import ReceiptTable from './ReceiptTable';
import UserManagement from './UserManagement';
import { supabase } from '@/integrations/supabase/client';
import { Receipt } from '@/types/receipt';

interface DashboardProps {
  user: {
    username: string;
    role: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('receipts');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Receipt interface
      const transformedReceipts: Receipt[] = (data || []).map((item: any) => ({
        id: item.id,
        receiptNumber: item.receipt_number,
        studentName: item.student_name,
        studentClass: item.student_class,
        term: item.term,
        session: item.session,
        amountPaid: parseFloat(item.amount_paid),
        paymentDate: item.payment_date,
        createdAt: item.created_at,
      }));
      
      setReceipts(transformedReceipts);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptSubmit = async (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => {
    try {
      // Generate receipt number
      const receiptNumber = `BPS${Date.now()}`;
      
      const { data, error } = await supabase
        .from('receipts')
        .insert({
          receipt_number: receiptNumber,
          student_name: receiptData.studentName,
          student_class: receiptData.studentClass,
          term: receiptData.term,
          session: receiptData.session,
          amount_paid: receiptData.amountPaid,
          payment_date: receiptData.paymentDate,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh receipts
      fetchReceipts();
    } catch (error) {
      console.error('Error creating receipt:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">BPS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BAYHOOD PREPARATORY SCHOOL</h1>
                <p className="text-sm text-gray-600">Fee Receipt Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('receipts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'receipts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Receipts
            </button>
            {user.role === 'CEO' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                User Management
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'receipts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Receipt Form */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Receipt
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ReceiptForm onSubmit={handleReceiptSubmit} />
                </CardContent>
              </Card>
            </div>

            {/* Receipts Table */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <CardTitle>Recent Receipts</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ReceiptTable 
                    receipts={receipts} 
                    loading={loading}
                    onEdit={(receipt) => console.log('Edit:', receipt)}
                    onDelete={(receiptId) => console.log('Delete:', receiptId)}
                    onView={(receipt) => console.log('View:', receipt)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'users' && user.role === 'CEO' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
              <p className="text-gray-600 mt-2">Create CEO and Head Teacher accounts</p>
            </div>
            <UserManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
