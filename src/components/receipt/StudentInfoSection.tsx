interface StudentInfoSectionProps {
  studentName: string;
  studentClass: string;
  term: string;
  session: string;
}

const StudentInfoSection = ({ 
  studentName, 
  studentClass, 
  term, 
  session 
}: StudentInfoSectionProps) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-blue-600 mb-6">STUDENT INFORMATION</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <span className="block text-slate-700 font-medium text-sm mb-1">Student Name:</span>
            <span className="font-bold text-blue-600 text-lg">{studentName}</span>
          </div>
          <div>
            <span className="block text-slate-700 font-medium text-sm mb-1">Class:</span>
            <span className="font-bold text-blue-600 text-lg">{studentClass}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <span className="block text-slate-700 font-medium text-sm mb-1">Term:</span>
            <span className="font-bold text-green-600 text-lg">{term}</span>
          </div>
          <div>
            <span className="block text-slate-700 font-medium text-sm mb-1">Session:</span>
            <span className="font-bold text-purple-600 text-lg">{session}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoSection;