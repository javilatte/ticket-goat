import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

// Re-export types from centralized location
export type { Transaction, Account, Stock, Balance, Settings } from '../types';
import { Transaction, Account, Stock, Balance, Settings } from '../types';

// Storage keys
const TRANSACTIONS_KEY = '@transactions';
const BALANCE_KEY = '@balance';
const SETTINGS_KEY = '@settings';
const ACCOUNTS_KEY = '@accounts';
const STOCKS_KEY = '@stocks';
const ENCRYPTION_KEY = 'encryption_key';

// Encryption utilities
export const getEncryptionKey = async (): Promise<string> => {
  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY);
  if (!key) {
    // Generate a simple random key instead of using CryptoJS.random
    key = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    await SecureStore.setItemAsync(ENCRYPTION_KEY, key);
  }
  return key!;
};

export const encryptData = async (data: string): Promise<string> => {
  const key = await getEncryptionKey();
  return CryptoJS.AES.encrypt(data, key).toString();
};

export const decryptData = async (encryptedData: string): Promise<string> => {
  const key = await getEncryptionKey();
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Database operations
export class Database {
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  static async addTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const newTransaction = {
        ...transaction,
        id: transaction.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const filtered = transactions.filter(t => t.id !== id);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  static async getBalance(): Promise<Balance> {
    try {
      const data = await AsyncStorage.getItem(BALANCE_KEY);
      return data ? JSON.parse(data) : {
        initialBalance: 0,
        currentBalance: 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      return {
        initialBalance: 0,
        currentBalance: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  static async updateBalance(balance: Balance): Promise<void> {
    try {
      await AsyncStorage.setItem(BALANCE_KEY, JSON.stringify(balance));
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<Settings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {
        encryptionEnabled: false,
        currency: '€',
        periodFilter: 'month',
        hideBalances: true,
        showWelcomeScreen: true
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        encryptionEnabled: false,
        currency: '€',
        periodFilter: 'month',
        hideBalances: true,
        showWelcomeScreen: true
      };
    }
  }

  static async updateSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Account management
  static async getAccounts(): Promise<Account[]> {
    try {
      const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  }

  static async saveAccounts(accounts: Account[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving accounts:', error);
      throw error;
    }
  }

  static async addAccount(account: Account): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      accounts.push(account);
      await this.saveAccounts(accounts);
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  }

  static async updateAccount(accountId: string, updates: Partial<Account>): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const index = accounts.findIndex(a => a.id === accountId);
      if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updates };
        await this.saveAccounts(accounts);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  static async deleteAccount(accountId: string): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const filtered = accounts.filter(a => a.id !== accountId);
      await this.saveAccounts(filtered);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TRANSACTIONS_KEY, BALANCE_KEY, SETTINGS_KEY, ACCOUNTS_KEY, STOCKS_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Stock management
  static async getStocks(): Promise<Stock[]> {
    try {
      const data = await AsyncStorage.getItem(STOCKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting stocks:', error);
      return [];
    }
  }

  static async saveStocks(stocks: Stock[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STOCKS_KEY, JSON.stringify(stocks));
    } catch (error) {
      console.error('Error saving stocks:', error);
      throw error;
    }
  }

  static async addStock(stock: Stock): Promise<void> {
    try {
      const stocks = await this.getStocks();
      stocks.push(stock);
      await this.saveStocks(stocks);
    } catch (error) {
      console.error('Error adding stock:', error);
      throw error;
    }
  }

  static async updateStock(stockId: string, updates: Partial<Stock>): Promise<void> {
    try {
      const stocks = await this.getStocks();
      const index = stocks.findIndex(s => s.id === stockId);
      if (index !== -1) {
        stocks[index] = { ...stocks[index], ...updates, lastUpdated: new Date().toISOString() };
        await this.saveStocks(stocks);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  static async deleteStock(stockId: string): Promise<void> {
    try {
      const stocks = await this.getStocks();
      const filtered = stocks.filter(s => s.id !== stockId);
      await this.saveStocks(filtered);
    } catch (error) {
      console.error('Error deleting stock:', error);
      throw error;
    }
  }
}
