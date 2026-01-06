import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, Account, Stock, Balance, Settings, FormData } from '../types';

interface AppContextType {
  // State
  transactions: Transaction[];
  accounts: Account[];
  stocks: Stock[];
  balance: Balance;
  settings: Settings;
  formData: FormData;
  editingAccount: Account | null;
  editingStock: Stock | null;
  editingTransaction: Transaction | null;
  
  // Modals
  showModal: boolean;
  showEditAccountModal: boolean;
  showSettingsScreen: boolean;
  showAccountModal: boolean;
  showStockModal: boolean;
  showWelcome: boolean;
  
  // Setters
  setTransactions: (transactions: Transaction[]) => void;
  setAccounts: (accounts: Account[]) => void;
  setStocks: (stocks: Stock[]) => void;
  setBalance: (balance: Balance) => void;
  setSettings: (settings: Settings) => void;
  setFormData: (formData: FormData) => void;
  setEditingAccount: (account: Account | null) => void;
  setEditingStock: (stock: Stock | null) => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
  setShowModal: (show: boolean) => void;
  setShowEditAccountModal: (show: boolean) => void;
  setShowSettingsScreen: (show: boolean) => void;
  setShowAccountModal: (show: boolean) => void;
  setShowStockModal: (show: boolean) => void;
  setShowWelcome: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [balance, setBalance] = useState<Balance>({
    initialBalance: 0,
    currentBalance: 0,
    lastUpdated: new Date().toISOString()
  });
  const [settings, setSettings] = useState<Settings>({
    encryptionEnabled: false,
    currency: '€',
    periodFilter: 'month',
    hideBalances: true,
    showWelcomeScreen: true
  });
  const [formData, setFormData] = useState<FormData>({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    categoryColor: '#6B7280',
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
    accountId: '',
    isPayroll: false
  });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Editing states
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const value: AppContextType = {
    transactions,
    accounts,
    stocks,
    balance,
    settings,
    formData,
    editingAccount,
    editingStock,
    editingTransaction,
    showModal,
    showEditAccountModal,
    showSettingsScreen,
    showAccountModal,
    showStockModal,
    showWelcome,
    setTransactions,
    setAccounts,
    setStocks,
    setBalance,
    setSettings,
    setFormData,
    setEditingAccount,
    setEditingStock,
    setEditingTransaction,
    setShowModal,
    setShowEditAccountModal,
    setShowSettingsScreen,
    setShowAccountModal,
    setShowStockModal,
    setShowWelcome,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
