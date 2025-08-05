import { supabase } from '@/integrations/supabase/client';
import { FeeTemplate } from '@/types/feeTemplate';

export const getFeeTemplates = async (): Promise<FeeTemplate[]> => {
  const { data, error } = await supabase
    .from('fee_templates')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching fee templates:', error);
    return [];
  }

  return data;
};

export const createFeeTemplate = async (template: Omit<FeeTemplate, 'id' | 'created_at' | 'created_by'>): Promise<FeeTemplate | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create fee templates');
  }

  const { data, error } = await supabase
    .from('fee_templates')
    .insert({
      name: template.name,
      category: template.category,
      amount: template.amount,
      description: template.description,
      is_active: template.is_active,
      created_by: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating fee template:', error);
    return null;
  }

  return data;
};

export const updateFeeTemplate = async (id: string, template: Partial<FeeTemplate>): Promise<FeeTemplate | null> => {
  const { data, error } = await supabase
    .from('fee_templates')
    .update(template)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating fee template:', error);
    return null;
  }

  return data;
};

export const deleteFeeTemplate = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('fee_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting fee template:', error);
    return false;
  }

  return true;
};