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
import { FileText, Users, DollarSign, Calendar } from 'lucide-react';

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
    studentName: string;
    studentClass: string;
    term: string;
    session: string;
    amountPaid: number;
    paymentDate: string;
    description: string;
    feeCategories?: { category: string; amount: number }[];
    discount?: { type: string; value: number; amount: number };
    paymentMethod?: string;
    totalAmount?: number;
    outstandingBalance?: number;
    paymentStatus?: string;
  }) => {
    try {
      // Create enhanced description with fee breakdown and payment details
      let enhancedDescription = receiptData.description;
      
      if (receiptData.feeCategories && receiptData.feeCategories.length > 0) {
        const feeBreakdown = receiptData.feeCategories
          .map(fee => `${fee.category}: ₦${fee.amount.toLocaleString()}`)
          .join(', ');
        enhancedDescription = `${enhancedDescription || 'Payment for'} - ${feeBreakdown}`;
        
        if (receiptData.discount && receiptData.discount.type !== 'none') {
          enhancedDescription += ` | Discount Applied: ${receiptData.discount.type === 'custom' ? '₦' + receiptData.discount.amount.toLocaleString() : receiptData.discount.value + '%'}`;
        }
        
        if (receiptData.paymentMethod) {
          enhancedDescription += ` | Payment Method: ${receiptData.paymentMethod}`;
        }
        
        if (receiptData.outstandingBalance && receiptData.outstandingBalance > 0) {
          enhancedDescription += ` | Outstanding Balance: ₦${receiptData.outstandingBalance.toLocaleString()}`;
        }
        
        if (receiptData.paymentStatus) {
          enhancedDescription += ` | Status: ${receiptData.paymentStatus}`;
        }
      }

      const newReceipt = await createSupabaseReceipt({
        studentName: receiptData.studentName,
        studentClass: receiptData.studentClass,
        term: receiptData.term,
        session: receiptData.session,
        amountPaid: receiptData.amountPaid,
        paymentDate: receiptData.paymentDate,
        description: enhancedDescription,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <img 
                src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Fee Receipt Management System</h1>
                <p className="text-gray-600">Professional • Secure • Efficient</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Navigation */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => setCurrentView('generate')}
                  variant={currentView === 'generate' ? 'default' : 'outline'}
                  className={`border-2 font-semibold ${
                    currentView === 'generate' 
                      ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Receipt
                </Button>
                <Button
                  onClick={() => setCurrentView('view')}
                  variant={currentView === 'view' ? 'default' : 'outline'}
                  className={`border-2 font-semibold ${
                    currentView === 'view' 
                      ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Receipts
                </Button>
              </div>
              
              <div className="text-right bg-gradient-to-r from-blue-100 to-green-100 px-4 py-2 rounded-lg border border-blue-200">
                <p className="font-bold text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold"
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
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-semibold">Total Receipts</CardTitle>
                <FileText className="w-6 h-6 text-blue-100" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? '...' : allReceipts.length}
              </p>
              <p className="text-blue-100 text-sm mt-1">All time receipts</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-semibold">Total Amount</CardTitle>
                <DollarSign className="w-6 h-6 text-green-100" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? '...' : `₦${totalAmount.toLocaleString()}`}
              </p>
              <p className="text-green-100 text-sm mt-1">Total collected</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-semibold">This Month</CardTitle>
                <Calendar className="w-6 h-6 text-purple-100" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? '...' : thisMonth}
              </p>
              <p className="text-purple-100 text-sm mt-1">Recent receipts</p>
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
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-100">
              <CardTitle className="text-gray-800 text-xl font-bold">
                Generate New Receipt
              </CardTitle>
              <p className="text-gray-600">Fill in the student details and payment information</p>
            </CardHeader>
            <CardContent className="p-8">
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
          <Card className="mt-8 border-0 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
              <CardTitle className="text-gray-800 font-bold">Recent Receipts</CardTitle>
              <p className="text-gray-600 text-sm">Quick access to recently generated receipts</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentReceipts.map((receipt) => (
                  <div 
                    key={receipt.id}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => setCurrentReceipt(receipt)}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{receipt.studentName}</p>
                      <p className="text-sm text-gray-600">Receipt: {receipt.receiptNumber}</p>
                      <p className="text-xs text-gray-500">{receipt.studentClass} • {receipt.term}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">₦{receipt.amountPaid.toLocaleString()}</p>
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
