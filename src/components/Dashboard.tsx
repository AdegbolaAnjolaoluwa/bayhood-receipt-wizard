import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleReceiptForm from './SimpleReceiptForm';
import ReceiptCard from './ReceiptCard';
import ReceiptTable from './ReceiptTable';
import PupilDashboard from './PupilDashboard';
import ReportingDashboard from './ReportingDashboard';
import ReceiptSearchFilter from './ReceiptSearchFilter';
import FeeTemplateManagement from './FeeTemplateManagement';
import AdvancedAnalytics from './AdvancedAnalytics';
import EnhancedReceiptForm from './EnhancedReceiptForm';
import PasswordChange from './PasswordChange';
import UserManagement from './UserManagement';
import { Receipt } from '@/types/receipt';
import { createSupabaseReceipt, getSupabaseReceipts } from '@/services/supabaseReceiptService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileText, 
  Users, 
  DollarSign, 
  Calendar, 
  Menu, 
  User, 
  BarChart, 
  TrendingUp, 
  Settings, 
  Plus, 
  LogOut,
  Home
} from 'lucide-react';

interface DashboardProps {
  user: {
    username: string;
    role: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'receipts' | 'simple-form' | 'enhanced-form' | 'fee-templates' | 'analytics' | 'reporting' | 'password-change' | 'user-management'>('dashboard');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');

  useEffect(() => {
    loadReceipts();
  }, []);

  // Filter receipts when filters change
  useEffect(() => {
    let filtered = receipts;

    if (searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (classFilter) {
      filtered = filtered.filter(receipt => receipt.studentClass === classFilter);
    }

    if (termFilter) {
      filtered = filtered.filter(receipt => receipt.term === termFilter);
    }

    if (sessionFilter) {
      filtered = filtered.filter(receipt => receipt.session === sessionFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter(receipt => 
        new Date(receipt.paymentDate) >= dateFrom
      );
    }

    if (dateTo) {
      filtered = filtered.filter(receipt => 
        new Date(receipt.paymentDate) <= dateTo
      );
    }

    if (amountFrom) {
      filtered = filtered.filter(receipt => 
        receipt.amountPaid >= parseFloat(amountFrom)
      );
    }

    if (amountTo) {
      filtered = filtered.filter(receipt => 
        receipt.amountPaid <= parseFloat(amountTo)
      );
    }

    setFilteredReceipts(filtered);
  }, [receipts, searchTerm, classFilter, termFilter, sessionFilter, dateFrom, dateTo, amountFrom, amountTo]);

  const loadReceipts = async () => {
    console.log('Loading receipts...');
    const data = await getSupabaseReceipts();
    console.log('Loaded receipts:', data);
    setReceipts(data);
    setLoading(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setClassFilter('');
    setTermFilter('');
    setSessionFilter('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setAmountFrom('');
    setAmountTo('');
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
    feeBreakdown?: Array<{
      name: string;
      category: string;
      amount: number;
      quantity: number;
    }>;
  }) => {
    console.log('Dashboard handleSimpleReceiptSubmit called with:', receiptData);
    setReceiptLoading(true);
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

      // Handle fee breakdown from enhanced form
      if (receiptData.feeBreakdown && receiptData.feeBreakdown.length > 0) {
        const breakdown = receiptData.feeBreakdown
          .map(fee => `${fee.name}${fee.quantity > 1 ? ` (x${fee.quantity})` : ''}: ₦${(fee.amount * fee.quantity).toLocaleString()}`)
          .join(', ');
        enhancedDescription = breakdown;
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
      await loadReceipts();
      
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
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate stats
  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
  const thisMonth = receipts.filter(r => {
    const receiptDate = new Date(r.createdAt);
    const now = new Date();
    return receiptDate.getMonth() === now.getMonth() && receiptDate.getFullYear() === now.getFullYear();
  }).length;

  const uniqueStudents = new Set(receipts.map(r => r.studentName.toLowerCase())).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            {/* Logo and title */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <img 
                src="/lovable-uploads/5c6ce8b6-a29d-4cde-9dcd-8a3d504cd230.png" 
                alt="Bayhood Preparatory School Logo" 
                className="h-12 sm:h-16 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  Fee Receipt Management System
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Professional • Secure • Efficient</p>
              </div>
            </div>
            
            {/* User info and logout */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right bg-gradient-to-r from-blue-100 to-green-100 px-4 py-2 rounded-lg border border-blue-200">
                <p className="font-bold text-gray-800 text-sm">{user.username}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="outline"
                size="sm"
                className="border-2 border-gray-300"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-100 to-green-100 p-3 rounded-lg border border-blue-200">
                  <p className="font-bold text-gray-800 text-sm">{user.username}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
                
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold text-sm gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-20 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col min-h-0">
            <nav className="flex-1 px-6 py-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'dashboard'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('receipts')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'receipts'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    All Receipts
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('simple-form')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'simple-form'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="mr-3 h-5 w-5" />
                    Quick Receipt
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('enhanced-form')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'enhanced-form'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <DollarSign className="mr-3 h-5 w-5" />
                    Enhanced Receipt
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('fee-templates')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'fee-templates'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Fee Templates
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('analytics')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'analytics'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <TrendingUp className="mr-3 h-5 w-5" />
                    Analytics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('reporting')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'reporting'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart className="mr-3 h-5 w-5" />
                    Reports
                  </button>
                </li>
                {user.role === 'Admin' && (
                  <>
                    <li>
                      <button
                        onClick={() => setCurrentView('user-management')}
                        className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          currentView === 'user-management'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Users className="mr-3 h-5 w-5" />
                        User Management
                      </button>
                    </li>
                  </>
                )}
                <li>
                  <button
                    onClick={() => setCurrentView('password-change')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'password-change'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Change Password
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex-1">
          {/* Stats Cards for Dashboard */}
          {currentView === 'dashboard' && (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white font-semibold text-base">Total Receipts</CardTitle>
                      <FileText className="w-6 h-6 text-blue-100" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{loading ? '...' : receipts.length}</p>
                    <p className="text-blue-100 text-sm mt-1">All time receipts</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white font-semibold text-base">Total Amount</CardTitle>
                      <DollarSign className="w-6 h-6 text-green-100" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{loading ? '...' : `₦${totalAmount.toLocaleString()}`}</p>
                    <p className="text-green-100 text-sm mt-1">Total collected</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white font-semibold text-base">This Month</CardTitle>
                      <Calendar className="w-6 h-6 text-purple-100" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{loading ? '...' : thisMonth}</p>
                    <p className="text-purple-100 text-sm mt-1">Recent receipts</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white font-semibold text-base">Students</CardTitle>
                      <Users className="w-6 h-6 text-orange-100" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{loading ? '...' : uniqueStudents}</p>
                    <p className="text-orange-100 text-sm mt-1">Active students</p>
                  </CardContent>
                </Card>
              </div>

              <PupilDashboard 
                receipts={receipts} 
                loading={loading}
                onBack={() => setCurrentView('dashboard')}
                onViewReceipt={setCurrentReceipt}
              />
            </div>
          )}

          <main className="flex-1 overflow-auto">
            {currentView === 'receipts' && (
              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">All Receipts</h2>
                <ReceiptSearchFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  classFilter={classFilter}
                  onClassFilterChange={setClassFilter}
                  termFilter={termFilter}
                  onTermFilterChange={setTermFilter}
                  sessionFilter={sessionFilter}
                  onSessionFilterChange={setSessionFilter}
                  dateFrom={dateFrom}
                  onDateFromChange={setDateFrom}
                  dateTo={dateTo}
                  onDateToChange={setDateTo}
                  amountFrom={amountFrom}
                  onAmountFromChange={setAmountFrom}
                  amountTo={amountTo}
                  onAmountToChange={setAmountTo}
                  onClearFilters={clearFilters}
                />
                <ReceiptTable 
                  receipts={filteredReceipts} 
                  loading={loading}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onView={setCurrentReceipt}
                />
              </div>
            )}
            
            {currentView === 'simple-form' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Receipt Generator</h2>
                <SimpleReceiptForm onSubmit={handleSimpleReceiptSubmit} loading={receiptLoading} />
              </div>
            )}
            
            {currentView === 'enhanced-form' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Enhanced Receipt Generator</h2>
                <EnhancedReceiptForm onGenerate={handleSimpleReceiptSubmit} loading={receiptLoading} />
              </div>
            )}
            
            {currentView === 'fee-templates' && (
              <div className="p-6">
                <FeeTemplateManagement />
              </div>
            )}
            
            {currentView === 'analytics' && (
              <div className="p-6">
                <AdvancedAnalytics />
              </div>
            )}
            
            {currentView === 'reporting' && (
              <div className="p-6">
                <ReportingDashboard 
                  receipts={receipts} 
                  loading={loading}
                  onBack={() => setCurrentView('dashboard')}
                />
              </div>
            )}
            
            {currentView === 'password-change' && (
              <div className="p-6">
                <PasswordChange onPasswordChanged={() => toast({ title: "Success", description: "Password changed successfully!" })} />
              </div>
            )}
            
            {currentView === 'user-management' && (
              <div className="p-6">
                <UserManagement />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Receipt modal */}
      {currentReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div>
              <ReceiptCard 
                receipt={currentReceipt} 
                onEdit={() => {}} 
              />
              <div className="p-4 text-center">
                <Button onClick={() => setCurrentReceipt(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;