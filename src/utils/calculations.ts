import { VouchingBillData, VouchingBillTotals } from '@/types/vouching-bill';
import { toWords } from 'number-to-words';

export const calculateTotals = (data: VouchingBillData): VouchingBillTotals => {
  const bankTotal = data.bankWithdrawals.reduce((sum, entry) => sum + entry.amount, 0);
  const creditCardTotal = data.creditCardWithdrawals.reduce((sum, entry) => sum + entry.amount, 0);
  const bkashNagadTotal = data.bkashNagadWithdrawals.reduce((sum, entry) => sum + entry.amount, 0);
  
  const totalReceived = bankTotal + creditCardTotal + bkashNagadTotal;
  const totalCost = data.costEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const cashInHand = totalReceived - totalCost;
  
  return {
    totalReceived,
    totalCost,
    cashInHand,
    cashInBkashNagad: data.cashInBkashNagad
  };
};

export const convertToWords = (amount: number): string => {
  if (amount === 0) return 'Zero Taka Only';
  
  try {
    const words = toWords(Math.abs(amount));
    const capitalizedWords = words.charAt(0).toUpperCase() + words.slice(1);
    return `${capitalizedWords} Taka Only`;
  } catch (error) {
    return 'Invalid Amount';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('BDT', '৳');
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};