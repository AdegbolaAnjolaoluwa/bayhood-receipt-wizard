import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Receipt } from '@/types/receipt';

interface AIReceiptGeneratorProps {
  onGenerate: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>) => void;
}

const AIReceiptGenerator = ({ onGenerate }: AIReceiptGeneratorProps) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);

  const parseInput = (text: string) => {
    setError('');
    setIsProcessing(true);

    try {
      // Simple AI-like parsing logic
      const lowerText = text.toLowerCase();
      
      // Extract student name
      const nameMatch = lowerText.match(/(?:for|receipt for|generate.*for)\s+([^,]+)/i);
      const studentName = nameMatch ? nameMatch[1].trim() : '';

      // Extract class
      const classMatch = lowerText.match(/(?:class|grade|primary|secondary|nursery|jss|sss)\s+(\d+|[a-z]+\s*\d*)/i);
      let studentClass = '';
      if (classMatch) {
        const classText = classMatch[0];
        if (classText.includes('primary')) studentClass = `Primary ${classMatch[1]}`;
        else if (classText.includes('nursery')) studentClass = `Nursery ${classMatch[1]}`;
        else if (classText.includes('jss')) studentClass = `JSS ${classMatch[1]}`;
        else if (classText.includes('sss')) studentClass = `SSS ${classMatch[1]}`;
        else studentClass = classMatch[0];
      }

      // Extract amount
      const amountMatch = lowerText.match(/(?:₦|naira|amount|paid|pay)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
      const amountPaid = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;

      // Extract description
      const descriptionMatch = lowerText.match(/(?:for|payment for|paying for)\s+([^,]+?)(?:\s+paid|\s+amount|\s+₦|$)/i);
      let description = '';
      if (descriptionMatch && descriptionMatch[1] && !descriptionMatch[1].includes('term')) {
        description = descriptionMatch[1].trim();
      } else {
        description = 'School fees';
      }

      // Extract date
      const dateMatch = lowerText.match(/(?:on|date|paid on)\s+([^.]+)/i);
      let paymentDate = '';
      if (dateMatch) {
        const dateStr = dateMatch[1].trim();
        // Try to parse various date formats
        if (dateStr.includes('today')) {
          paymentDate = new Date().toISOString().split('T')[0];
        } else if (dateStr.includes('yesterday')) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          paymentDate = yesterday.toISOString().split('T')[0];
        } else {
          // Try to parse date formats like "June 10", "10/06/2024", etc.
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            paymentDate = parsedDate.toISOString().split('T')[0];
          }
        }
      }

      // Extract term
      const termMatch = lowerText.match(/(?:first|second|third|1st|2nd|3rd)\s+term/i);
      let term = '';
      if (termMatch) {
        const termText = termMatch[0].toLowerCase();
        if (termText.includes('first') || termText.includes('1st')) term = 'First Term';
        else if (termText.includes('second') || termText.includes('2nd')) term = 'Second Term';
        else if (termText.includes('third') || termText.includes('3rd')) term = 'Third Term';
      }

      // Default session (current academic year)
      const currentYear = new Date().getFullYear();
      const session = `${currentYear}/${currentYear + 1}`;

      const parsed = {
        studentName: studentName || '',
        studentClass: studentClass || '',
        term: term || 'First Term',
        session,
        amountPaid: amountPaid || 0,
        paymentDate: paymentDate || new Date().toISOString().split('T')[0],
        description: description || 'School fees',
      };

      setParsedData(parsed);
      
      // Validate required fields
      if (!parsed.studentName || !parsed.studentClass || !parsed.amountPaid) {
        setError('Could not extract all required information. Please provide: student name, class, and amount paid.');
      }

    } catch (err) {
      setError('Failed to parse the input. Please try again with a clearer format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = () => {
    if (parsedData && parsedData.studentName && parsedData.studentClass && parsedData.amountPaid) {
      onGenerate(parsedData);
      setInput('');
      setParsedData(null);
    }
  };

  const examples = [
    "Generate a receipt for Mary Johnson, Primary 5, ₦25,000 paid on June 10 for first term school fees.",
    "Create receipt for John Smith in JSS 2, amount ₦40,000, paid today, second term development levy.",
    "Receipt for Sarah Williams, Nursery 3, ₦15,000 payment on 15/06/2024 for uniform fees.",
  ];

  return (
    <Card className="border-2 border-red-200">
      <CardHeader className="bg-gradient-to-r from-red-100 to-blue-100">
        <CardTitle className="text-red-800">AI Receipt Generator</CardTitle>
        <p className="text-sm text-gray-600">
          Describe the receipt you want to create in natural language
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe the receipt
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: Generate a receipt for Mary Johnson, Primary 5, ₦25,000 paid on June 10 for first term school fees"
            className="min-h-[100px] border-2 border-gray-300 focus:border-red-500"
          />
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={() => parseInput(input)}
            disabled={!input.trim() || isProcessing}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isProcessing ? 'Processing...' : 'Parse Input'}
          </Button>
          
          {parsedData && !error && (
            <Button
              onClick={handleGenerate}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Generate Receipt
            </Button>
          )}
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {parsedData && !error && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Parsed Information:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Student:</strong> {parsedData.studentName}</div>
              <div><strong>Class:</strong> {parsedData.studentClass}</div>
              <div><strong>Term:</strong> {parsedData.term}</div>
              <div><strong>Session:</strong> {parsedData.session}</div>
              <div><strong>Amount:</strong> ₦{parsedData.amountPaid.toLocaleString()}</div>
              <div><strong>Date:</strong> {parsedData.paymentDate}</div>
              <div className="col-span-2"><strong>Description:</strong> {parsedData.description}</div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Example formats:</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded border border-blue-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIReceiptGenerator;
