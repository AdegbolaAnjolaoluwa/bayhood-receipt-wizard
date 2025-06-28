
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReceiptForm from './ReceiptForm';
import ReceiptCard from './ReceiptCard';
import AIReceiptGenerator from './AIReceiptGenerator';
import { Receipt } from '@/types/receipt';
import { createSupabaseReceipt, getSupabaseReceipts, updateSupabaseReceipt } from '@/services/supabaseReceiptService';
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
  const [totalReceipts, setTotalReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load receipts from Supabase on component mount
  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const receipts = await getSupabaseReceipts();
        setTotalReceipts(receipts);
        setRecentReceipts(receipts.slice(0, 5)); // Get first 5 receipts (already sorted by created_at desc)
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

  const handleReceiptSubmit = async (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => {
    try {
      if (editingReceipt) {
        // Update existing receipt
        const updated = await updateSupabaseReceipt(editingReceipt.id, receiptData);
        if (updated) {
          setCurrentReceipt(updated);
          setEditingReceipt(null);
          // Refresh receipts
          const receipts = await getSupabaseReceipts();
          setTotalReceipts(receipts);
          setRecentReceipts(receipts.slice(0, 5));
          toast({
            title: "Success",
            description: "Receipt updated successfully!",
          });
        }
      } else {
        // Create new receipt
        const newReceipt = await createSupabaseReceipt(receiptData);
        setCurrentReceipt(newReceipt);
        // Refresh receipts
        const receipts = await getSupabaseReceipts();
        setTotalReceipts(receipts);
        setRecentReceipts(receipts.slice(0, 5));
        toast({
          title: "Success",
          description: `Receipt ${newReceipt.receiptNumber} generated and saved successfully!`,
        });
      }
    } catch (error) {
      console.error('Error creating/updating receipt:', error);
      toast({
        title: "Error",
        description: "Failed to save receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditReceipt = () => {
    setEditingReceipt(currentReceipt);
    setCurrentReceipt(null);
  };

  const handleCancelEdit = () => {
    setEditingReceipt(null);
  };

  const handleNewReceipt = () => {
    setCurrentReceipt(null);
    setEditingReceipt(null);
  };

  // Calculate stats
  const totalAmount = totalReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
  const thisMonth = totalReceipts.filter(r => {
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
                {loading ? '...' : totalReceipts.length}
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
            onEdit={handleEditReceipt}
          />
        ) : (
          <Tabs defaultValue="form" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="form">Manual Entry</TabsTrigger>
                <TabsTrigger value="ai">AI Generator</TabsTrigger>
              </TabsList>
              
              {editingReceipt && (
                <Button 
                  onClick={handleNewReceipt}
                  variant="outline"
                  className="border-2 border-gray-300 hover:bg-gray-50"
                >
                  New Receipt
                </Button>
              )}
            </div>

            <TabsContent value="form">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100">
                  <CardTitle className="text-blue-800">
                    {editingReceipt ? 'Edit Receipt' : 'Generate New Receipt'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ReceiptForm 
                    onSubmit={handleReceiptSubmit}
                    initialData={editingReceipt}
                    onCancel={editingReceipt ? handleCancelEdit : undefined}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai">
              <AIReceiptGenerator onGenerate={handleReceiptSubmit} />
            </TabsContent>
          </Tabs>
        )}

        {/* Recent Receipts */}
        {!currentReceipt && recentReceipts.length > 0 && (
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
                      <p className="font-semibold">{receipt.studentName} - {receipt.studentClass}</p>
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
