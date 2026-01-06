import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';

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

// Configurar CryptoJS para usar un generador de números aleatorios compatible con React Native
const generateSecureRandomWords = (nBytes: number): CryptoJS.lib.WordArray => {
  console.log('[generateSecureRandomWords] START - Platform:', Platform.OS, 'Bytes:', nBytes);
  let randomBytes: Uint8Array;
  
  if (Platform.OS === 'web') {
    // En web, usar Web Crypto API
    console.log('[generateSecureRandomWords] Creating Uint8Array for web...');
    randomBytes = new Uint8Array(nBytes);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      console.log('[generateSecureRandomWords] Using window.crypto.getRandomValues...');
      window.crypto.getRandomValues(randomBytes);
      console.log('[generateSecureRandomWords] Generated random bytes with crypto');
    } else {
      // Fallback si Web Crypto no está disponible
      console.log('[generateSecureRandomWords] Using Math.random fallback...');
      for (let i = 0; i < nBytes; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
      console.log('[generateSecureRandomWords] Generated random bytes with Math.random');
    }
  } else {
    // En móvil, usar expo-crypto
    console.log('[generateSecureRandomWords] Using expo-crypto...');
    randomBytes = Crypto.getRandomBytes(nBytes);
  }
  
  console.log('[generateSecureRandomWords] Converting to WordArray...');
  const words: number[] = [];
  for (let i = 0; i < randomBytes.length; i += 4) {
    words.push(
      (randomBytes[i] << 24) |
      (randomBytes[i + 1] << 16) |
      (randomBytes[i + 2] << 8) |
      randomBytes[i + 3]
    );
  }
  const wordArray = CryptoJS.lib.WordArray.create(words, nBytes);
  console.log('[generateSecureRandomWords] DONE - WordArray created');
  return wordArray;
};

// Override del generador de números aleatorios de CryptoJS
(CryptoJS.lib.WordArray as any).random = generateSecureRandomWords;

// Encryption utilities
export const getEncryptionKey = async (): Promise<string> => {
  console.log('[getEncryptionKey] START - Platform:', Platform.OS);
  let key: string | null = null;
  
  if (Platform.OS === 'web') {
    // En web, usar AsyncStorage (menos seguro pero funcional)
    console.log('[getEncryptionKey] Getting from AsyncStorage...');
    key = await AsyncStorage.getItem(ENCRYPTION_KEY);
    console.log('[getEncryptionKey] Got from AsyncStorage:', key ? 'KEY EXISTS' : 'NO KEY');
  } else {
    // En mobile, usar SecureStore (más seguro)
    console.log('[getEncryptionKey] Getting from SecureStore...');
    key = await SecureStore.getItemAsync(ENCRYPTION_KEY);
    console.log('[getEncryptionKey] Got from SecureStore:', key ? 'KEY EXISTS' : 'NO KEY');
  }
  
  if (!key) {
    console.log('[getEncryptionKey] No key found, generating new one...');
    // Generate a cryptographically secure random key
    let randomBytes: Uint8Array;
    
    if (Platform.OS === 'web') {
      // En web, usar Web Crypto API
      console.log('[getEncryptionKey] Creating Uint8Array(32) for web...');
      randomBytes = new Uint8Array(32);
      console.log('[getEncryptionKey] Checking window.crypto...');
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        console.log('[getEncryptionKey] Using window.crypto.getRandomValues...');
        window.crypto.getRandomValues(randomBytes);
        console.log('[getEncryptionKey] Random bytes generated');
      } else {
        // Fallback si Web Crypto no está disponible
        console.log('[getEncryptionKey] Using Math.random fallback...');
        for (let i = 0; i < 32; i++) {
          randomBytes[i] = Math.floor(Math.random() * 256);
        }
        console.log('[getEncryptionKey] Fallback random bytes generated');
      }
    } else {
      // En móvil, usar expo-crypto
      console.log('[getEncryptionKey] Using expo-crypto...');
      randomBytes = Crypto.getRandomBytes(32);
      console.log('[getEncryptionKey] Random bytes generated from expo-crypto');
    }
    
    console.log('[getEncryptionKey] Converting bytes to hex string...');
    key = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    console.log('[getEncryptionKey] Key generated, length:', key.length);
    
    if (Platform.OS === 'web') {
      console.log('[getEncryptionKey] Saving to AsyncStorage...');
      await AsyncStorage.setItem(ENCRYPTION_KEY, key);
      console.log('[getEncryptionKey] Saved to AsyncStorage');
    } else {
      console.log('[getEncryptionKey] Saving to SecureStore...');
      await SecureStore.setItemAsync(ENCRYPTION_KEY, key);
      console.log('[getEncryptionKey] Saved to SecureStore');
    }
  }
  console.log('[getEncryptionKey] RETURNING KEY');
  return key!;
};

export const encryptData = async (data: string): Promise<string> => {
  console.log('[encryptData] START - Data length:', data.length);
  const key = await getEncryptionKey();
  console.log('[encryptData] Got key, encrypting...');
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  console.log('[encryptData] DONE - Encrypted length:', encrypted.length);
  return encrypted;
};

export const decryptData = async (encryptedData: string): Promise<string> => {
  console.log('[decryptData] START - Data length:', encryptedData.length);
  const key = await getEncryptionKey();
  console.log('[decryptData] Got key, decrypting...');
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  console.log('[decryptData] DONE - Decrypted length:', decrypted.length);
  return decrypted;
};

// Database operations
export class Database {
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const encryptedData = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      if (!encryptedData) return [];
      
      try {
        const decryptedData = await decryptData(encryptedData);
        return decryptedData ? JSON.parse(decryptedData) : [];
      } catch (decryptError) {
        // Si falla el descifrado, asumimos que son datos no cifrados (migración)
        console.log('Data not encrypted, parsing directly');
        return JSON.parse(encryptedData);
      }
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
      const encryptedData = await encryptData(JSON.stringify(transactions));
      await AsyncStorage.setItem(TRANSACTIONS_KEY, encryptedData);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const filtered = transactions.filter(t => t.id !== id);
      const encryptedData = await encryptData(JSON.stringify(filtered));
      await AsyncStorage.setItem(TRANSACTIONS_KEY, encryptedData);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  static async getBalance(): Promise<Balance> {
    try {
      const encryptedData = await AsyncStorage.getItem(BALANCE_KEY);
      if (!encryptedData) {
        return {
          initialBalance: 0,
          currentBalance: 0,
          lastUpdated: new Date().toISOString()
        };
      }
      
      try {
        const decryptedData = await decryptData(encryptedData);
        return decryptedData ? JSON.parse(decryptedData) : {
          initialBalance: 0,
          currentBalance: 0,
          lastUpdated: new Date().toISOString()
        };
      } catch (decryptError) {
        // Si falla el descifrado, asumimos que son datos no cifrados
        console.log('Balance data not encrypted, parsing directly');
        return JSON.parse(encryptedData);
      }
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
      const encryptedData = await encryptData(JSON.stringify(balance));
      await AsyncStorage.setItem(BALANCE_KEY, encryptedData);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<Settings> {
    try {
      const encryptedData = await AsyncStorage.getItem(SETTINGS_KEY);
      if (!encryptedData) {
        return {
          encryptionEnabled: true, // Ahora cifrado por defecto
          currency: '€',
          periodFilter: 'month',
          hideBalances: true,
          showWelcomeScreen: true
        };
      }
      
      try {
        const decryptedData = await decryptData(encryptedData);
        const settings = decryptedData ? JSON.parse(decryptedData) : {
          encryptionEnabled: true,
          currency: '€',
          periodFilter: 'month',
          hideBalances: true,
          showWelcomeScreen: true
        };
        // Asegurar que el cifrado siempre esté habilitado
        settings.encryptionEnabled = true;
        return settings;
      } catch (decryptError) {
        // Si falla el descifrado, asumimos que son datos no cifrados
        console.log('Settings data not encrypted, parsing directly');
        const settings = JSON.parse(encryptedData);
        settings.encryptionEnabled = true;
        return settings;
      }
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        encryptionEnabled: true,
        currency: '€',
        periodFilter: 'month',
        hideBalances: true,
        showWelcomeScreen: true
      };
    }
  }

  static async updateSettings(settings: Settings): Promise<void> {
    console.log('[updateSettings] START - Settings:', JSON.stringify(settings));
    try {
      // Asegurar que el cifrado siempre esté habilitado
      console.log('[updateSettings] Creating settings with encryption...');
      const settingsWithEncryption = { ...settings, encryptionEnabled: true };
      console.log('[updateSettings] Stringifying settings...');
      const jsonString = JSON.stringify(settingsWithEncryption);
      console.log('[updateSettings] JSON length:', jsonString.length);
      console.log('[updateSettings] Encrypting data...');
      const encryptedData = await encryptData(jsonString);
      console.log('[updateSettings] Setting in AsyncStorage...');
      await AsyncStorage.setItem(SETTINGS_KEY, encryptedData);
      console.log('[updateSettings] DONE');
    } catch (error) {
      console.error('[updateSettings] ERROR:', error);
      throw error;
    }
  }

  // Account management
  static async getAccounts(): Promise<Account[]> {
    try {
      const encryptedData = await AsyncStorage.getItem(ACCOUNTS_KEY);
      if (!encryptedData) return [];
      
      try {
        const decryptedData = await decryptData(encryptedData);
        return decryptedData ? JSON.parse(decryptedData) : [];
      } catch (decryptError) {
        // Si falla el descifrado, asumimos que son datos no cifrados
        console.log('Accounts data not encrypted, parsing directly');
        return JSON.parse(encryptedData);
      }
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  }

  static async saveAccounts(accounts: Account[]): Promise<void> {
    try {
      const encryptedData = await encryptData(JSON.stringify(accounts));
      await AsyncStorage.setItem(ACCOUNTS_KEY, encryptedData);
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
      // Eliminar todos los datos cifrados de AsyncStorage
      await AsyncStorage.multiRemove([TRANSACTIONS_KEY, BALANCE_KEY, SETTINGS_KEY, ACCOUNTS_KEY, STOCKS_KEY]);
      
      // Eliminar la clave de cifrado (diferente según plataforma)
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(ENCRYPTION_KEY);
      } else {
        await SecureStore.deleteItemAsync(ENCRYPTION_KEY);
      }
      
      // Limpiar toda la cache de AsyncStorage por si hay otros datos
      await AsyncStorage.clear();
      
      console.log('All data and encryption keys cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  /**
   * Migración de datos no cifrados a cifrados
   * Esta función intenta leer datos sin cifrar y los vuelve a guardar cifrados
   */
  static async migrateToEncryption(): Promise<void> {
    try {
      const keys = [TRANSACTIONS_KEY, BALANCE_KEY, SETTINGS_KEY, ACCOUNTS_KEY, STOCKS_KEY];
      
      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          try {
            // Intentar descifrar - si funciona, ya está cifrado
            await decryptData(data);
            console.log(`${key} already encrypted`);
          } catch {
            try {
              // Si falla el descifrado, intentar cifrar los datos como JSON
              JSON.parse(data); // Verificar que es JSON válido
              console.log(`Migrating ${key} to encrypted storage`);
              const encryptedData = await encryptData(data);
              await AsyncStorage.setItem(key, encryptedData);
            } catch (parseError) {
              // Si no es JSON válido ni cifrado válido, eliminar datos corruptos
              console.log(`${key} contains corrupted data, removing`);
              await AsyncStorage.removeItem(key);
            }
          }
        }
      }
      
      console.log('Migration to encrypted storage completed');
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  // Stock management
  static async getStocks(): Promise<Stock[]> {
    try {
      const encryptedData = await AsyncStorage.getItem(STOCKS_KEY);
      if (!encryptedData) return [];
      
      try {
        const decryptedData = await decryptData(encryptedData);
        return decryptedData ? JSON.parse(decryptedData) : [];
      } catch (decryptError) {
        // Si falla el descifrado, asumimos que son datos no cifrados
        console.log('Stocks data not encrypted, parsing directly');
        return JSON.parse(encryptedData);
      }
    } catch (error) {
      console.error('Error getting stocks:', error);
      return [];
    }
  }

  static async saveStocks(stocks: Stock[]): Promise<void> {
    try {
      const encryptedData = await encryptData(JSON.stringify(stocks));
      await AsyncStorage.setItem(STOCKS_KEY, encryptedData);
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
