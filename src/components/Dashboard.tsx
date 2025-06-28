
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleReceiptForm from './SimpleReceiptForm';
import ReceiptCard from './ReceiptCard';
import ReceiptTable from './ReceiptTable';
import { Receipt } from '@/types/receipt';
import { createSupabaseReceipt, getSupabaseReceipts, updateSupabaseReceipt, deleteSupabaseReceipt } from '@/services/supabaseReceiptService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface DashboardProps {
  user: {
    username: string;
    role: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const { signOut } = useAuth();
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [allReceipts, setAllReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'generate' | 'view'>('generate');
  const { toast } = useToast();

  // Load receipts from Supabase on component mount
  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const receipts = await getSupabaseReceipts();
        setAllReceipts(receipts);
        setRecentReceipts(receipts.slice(0, 5));
      } catch (error) {
        console.error('Error loading receipts:', error);
        toast({
          title: "Error",
          description: "Failed to load receipts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [toast]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSimpleReceiptSubmit = async (receiptData: {
    payerName: string;
    purpose: string;
    amount: number;
  }) => {
    try {
      const newReceipt = await createSupabaseReceipt({
        studentName: receiptData.payerName,
        studentClass: 'N/A',
        term: 'N/A',
        session: new Date().getFullYear().toString(),
        amountPaid: receiptData.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        description: receiptData.purpose,
      });
      
      setCurrentReceipt(newReceipt);
      
      // Refresh receipts
      const receipts = await getSupabaseReceipts();
      setAllReceipts(receipts);
      setRecentReceipts(receipts.slice(0, 5));
      
      toast({
        title: "Success",
        description: `Receipt ${newReceipt.receiptNumber} generated successfully!`,
      });
    } catch (error) {
      console.error('Error creating receipt:', error);
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditReceipt = (receipt: Receipt) => {
    setEditingReceipt(receipt);
    setCurrentReceipt(null);
    setCurrentView('generate');
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    try {
      const success = await deleteSupabaseReceipt(receiptId);
      if (success) {
        // Refresh receipts
        const receipts = await getSupabaseReceipts();
        setAllReceipts(receipts);
        setRecentReceipts(receipts.slice(0, 5));
        
        toast({
          title: "Success",
          description: "Receipt deleted successfully!",
        });
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast({
        title: "Error",
        description: "Failed to delete receipt.",
        variant: "destructive",
      });
    }
  };

  const handleNewReceipt = () => {
    setCurrentReceipt(null);
    setEditingReceipt(null);
    setCurrentView('generate');
  };

  // Calculate stats
  const totalAmount = allReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
  const thisMonth = allReceipts.filter(r => {
    const receiptDate = new Date(r.createdAt);
    const now = new Date();
    return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/0054f70d-58c4-4fcc-bd7c-426a6f6d8b13.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-800">Bayhood Preparatory School</h1>
                <p className="text-gray-600">Fee Receipt Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentView('generate')}
                  variant={currentView === 'generate' ? 'default' : 'outline'}
                  className="border-2"
                >
                  Generate Receipt
                </Button>
                <Button
                  onClick={() => setCurrentView('view')}
                  variant={currentView === 'view' ? 'default' : 'outline'}
                  className="border-2"
                >
                  View Receipts
                </Button>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-blue-800">{user.username}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-red-500 text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50">
              <CardTitle className="text-blue-800">Total Receipts</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-blue-600">
                {loading ? '...' : allReceipts.length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-100 to-green-50">
              <CardTitle className="text-green-800">Total Amount</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : `₦${totalAmount.toLocaleString()}`}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
              <CardTitle className="text-purple-800">This Month</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-purple-600">
                {loading ? '...' : thisMonth}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {currentReceipt ? (
          <ReceiptCard 
            receipt={currentReceipt} 
            onEdit={() => handleEditReceipt(currentReceipt)}
          />
        ) : currentView === 'generate' ? (
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100">
              <CardTitle className="text-blue-800">
                Generate New Receipt
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SimpleReceiptForm 
                onSubmit={handleSimpleReceiptSubmit}
                onCancel={editingReceipt ? handleNewReceipt : undefined}
              />
            </CardContent>
          </Card>
        ) : (
          <ReceiptTable
            receipts={allReceipts}
            loading={loading}
            onEdit={handleEditReceipt}
            onDelete={handleDeleteReceipt}
            onView={setCurrentReceipt}
          />
        )}

        {/* Recent Receipts - Only show on generate view */}
        {currentView === 'generate' && !currentReceipt && recentReceipts.length > 0 && (
          <Card className="mt-8 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentReceipts.map((receipt) => (
                  <div 
                    key={receipt.id}
                    className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setCurrentReceipt(receipt)}
                  >
                    <div>
                      <p className="font-semibold">{receipt.studentName}</p>
                      <p className="text-sm text-gray-600">Receipt: {receipt.receiptNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₦{receipt.amountPaid.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{new Date(receipt.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
