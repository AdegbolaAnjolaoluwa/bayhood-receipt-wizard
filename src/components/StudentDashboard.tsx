import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt } from '@/types/receipt';
import { Search, User, DollarSign, Calendar, FileText, ArrowLeft, TrendingUp } from 'lucide-react';

interface StudentDashboardProps {
  receipts: Receipt[];
  loading: boolean;
  onBack: () => void;
  onViewReceipt: (receipt: Receipt) => void;
}

const StudentDashboard = ({ receipts, loading, onBack, onViewReceipt }: StudentDashboardProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique students from receipts
  const uniqueStudents = useMemo(() => {
    const students = [...new Set(receipts.map(r => r.studentName))].sort();
    return students.filter(student => 
      student.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [receipts, searchTerm]);

  // Get receipts for selected student
  const studentReceipts = useMemo(() => {
    if (!selectedStudent) return [];
    return receipts
      .filter(r => r.studentName === selectedStudent)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [receipts, selectedStudent]);

  // Calculate student statistics
  const studentStats = useMemo(() => {
    if (!selectedStudent || studentReceipts.length === 0) {
      return {
        totalPaid: 0,
        totalReceipts: 0,
        averagePayment: 0,
        lastPayment: null,
        currentClass: '',
        paymentsByTerm: {}
      };
    }

    const totalPaid = studentReceipts.reduce((sum, r) => sum + r.amountPaid, 0);
    const totalReceipts = studentReceipts.length;
    const averagePayment = totalPaid / totalReceipts;
    const lastPayment = studentReceipts[0];
    const currentClass = lastPayment?.studentClass || '';
    
    // Group payments by term
    const paymentsByTerm: Record<string, { count: number; total: number }> = {};
    studentReceipts.forEach(receipt => {
      const key = `${receipt.term} - ${receipt.session}`;
      if (!paymentsByTerm[key]) {
        paymentsByTerm[key] = { count: 0, total: 0 };
      }
      paymentsByTerm[key].count++;
      paymentsByTerm[key].total += receipt.amountPaid;
    });

    return {
      totalPaid,
      totalReceipts,
      averagePayment,
      lastPayment,
      currentClass,
      paymentsByTerm
    };
  }, [selectedStudent, studentReceipts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg mb-2">Loading student data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Student Dashboard
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Student Search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search Students</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Type student name to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueStudents.length === 0 ? (
                      <SelectItem value="" disabled>No students found</SelectItem>
                    ) : (
                      uniqueStudents.map(student => (
                        <SelectItem key={student} value={student}>{student}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Statistics */}
      {selectedStudent && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-semibold text-sm">Total Paid</CardTitle>
                  <DollarSign className="w-5 h-5 text-blue-100" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{formatCurrency(studentStats.totalPaid)}</p>
                <p className="text-blue-100 text-xs mt-1">All payments</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-semibold text-sm">Receipts</CardTitle>
                  <FileText className="w-5 h-5 text-green-100" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{studentStats.totalReceipts}</p>
                <p className="text-green-100 text-xs mt-1">Total receipts</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-semibold text-sm">Average</CardTitle>
                  <TrendingUp className="w-5 h-5 text-purple-100" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{formatCurrency(studentStats.averagePayment)}</p>
                <p className="text-purple-100 text-xs mt-1">Per payment</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-semibold text-sm">Last Payment</CardTitle>
                  <Calendar className="w-5 h-5 text-orange-100" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-bold">
                  {studentStats.lastPayment ? formatDate(studentStats.lastPayment.createdAt) : 'N/A'}
                </p>
                <p className="text-orange-100 text-xs mt-1">Most recent</p>
              </CardContent>
            </Card>
          </div>

          {/* Student Info Card */}
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                {selectedStudent}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Current Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Class:</span>
                      <Badge variant="outline">{studentStats.currentClass}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Receipts:</span>
                      <span className="font-semibold">{studentStats.totalReceipts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(studentStats.totalPaid)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Payment Summary by Term</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {Object.entries(studentStats.paymentsByTerm).map(([term, data]) => (
                      <div key={term} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{term}:</span>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(data.total)}</div>
                          <div className="text-xs text-gray-500">({data.count} receipt{data.count !== 1 ? 's' : ''})</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Payment History ({studentReceipts.length} receipts)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {studentReceipts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg mb-2">No payment history found</p>
                  <p>This student has no recorded payments.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-bold">Receipt No.</TableHead>
                        <TableHead className="font-bold">Date</TableHead>
                        <TableHead className="font-bold">Class</TableHead>
                        <TableHead className="font-bold">Term/Session</TableHead>
                        <TableHead className="font-bold">Amount</TableHead>
                        <TableHead className="font-bold">Description</TableHead>
                        <TableHead className="font-bold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentReceipts.map((receipt) => (
                        <TableRow key={receipt.id} className="hover:bg-blue-50">
                          <TableCell className="font-medium text-blue-600">
                            {receipt.receiptNumber}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {formatDate(receipt.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {receipt.studentClass}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                {receipt.term}
                              </Badge>
                              <div className="text-xs text-gray-500">{receipt.session}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(receipt.amountPaid)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                            {receipt.description || 'No description'}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => onViewReceipt(receipt)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* No Student Selected State */}
      {!selectedStudent && (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Student</h3>
            <p className="text-gray-500 mb-4">Choose a student from the dropdown above to view their payment history and statistics.</p>
            <div className="text-sm text-gray-400">
              Total students in system: <span className="font-semibold">{uniqueStudents.length}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;