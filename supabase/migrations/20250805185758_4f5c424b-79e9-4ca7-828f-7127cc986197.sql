-- Create fee structure templates table
CREATE TABLE public.fee_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.fee_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for fee templates
CREATE POLICY "Users can view all fee templates" 
ON public.fee_templates 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create fee templates" 
ON public.fee_templates 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Users can update fee templates they created" 
ON public.fee_templates 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete fee templates they created" 
ON public.fee_templates 
FOR DELETE 
USING (auth.uid() = created_by);

-- Insert some default fee templates
INSERT INTO public.fee_templates (name, category, amount, description, created_by) VALUES
('School Fees - Term 1', 'Tuition', 50000.00, 'First term school fees', (SELECT id FROM auth.users LIMIT 1)),
('School Fees - Term 2', 'Tuition', 50000.00, 'Second term school fees', (SELECT id FROM auth.users LIMIT 1)),
('School Fees - Term 3', 'Tuition', 50000.00, 'Third term school fees', (SELECT id FROM auth.users LIMIT 1)),
('Textbooks', 'Books', 15000.00, 'Required textbooks and materials', (SELECT id FROM auth.users LIMIT 1)),
('School Transport', 'Transport', 20000.00, 'Monthly transportation fee', (SELECT id FROM auth.users LIMIT 1)),
('Uniform', 'Uniform', 8000.00, 'School uniform and accessories', (SELECT id FROM auth.users LIMIT 1)),
('Examination Fee', 'Examination', 5000.00, 'Terminal examination fee', (SELECT id FROM auth.users LIMIT 1)),
('Extra-curricular Activities', 'Activities', 10000.00, 'Sports and club activities', (SELECT id FROM auth.users LIMIT 1));

-- Add indexes for better performance
CREATE INDEX idx_fee_templates_category ON public.fee_templates(category);
CREATE INDEX idx_fee_templates_active ON public.fee_templates(is_active);