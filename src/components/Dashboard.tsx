
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const savedReceipts = localStorage.getItem('bayhood_receipts');
    if (savedReceipts) {
      setReceipts(JSON.parse(savedReceipts));
    }
  }, []);

  const saveReceiptsToStorage = (updatedReceipts: Receipt[]) => {
    localStorage.setItem('bayhood_receipts', JSON.stringify(updatedReceipts));
    setReceipts(updatedReceipts);
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `BPS${year}${month}${random}`;
  };

  const handleCreateReceipt = (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => {
    const newReceipt: Receipt = {
      ...receiptData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      receiptNumber: generateReceiptNumber(),
    };
    
    const updatedReceipts = [newReceipt, ...receipts];
    saveReceiptsToStorage(updatedReceipts);
    setSelectedReceipt(newReceipt);
  };

  const handleUpdateReceipt = (updatedReceipt: Receipt) => {
    const updatedReceipts = receipts.map(receipt =>
      receipt.id === updatedReceipt.id ? updatedReceipt : receipt
    );
    saveReceiptsToStorage(updatedReceipts);
    setEditingReceipt(null);
    setSelectedReceipt(updatedReceipt);
  };

  const handleDeleteReceipt = (receiptId: string) => {
    const updatedReceipts = receipts.filter(receipt => receipt.id !== receiptId);
    saveReceiptsToStorage(updatedReceipts);
    if (selectedReceipt?.id === receiptId) {
      setSelectedReceipt(null);
    }
  };

  const handleAIGenerate = (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => {
    handleCreateReceipt(receiptData);
  };

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
                onClick={onLogout}
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
