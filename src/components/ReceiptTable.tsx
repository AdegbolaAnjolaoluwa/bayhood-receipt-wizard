
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt } from '@/types/receipt';

interface ReceiptTableProps {
  receipts: Receipt[];
  loading: boolean;
  onEdit: (receipt: Receipt) => void;
  onDelete: (receiptId: string) => void;
  onView: (receipt: Receipt) => void;
}

const ReceiptTable = ({ receipts, loading, onEdit, onDelete, onView }: ReceiptTableProps) => {
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
        <CardTitle className="text-blue-800">All Receipts ({receipts.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold">Receipt No.</TableHead>
                <TableHead className="font-bold">Payer Name</TableHead>
                <TableHead className="font-bold">Purpose</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Date Created</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id} className="hover:bg-blue-50">
                  <TableCell className="font-medium text-blue-600">
                    {receipt.receiptNumber}
                  </TableCell>
                  <TableCell className="font-semibold">{receipt.studentName}</TableCell>
                  <TableCell className="max-w-xs truncate" title={receipt.description}>
                    {receipt.description || 'N/A'}
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(receipt.amountPaid)}
                  </TableCell>
                  <TableCell>{formatDate(receipt.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onView(receipt)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => onEdit(receipt)}
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
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
                        className="border-red-500 text-red-600 hover:bg-red-50"
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
      </CardContent>
    </Card>
  );
};

export default ReceiptTable;
