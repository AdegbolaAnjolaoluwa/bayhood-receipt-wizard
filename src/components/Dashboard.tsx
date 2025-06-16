import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ReceiptForm from './ReceiptForm';
import ReceiptCard from './ReceiptCard';
import ReceiptTable from './ReceiptTable';
import AIReceiptGenerator from './AIReceiptGenerator';

export interface Receipt {
  id: string;
  studentName: string;
  studentClass: string;
  term: string;
  session: string;
  amountPaid: number;
  paymentDate: string;
  createdAt: string;
  receiptNumber: string;
}

interface User {
  username: string;
  role: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const { signOut, user: authUser } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
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

      if (error) {
        console.error('Error fetching receipts:', error);
        return;
      }

      const formattedReceipts = data.map(receipt => ({
        id: receipt.id,
        studentName: receipt.student_name,
        studentClass: receipt.student_class,
        term: receipt.term,
        session: receipt.session,
        amountPaid: Number(receipt.amount_paid),
        paymentDate: receipt.payment_date,
        createdAt: receipt.created_at,
        receiptNumber: receipt.receipt_number,
      }));

      setReceipts(formattedReceipts);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `BPS${year}${month}${random}`;
  };

  const handleCreateReceipt = async (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => {
    if (!authUser) {
      console.error('User not authenticated');
      return;
    }

    const receiptNumber = generateReceiptNumber();
    
    try {
      const { data, error } = await supabase
        .from('receipts')
        .insert([
          {
            student_name: receiptData.studentName,
            student_class: receiptData.studentClass,
            term: receiptData.term,
            session: receiptData.session,
            amount_paid: receiptData.amountPaid,
            payment_date: receiptData.paymentDate,
            receipt_number: receiptNumber,
            user_id: authUser.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating receipt:', error);
        return;
      }

      const newReceipt: Receipt = {
        id: data.id,
        studentName: data.student_name,
        studentClass: data.student_class,
        term: data.term,
        session: data.session,
        amountPaid: Number(data.amount_paid),
        paymentDate: data.payment_date,
        createdAt: data.created_at,
        receiptNumber: data.receipt_number,
      };

      setReceipts([newReceipt, ...receipts]);
      setSelectedReceipt(newReceipt);
    } catch (error) {
      console.error('Error creating receipt:', error);
    }
  };

  const handleUpdateReceipt = async (updatedReceipt: Receipt) => {
    try {
      const { error } = await supabase
        .from('receipts')
        .update({
          student_name: updatedReceipt.studentName,
          student_class: updatedReceipt.studentClass,
          term: updatedReceipt.term,
          session: updatedReceipt.session,
          amount_paid: updatedReceipt.amountPaid,
          payment_date: updatedReceipt.paymentDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedReceipt.id);

      if (error) {
        console.error('Error updating receipt:', error);
        return;
      }

      const updatedReceipts = receipts.map(receipt =>
        receipt.id === updatedReceipt.id ? updatedReceipt : receipt
      );
      setReceipts(updatedReceipts);
      setEditingReceipt(null);
      setSelectedReceipt(updatedReceipt);
    } catch (error) {
      console.error('Error updating receipt:', error);
    }
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    try {
      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', receiptId);

      if (error) {
        console.error('Error deleting receipt:', error);
        return;
      }

      const updatedReceipts = receipts.filter(receipt => receipt.id !== receiptId);
      setReceipts(updatedReceipts);
      if (selectedReceipt?.id === receiptId) {
        setSelectedReceipt(null);
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  const handleAIGenerate = (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => {
    handleCreateReceipt(receiptData);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">BPS</span>
          </div>
          <p>Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-red-500 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">BPS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">BAYHOOD PREPARATORY SCHOOL</h1>
                <p className="text-blue-100">Fee Receipt Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-blue-100">{user.role}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-blue-200">
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Create Receipt
            </TabsTrigger>
            <TabsTrigger value="receipts" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              View Receipts
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Receipt Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100">
                <CardTitle className="text-blue-800">Create New Receipt</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ReceiptForm 
                  onSubmit={handleCreateReceipt}
                  initialData={editingReceipt}
                  onCancel={() => setEditingReceipt(null)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts">
            <ReceiptTable
              receipts={receipts}
              onEdit={setEditingReceipt}
              onDelete={handleDeleteReceipt}
              onView={setSelectedReceipt}
            />
          </TabsContent>

          <TabsContent value="ai">
            <AIReceiptGenerator onGenerate={handleAIGenerate} />
          </TabsContent>

          <TabsContent value="preview">
            {selectedReceipt ? (
              <ReceiptCard 
                receipt={selectedReceipt} 
                onEdit={() => setEditingReceipt(selectedReceipt)}
              />
            ) : (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No receipt selected. Create a receipt or select one from the receipts tab to preview.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
