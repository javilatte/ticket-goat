/**
 * Financial transaction record
 * Represents an income or expense transaction
 */
export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  categoryColor?: string;
  date: string;
  createdAt: string;
  encrypted?: boolean;
  accountId: string;
  isPayroll?: boolean;
}

/**
 * Financial account (bank account, wallet, etc.)
 */
export interface Account {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  color?: string;
  iban?: string;
}

/**
 * Stock or investment holding
 */
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  lastUpdated: string;
}

/**
 * Overall financial balance
 */
export interface Balance {
  initialBalance: number;
  currentBalance: number;
  lastUpdated: string;
}

/**
 * Application settings and preferences
 */
export interface Settings {
  encryptionEnabled: boolean;
  currency: string;
  periodFilter: 'month' | 'payroll';
  hideBalances: boolean;
  ocrApiUrl?: string;
  fmpApiKey?: string;
  showWelcomeScreen: boolean;
}

/**
 * Transaction form data (temporary state)
 */
export interface FormData {
  type: 'income' | 'expense';
  amount: string;
  description: string;
  category: string;
  categoryColor: string;
  date: string;
  time: string;
  accountId: string;
  isPayroll: boolean;
}
