
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Receipt } from '@/types/receipt';
import { Search, Filter, Calendar, X, ChevronDown } from 'lucide-react';

interface ReceiptTableProps {
  receipts: Receipt[];
  loading: boolean;
  onEdit: (receipt: Receipt) => void;
  onDelete: (receiptId: string) => void;
  onView: (receipt: Receipt) => void;
}

const ReceiptTable = ({ receipts, loading, onEdit, onDelete, onView }: ReceiptTableProps) => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filter dropdowns
  const uniqueClasses = useMemo(() => 
    [...new Set(receipts.map(r => r.studentClass))].sort(), [receipts]
  );
  const uniqueTerms = useMemo(() => 
    [...new Set(receipts.map(r => r.term))].sort(), [receipts]
  );
  const uniqueSessions = useMemo(() => 
    [...new Set(receipts.map(r => r.session))].sort(), [receipts]
  );

  // Quick date filters
  const getDateRange = (filter: string) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfThisTerm = new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1);
    
    switch (filter) {
      case 'thisMonth':
        return { start: startOfMonth, end: now };
      case 'lastMonth':
        return { start: startOfLastMonth, end: endOfLastMonth };
      case 'thisTerm':
        return { start: startOfThisTerm, end: now };
      default:
        return null;
    }
  };

  // Filter receipts based on all criteria
  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          receipt.studentName.toLowerCase().includes(searchLower) ||
          receipt.receiptNumber.toLowerCase().includes(searchLower) ||
          (receipt.description && receipt.description.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Class filter
      if (selectedClass && receipt.studentClass !== selectedClass) return false;

      // Term filter
      if (selectedTerm && receipt.term !== selectedTerm) return false;

      // Session filter
      if (selectedSession && receipt.session !== selectedSession) return false;

      // Amount range filter
      if (minAmount && receipt.amountPaid < parseFloat(minAmount)) return false;
      if (maxAmount && receipt.amountPaid > parseFloat(maxAmount)) return false;

      // Date filter
      if (dateFilter) {
        const dateRange = getDateRange(dateFilter);
        if (dateRange) {
          const receiptDate = new Date(receipt.createdAt);
          if (receiptDate < dateRange.start || receiptDate > dateRange.end) return false;
        }
      }

      return true;
    });
  }, [receipts, searchTerm, selectedClass, selectedTerm, selectedSession, dateFilter, minAmount, maxAmount]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedClass('');
    setSelectedTerm('');
    setSelectedSession('');
    setDateFilter('');
    setMinAmount('');
    setMaxAmount('');
  };

  const hasActiveFilters = searchTerm || selectedClass || selectedTerm || selectedSession || dateFilter || minAmount || maxAmount;

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
            <p className="text-lg mb-2">Loading receipts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (receipts.length === 0) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No receipts found</p>
            <p>Create your first receipt to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-blue-800">
            All Receipts ({filteredReceipts.length}{filteredReceipts.length !== receipts.length ? ` of ${receipts.length}` : ''})
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by student name, receipt number, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Quick Date Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setDateFilter(dateFilter === 'thisMonth' ? '' : 'thisMonth')}
              variant={dateFilter === 'thisMonth' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              This Month
            </Button>
            <Button
              onClick={() => setDateFilter(dateFilter === 'lastMonth' ? '' : 'lastMonth')}
              variant={dateFilter === 'lastMonth' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Last Month
            </Button>
            <Button
              onClick={() => setDateFilter(dateFilter === 'thisTerm' ? '' : 'thisTerm')}
              variant={dateFilter === 'thisTerm' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              This Term
            </Button>
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {uniqueClasses.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Term</label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Terms</SelectItem>
                    {uniqueTerms.map(term => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Session</label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sessions</SelectItem>
                    {uniqueSessions.map(session => (
                      <SelectItem key={session} value={session}>{session}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Amount Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-full text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchTerm('')} />
                </Badge>
              )}
              {selectedClass && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Class: {selectedClass}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedClass('')} />
                </Badge>
              )}
              {selectedTerm && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Term: {selectedTerm}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedTerm('')} />
                </Badge>
              )}
              {selectedSession && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Session: {selectedSession}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedSession('')} />
                </Badge>
              )}
              {dateFilter && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  {dateFilter === 'thisMonth' ? 'This Month' : dateFilter === 'lastMonth' ? 'Last Month' : 'This Term'}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setDateFilter('')} />
                </Badge>
              )}
              {(minAmount || maxAmount) && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Amount: {minAmount || '0'} - {maxAmount || '∞'}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => { setMinAmount(''); setMaxAmount(''); }} />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No receipts found</p>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold">Receipt No.</TableHead>
                  <TableHead className="font-bold">Student Name</TableHead>
                  <TableHead className="font-bold">Class</TableHead>
                  <TableHead className="font-bold">Term</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id} className="hover:bg-blue-50">
                    <TableCell className="font-medium text-blue-600">
                      {receipt.receiptNumber}
                    </TableCell>
                    <TableCell className="font-semibold">{receipt.studentName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {receipt.studentClass}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {receipt.term}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(receipt.amountPaid)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(receipt.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => onView(receipt)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => onEdit(receipt)}
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50 text-xs px-2 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this receipt?')) {
                              onDelete(receipt.id);
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50 text-xs px-2 py-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceiptTable;
