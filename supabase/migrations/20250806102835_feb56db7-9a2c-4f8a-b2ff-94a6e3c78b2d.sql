-- Add Summer School as a new fee category by inserting some default templates
INSERT INTO public.fee_templates (name, category, amount, description, is_active, created_by) VALUES
('Summer School Program', 'Summer School', 150000, 'Comprehensive summer learning program with activities and academic support', true, (SELECT auth.uid())),
('Summer School - Basic', 'Summer School', 100000, 'Basic summer school program', true, (SELECT auth.uid())),
('Summer School - Premium', 'Summer School', 200000, 'Premium summer school with additional activities and field trips', true, (SELECT auth.uid()));

-- Update existing lesson fee templates to have better naming
UPDATE public.fee_templates 
SET name = 'Monthly Lesson Fee - ' || REPLACE(name, 'Lesson Fee - ', '')
WHERE name LIKE 'Lesson Fee - %';