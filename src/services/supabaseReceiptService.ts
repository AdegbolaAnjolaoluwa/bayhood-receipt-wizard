
import { supabase } from '@/integrations/supabase/client';
import { Receipt } from '@/types/receipt';

// Generate a unique receipt number based on month and sequential numbering
const generateReceiptNumber = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  // Get count of receipts created this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  const { data: receipts, error } = await supabase
    .from('receipts')
    .select('id')
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString());
  
  if (error) {
    console.error('Error counting receipts:', error);
    // Fallback to timestamp-based numbering
    const time = Date.now().toString().slice(-4);
    return `BPS${year}${month}${time}`;
  }
  
  const monthlyCount = (receipts?.length || 0) + 1;
  const sequentialNumber = monthlyCount.toString().padStart(4, '0');
  
  return `BPS${year}${month}${sequentialNumber}`;
};

// Create a new receipt in Supabase
export const createSupabaseReceipt = async (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>): Promise<Receipt> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create receipts');
  }

  const receiptNumber = await generateReceiptNumber();
  
  const newReceipt: Omit<Receipt, 'id'> = {
    receiptNumber,
    createdAt: new Date().toISOString(),
    ...receiptData,
  };

  const { data, error } = await supabase
    .from('receipts')
    .insert({
      receipt_number: newReceipt.receiptNumber,
      student_name: newReceipt.studentName,
      student_class: newReceipt.studentClass,
      term: newReceipt.term,
      session: newReceipt.session,
      amount_paid: newReceipt.amountPaid,
      payment_date: newReceipt.paymentDate,
      description: newReceipt.description,
      created_by: user.id,
      receipt_data: newReceipt
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating receipt:', error);
    throw new Error('Failed to create receipt');
  }

  return {
    id: data.id,
    receiptNumber: data.receipt_number,
    studentName: data.student_name,
    studentClass: data.student_class,
    term: data.term,
    session: data.session,
    amountPaid: data.amount_paid,
    paymentDate: data.payment_date,
    description: data.description,
    createdAt: data.created_at,
  };
};

// Get all receipts from Supabase
export const getSupabaseReceipts = async (): Promise<Receipt[]> => {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching receipts:', error);
    return [];
  }

  return data.map(receipt => ({
    id: receipt.id,
    receiptNumber: receipt.receipt_number,
    studentName: receipt.student_name,
    studentClass: receipt.student_class,
    term: receipt.term,
    session: receipt.session,
    amountPaid: receipt.amount_paid,
    paymentDate: receipt.payment_date,
    description: receipt.description,
    createdAt: receipt.created_at,
  }));
};

// Update an existing receipt
export const updateSupabaseReceipt = async (id: string, receiptData: Partial<Receipt>): Promise<Receipt | null> => {
  const updateData: any = {};
  
  if (receiptData.studentName) updateData.student_name = receiptData.studentName;
  if (receiptData.studentClass) updateData.student_class = receiptData.studentClass;
  if (receiptData.term) updateData.term = receiptData.term;
  if (receiptData.session) updateData.session = receiptData.session;
  if (receiptData.amountPaid !== undefined) updateData.amount_paid = receiptData.amountPaid;
  if (receiptData.paymentDate) updateData.payment_date = receiptData.paymentDate;
  if (receiptData.description !== undefined) updateData.description = receiptData.description;

  const { data, error } = await supabase
    .from('receipts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating receipt:', error);
    return null;
  }

  return {
    id: data.id,
    receiptNumber: data.receipt_number,
    studentName: data.student_name,
    studentClass: data.student_class,
    term: data.term,
    session: data.session,
    amountPaid: data.amount_paid,
    paymentDate: data.payment_date,
    description: data.description,
    createdAt: data.created_at,
  };
};

// Delete a receipt
export const deleteSupabaseReceipt = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('receipts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting receipt:', error);
    return false;
  }

  return true;
};
