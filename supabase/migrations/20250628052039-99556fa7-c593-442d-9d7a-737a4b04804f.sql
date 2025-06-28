
-- Create receipts table to store all generated receipts
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  term TEXT NOT NULL,
  session TEXT NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  receipt_data JSONB -- Store complete receipt data as JSON
);

-- Enable Row Level Security
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for receipts table
CREATE POLICY "Users can view all receipts" 
  ON public.receipts 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create receipts" 
  ON public.receipts 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Users can update receipts they created" 
  ON public.receipts 
  FOR UPDATE 
  USING (auth.uid() = created_by);

-- Create simple index for created_at for date-based queries
CREATE INDEX idx_receipts_created_at ON public.receipts (created_at);

-- Create index for student name searches
CREATE INDEX idx_receipts_student_name ON public.receipts (student_name);
