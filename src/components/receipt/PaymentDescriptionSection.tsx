interface PaymentDescriptionSectionProps {
  studentName: string;
  totalAmount: number;
  paymentMethod: string;
}

const PaymentDescriptionSection = ({ 
  studentName, 
  totalAmount, 
  paymentMethod 
}: PaymentDescriptionSectionProps) => {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-bold text-slate-900 mb-3">Payment Description:</h4>
      <p className="text-slate-700 text-base leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
        {studentName} - Tuition: ₦{totalAmount.toLocaleString()} | Discount Applied: 0% | Payment Method: {paymentMethod} | Status: PAID IN FULL
      </p>
    </div>
  );
};

export default PaymentDescriptionSection;