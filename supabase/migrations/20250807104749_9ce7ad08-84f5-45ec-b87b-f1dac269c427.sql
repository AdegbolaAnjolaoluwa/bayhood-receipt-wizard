-- Create a table to track student debts and balances
CREATE TABLE public.student_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  term TEXT NOT NULL,
  session TEXT,
  total_fees_assigned NUMERIC NOT NULL DEFAULT 0,
  total_paid NUMERIC NOT NULL DEFAULT 0,
  outstanding_balance NUMERIC GENERATED ALWAYS AS (total_fees_assigned - total_paid) STORED,
  last_payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  
  -- Create unique constraint to prevent duplicate student accounts per term/session
  UNIQUE(student_name, student_class, term, session)
);

-- Enable Row Level Security
ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for student accounts
CREATE POLICY "Users can view all student accounts" 
ON public.student_accounts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create student accounts" 
ON public.student_accounts 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Users can update student accounts" 
ON public.student_accounts 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_student_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_accounts_updated_at
BEFORE UPDATE ON public.student_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_student_accounts_updated_at();

-- Add indexes for better performance
CREATE INDEX idx_student_accounts_name ON public.student_accounts(student_name);
CREATE INDEX idx_student_accounts_class ON public.student_accounts(student_class);
CREATE INDEX idx_student_accounts_outstanding ON public.student_accounts(outstanding_balance);

-- Add a custom_payments table for payments not in the fee templates
CREATE TABLE public.custom_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  term TEXT NOT NULL,
  session TEXT,
  payment_method TEXT DEFAULT 'Cash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable Row Level Security
ALTER TABLE public.custom_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for custom payments
CREATE POLICY "Users can view all custom payments" 
ON public.custom_payments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create custom payments" 
ON public.custom_payments 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Users can update custom payments they created" 
ON public.custom_payments 
FOR UPDATE 
USING (auth.uid() = created_by);