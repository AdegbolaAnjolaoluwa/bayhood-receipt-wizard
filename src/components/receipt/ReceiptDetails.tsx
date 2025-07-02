interface ReceiptDetailsProps {
  receiptNumber: string;
  currentDate: string;
  totalAmount: number;
}

const ReceiptDetails = ({ receiptNumber, currentDate, totalAmount }: ReceiptDetailsProps) => {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <>
      {/* Divider */}
      <div className="border-t border-gray-300 mb-8"></div>

      {/* Receipt Header with Amount */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">OFFICIAL RECEIPT</h2>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center min-w-[200px]">
          <p className="text-sm font-bold text-gray-700 mb-2">AMOUNT PAID</p>
          <p className="text-3xl sm:text-4xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {/* Receipt Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium text-base">Receipt No:</span>
            <span className="font-bold text-slate-900 text-base">{receiptNumber}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium text-base">Date Issued:</span>
            <span className="font-bold text-green-600 text-base">{currentDate}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptDetails;