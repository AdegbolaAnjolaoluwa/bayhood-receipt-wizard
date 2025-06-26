
import { Receipt } from '@/types/receipt';

const RECEIPTS_STORAGE_KEY = 'bps_receipts';

// Generate a unique receipt number
const generateReceiptNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const time = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `BPS${year}${month}${day}${time}`;
};

// Get all receipts from localStorage
export const getReceipts = (): Receipt[] => {
  try {
    const stored = localStorage.getItem(RECEIPTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting receipts:', error);
    return [];
  }
};

// Save receipts to localStorage
const saveReceipts = (receipts: Receipt[]): void => {
  try {
    localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
  } catch (error) {
    console.error('Error saving receipts:', error);
  }
};

// Create a new receipt
export const createReceipt = (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'receiptNumber'>): Receipt => {
  const newReceipt: Receipt = {
    id: crypto.randomUUID(),
    receiptNumber: generateReceiptNumber(),
    createdAt: new Date().toISOString(),
    ...receiptData,
  };

  const receipts = getReceipts();
  receipts.push(newReceipt);
  saveReceipts(receipts);

  return newReceipt;
};

// Update an existing receipt
export const updateReceipt = (id: string, receiptData: Partial<Receipt>): Receipt | null => {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === id);
  
  if (index === -1) {
    return null;
  }

  receipts[index] = { ...receipts[index], ...receiptData };
  saveReceipts(receipts);

  return receipts[index];
};

// Delete a receipt
export const deleteReceipt = (id: string): boolean => {
  const receipts = getReceipts();
  const filtered = receipts.filter(r => r.id !== id);
  
  if (filtered.length === receipts.length) {
    return false; // Receipt not found
  }

  saveReceipts(filtered);
  return true;
};

// Get a single receipt by ID
export const getReceiptById = (id: string): Receipt | null => {
  const receipts = getReceipts();
  return receipts.find(r => r.id === id) || null;
};
