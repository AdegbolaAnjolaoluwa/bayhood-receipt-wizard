import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, DollarSign, Users, TrendingUp, Search, Filter } from 'lucide-react';

interface StudentAccount {
  id: string;
  student_name: string;
  student_class: string;
  term: string;
  session: string;
  total_fees_assigned: number;
  total_paid: number;
  outstanding_balance: number;
  last_payment_date: string;
  created_at: string;
}

const DebtTracker = () => {
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<StudentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('all'); // 'all', 'owing', 'paid'

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchTerm, classFilter, termFilter, balanceFilter]);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('student_accounts')
        .select('*')
        .order('outstanding_balance', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading student accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAccounts = () => {
    let filtered = accounts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.student_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Class filter
    if (classFilter && classFilter !== 'all-classes') {
      filtered = filtered.filter(account => account.student_class === classFilter);
    }

    // Term filter
    if (termFilter && termFilter !== 'all-terms') {
      filtered = filtered.filter(account => account.term === termFilter);
    }

    // Balance filter
    if (balanceFilter === 'owing') {
      filtered = filtered.filter(account => account.outstanding_balance > 0);
    } else if (balanceFilter === 'paid') {
      filtered = filtered.filter(account => account.outstanding_balance <= 0);
    }

    setFilteredAccounts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setClassFilter('');
    setTermFilter('');
    setBalanceFilter('all');
  };

  // Calculate statistics
  const totalOwing = accounts.reduce((sum, account) => sum + Math.max(0, account.outstanding_balance), 0);
  const studentsOwing = accounts.filter(account => account.outstanding_balance > 0).length;
  const totalStudents = accounts.length;
  const averageDebt = studentsOwing > 0 ? totalOwing / studentsOwing : 0;

  // Get unique classes and terms for filters
  const uniqueClasses = [...new Set(accounts.map(account => account.student_class))];
  const uniqueTerms = [...new Set(accounts.map(account => account.term))];

  const getBalanceColor = (balance: number) => {
    if (balance > 50000) return 'bg-red-100 text-red-800 border-red-200';
    if (balance > 20000) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (balance > 0) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getBalanceStatus = (balance: number) => {
    if (balance > 0) return 'OWES';
    if (balance === 0) return 'PAID';
    return 'OVERPAID';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading debt tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-6">
          <img 
            src="/lovable-uploads/ca706d69-cfe9-4cc0-80e4-21dcb229992a.png" 
            alt="Bayhood Preparatory School Logo" 
            className="h-16 w-16 object-contain"
          />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Student Debt Tracker</h2>
            <p className="text-slate-600 mt-1">Monitor outstanding balances and payment status</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Total Outstanding</p>
                <p className="text-3xl font-bold">₦{totalOwing.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Students Owing</p>
                <p className="text-3xl font-bold">{studentsOwing}</p>
                <p className="text-orange-100 text-xs">of {totalStudents} total</p>
              </div>
              <Users className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Average Debt</p>
                <p className="text-3xl font-bold">₦{averageDebt.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Payment Rate</p>
                <p className="text-3xl font-bold">{totalStudents > 0 ? Math.round(((totalStudents - studentsOwing) / totalStudents) * 100) : 0}%</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-classes">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <Select value={termFilter} onValueChange={setTermFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-terms">All Terms</SelectItem>
                  {uniqueTerms.map(term => (
                    <SelectItem key={term} value={term}>{term}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance Status</label>
              <Select value={balanceFilter} onValueChange={setBalanceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="owing">Students Owing</SelectItem>
                  <SelectItem value="paid">Fully Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Account Balances ({filteredAccounts.length} students)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Student Name</th>
                  <th className="text-left p-3 font-semibold">Class</th>
                  <th className="text-left p-3 font-semibold">Term</th>
                  <th className="text-left p-3 font-semibold">Session</th>
                  <th className="text-right p-3 font-semibold">Total Fees</th>
                  <th className="text-right p-3 font-semibold">Paid</th>
                  <th className="text-right p-3 font-semibold">Outstanding</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Last Payment</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{account.student_name}</td>
                    <td className="p-3">{account.student_class}</td>
                    <td className="p-3">{account.term}</td>
                    <td className="p-3">{account.session || 'N/A'}</td>
                    <td className="p-3 text-right">₦{account.total_fees_assigned.toLocaleString()}</td>
                    <td className="p-3 text-right text-green-600 font-semibold">₦{account.total_paid.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold">
                      <span className={account.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}>
                        ₦{Math.abs(account.outstanding_balance).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={getBalanceColor(account.outstanding_balance)}>
                        {getBalanceStatus(account.outstanding_balance)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {account.last_payment_date ? new Date(account.last_payment_date).toLocaleDateString() : 'No payments'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAccounts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No student accounts found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebtTracker;