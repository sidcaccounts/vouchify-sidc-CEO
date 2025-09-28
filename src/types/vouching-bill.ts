export interface WithdrawEntry {
  id: string;
  name: string;
  amount: number;
}

export interface CostEntry {
  id: string;
  costHead: string;
  description: string;
  amount: number;
  remarks: string;
}

export interface VouchingBillData {
  name: string;
  date: string;
  
  // Withdraw From sections
  bankWithdrawals: WithdrawEntry[];
  creditCardWithdrawals: WithdrawEntry[];
  bkashNagadWithdrawals: WithdrawEntry[];
  
  // Cost entries
  costEntries: CostEntry[];
  
  // Summary fields
  dueFrom: string;
  payableTo: string;
  charity: string;
  cashInBkashNagad: number;
}

export interface VouchingBillTotals {
  totalReceived: number;
  totalCost: number;
  cashInHand: number;
  cashInBkashNagad: number;
}

export const SHORT_FORM_CODES = {
  'IH': 'In House',
  'P': 'Personal',
  'OFC': 'Office',
  'PO': 'Parcel for Office',
  'PH': 'Parcel for Home',
  'BP': 'Business Promotional'
};

export const COST_HEAD_OPTIONS = Object.values(SHORT_FORM_CODES);

export const BANK_SUGGESTIONS = [
  'City Savings 3001',
  'TBL Current 2541',
  'TBL Savings 9633',
  'TBL Mudaraba SV 1164'
];

export const CREDIT_CARD_SUGGESTIONS = [
  'City AMEX Credit 5398',
  'City Visa Credit 0017'
];

export const REMARKS_OPTIONS = [
  'Urgent',
  'Monthly',
  'Official',
  'Miscellaneous',
  'Transport',
  'Food',
  'Utilities',
  'Rent',
  'Office Supplies'
];