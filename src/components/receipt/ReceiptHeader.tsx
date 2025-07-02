interface ReceiptHeaderProps {
  logoSrc: string;
  schoolName: string;
  tagline: string;
  address: string;
  phone: string;
}

const ReceiptHeader = ({ 
  logoSrc, 
  schoolName, 
  tagline, 
  address, 
  phone 
}: ReceiptHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <img 
          src={logoSrc}
          alt="Bayhood Preparatory School Logo" 
          className="h-16 sm:h-20 w-auto"
        />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
        {schoolName}
      </h1>
      <p className="text-sm sm:text-base font-bold text-blue-600 mb-4">
        {tagline}
      </p>
      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
        <p>Creche | Preschool | Nursery | Afterschool</p>
        <p>{address}</p>
        <p>Phone: {phone}</p>
      </div>
    </div>
  );
};

export default ReceiptHeader;