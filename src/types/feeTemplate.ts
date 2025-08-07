export interface FeeTemplate {
  id: string;
  name: string;
  category: string;
  amount: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

export type FeeCategory = 'Tuition' | 'Books' | 'Transport' | 'Uniform' | 'Examination' | 'Activities' | 'Summer School' | 'Other';