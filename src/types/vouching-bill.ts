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

export const COST_HEAD_OPTIONS = Object.keys(SHORT_FORM_CODES);

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