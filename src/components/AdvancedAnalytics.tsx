import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import { Receipt } from '@/types/receipt';
import { getSupabaseReceipts } from '@/services/supabaseReceiptService';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface AnalyticsData {
  totalRevenue: number;
  totalStudents: number;
  averagePayment: number;
  totalReceipts: number;
  monthlyRevenue: Array<{ month: string; revenue: number; receipts: number }>;
  classDistribution: Array<{ class: string; count: number; revenue: number }>;
  termRevenue: Array<{ term: string; revenue: number }>;
  recentTrends: Array<{ date: string; amount: number }>;
}

const AdvancedAnalytics: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('6months');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalStudents: 0,
    averagePayment: 0,
    totalReceipts: 0,
    monthlyRevenue: [],
    classDistribution: [],
    termRevenue: [],
    recentTrends: []
  });

  useEffect(() => {
    loadReceipts();
  }, []);

  useEffect(() => {
    if (receipts.length > 0) {
      calculateAnalytics();
    }
  }, [receipts, timeRange]);

  const loadReceipts = async () => {
    setLoading(true);
    const data = await getSupabaseReceipts();
    setReceipts(data);
    setLoading(false);
  };

  const getFilteredReceipts = () => {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case '1month':
        cutoffDate = subMonths(now, 1);
        break;
      case '3months':
        cutoffDate = subMonths(now, 3);
        break;
      case '6months':
        cutoffDate = subMonths(now, 6);
        break;
      case '1year':
        cutoffDate = subMonths(now, 12);
        break;
      default:
        cutoffDate = subMonths(now, 6);
    }

    return receipts.filter(receipt => 
      parseISO(receipt.paymentDate) >= cutoffDate
    );
  };

  const calculateAnalytics = () => {
    const filteredReceipts = getFilteredReceipts();
    
    // Basic metrics
    const totalRevenue = filteredReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
    const uniqueStudents = new Set(filteredReceipts.map(r => r.studentName.toLowerCase())).size;
    const averagePayment = filteredReceipts.length > 0 ? totalRevenue / filteredReceipts.length : 0;

    // Monthly revenue
    const monthlyData: Record<string, { revenue: number; receipts: number }> = {};
    filteredReceipts.forEach(receipt => {
      const month = format(parseISO(receipt.paymentDate), 'MMM yyyy');
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, receipts: 0 };
      }
      monthlyData[month].revenue += receipt.amountPaid;
      monthlyData[month].receipts += 1;
    });

    const monthlyRevenue = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Class distribution
    const classData: Record<string, { count: number; revenue: number }> = {};
    filteredReceipts.forEach(receipt => {
      if (!classData[receipt.studentClass]) {
        classData[receipt.studentClass] = { count: 0, revenue: 0 };
      }
      classData[receipt.studentClass].count += 1;
      classData[receipt.studentClass].revenue += receipt.amountPaid;
    });

    const classDistribution = Object.entries(classData)
      .map(([className, data]) => ({ class: className, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    // Term revenue
    const termData: Record<string, number> = {};
    filteredReceipts.forEach(receipt => {
      termData[receipt.term] = (termData[receipt.term] || 0) + receipt.amountPaid;
    });

    const termRevenue = Object.entries(termData)
      .map(([term, revenue]) => ({ term, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // Recent trends (last 30 days)
    const thirtyDaysAgo = subMonths(new Date(), 1);
    const recentReceipts = receipts.filter(r => parseISO(r.paymentDate) >= thirtyDaysAgo);
    const dailyRevenue: Record<string, number> = {};
    
    recentReceipts.forEach(receipt => {
      const date = format(parseISO(receipt.paymentDate), 'MMM dd');
      dailyRevenue[date] = (dailyRevenue[date] || 0) + receipt.amountPaid;
    });

    const recentTrends = Object.entries(dailyRevenue)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Last 14 days

    setAnalytics({
      totalRevenue,
      totalStudents: uniqueStudents,
      averagePayment,
      totalReceipts: filteredReceipts.length,
      monthlyRevenue,
      classDistribution,
      termRevenue,
      recentTrends
    });
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange.replace(/(\d+)/, '$1 ')} period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Unique paying students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{analytics.averagePayment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per receipt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalReceipts}</div>
            <p className="text-xs text-muted-foreground">
              Generated receipts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.classDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ class: className, percent }) => `${className} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {analytics.classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Term Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Term</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.termRevenue} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="term" type="category" />
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue Trend (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.recentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;