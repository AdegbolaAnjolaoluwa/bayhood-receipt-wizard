import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Receipt } from '@/types/receipt';
import { ArrowLeft, Download, TrendingUp, Users, DollarSign, Calendar, BarChart3, PieChart } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts';

interface ReportingDashboardProps {
  receipts: Receipt[];
  loading: boolean;
  onBack: () => void;
}

const ReportingDashboard = ({ receipts, loading, onBack }: ReportingDashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedSession, setSelectedSession] = useState<string>('all');

  // Get unique sessions
  const uniqueSessions = useMemo(() => {
    return [...new Set(receipts.map(r => r.session))].sort();
  }, [receipts]);

  // Filter receipts based on selected session
  const filteredReceipts = useMemo(() => {
    if (selectedSession === 'all') return receipts;
    return receipts.filter(r => r.session === selectedSession);
  }, [receipts, selectedSession]);

  // Payment trends over time
  const paymentTrends = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};
    
    filteredReceipts.forEach(receipt => {
      const date = new Date(receipt.createdAt);
      let key: string;
      
      if (selectedPeriod === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        key = `${date.getFullYear()}-Q${quarter}`;
      }
      
      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0 };
      }
      grouped[key].total += receipt.amountPaid;
      grouped[key].count += 1;
    });

    return Object.entries(grouped)
      .map(([period, data]) => ({
        period,
        amount: data.total,
        count: data.count
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }, [filteredReceipts, selectedPeriod]);

  // Class-wise breakdown
  const classBreakdown = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};
    
    filteredReceipts.forEach(receipt => {
      const className = receipt.studentClass;
      if (!grouped[className]) {
        grouped[className] = { total: 0, count: 0 };
      }
      grouped[className].total += receipt.amountPaid;
      grouped[className].count += 1;
    });

    return Object.entries(grouped)
      .map(([className, data]) => ({
        class: className,
        amount: data.total,
        count: data.count,
        percentage: ((data.total / filteredReceipts.reduce((sum, r) => sum + r.amountPaid, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredReceipts]);

  // Term-wise breakdown
  const termBreakdown = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};
    
    filteredReceipts.forEach(receipt => {
      const key = `${receipt.term} - ${receipt.session}`;
      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0 };
      }
      grouped[key].total += receipt.amountPaid;
      grouped[key].count += 1;
    });

    return Object.entries(grouped)
      .map(([term, data]) => ({
        term,
        amount: data.total,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredReceipts]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amountPaid, 0);
    const totalReceipts = filteredReceipts.length;
    const uniqueStudents = new Set(filteredReceipts.map(r => r.studentName)).size;
    const averagePayment = totalAmount / totalReceipts || 0;

    return {
      totalAmount,
      totalReceipts,
      uniqueStudents,
      averagePayment
    };
  }, [filteredReceipts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const exportData = () => {
    const csvContent = [
      ['Period', 'Amount', 'Receipt Count'],
      ...paymentTrends.map(item => [
        item.period,
        item.amount.toString(),
        item.count.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${selectedSession}-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  if (loading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg mb-2">Loading reporting data...</p>
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
                <BarChart3 className="w-5 h-5" />
                Payment Analytics & Reports
              </CardTitle>
            </div>
            <Button onClick={exportData} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  {uniqueSessions.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold text-sm">Total Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-blue-100" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{formatCurrency(summaryStats.totalAmount)}</p>
            <p className="text-blue-100 text-xs mt-1">All payments</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold text-sm">Total Receipts</CardTitle>
              <Calendar className="w-5 h-5 text-green-100" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{summaryStats.totalReceipts}</p>
            <p className="text-green-100 text-xs mt-1">Receipts issued</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold text-sm">Active Students</CardTitle>
              <Users className="w-5 h-5 text-purple-100" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{summaryStats.uniqueStudents}</p>
            <p className="text-purple-100 text-xs mt-1">Unique students</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold text-sm">Average Payment</CardTitle>
              <TrendingUp className="w-5 h-5 text-orange-100" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{formatCurrency(summaryStats.averagePayment)}</p>
            <p className="text-orange-100 text-xs mt-1">Per receipt</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Trends Chart */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Payment Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {paymentTrends.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No data available for the selected filters.</p>
            </div>
          ) : (
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => `₦${value.toLocaleString()}`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Class-wise Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Class-wise Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {classBreakdown.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No class data available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {classBreakdown.map((item, index) => (
                  <div key={item.class} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <span className="font-medium">{item.class}</span>
                        <div className="text-xs text-gray-500">
                          {item.count} receipt{item.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.amount)}</div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Term-wise Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {termBreakdown.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No term data available.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {termBreakdown.map((item, index) => (
                  <div key={item.term} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {item.term}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.count} receipt{item.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportingDashboard;