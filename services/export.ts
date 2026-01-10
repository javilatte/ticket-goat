import * as XLSX from 'xlsx';
import { Platform } from 'react-native';
import { Alert } from '../utils/alert';
import { Database, Transaction, Account, Stock } from './database';
import * as DocumentPicker from 'expo-document-picker';

// Importación condicional de FileSystem y Sharing (legacy para compatibilidad con Expo SDK 54)
let FileSystem: any = null;
let Sharing: any = null;
if (Platform.OS !== 'web') {
  try {
    FileSystem = require('expo-file-system/legacy');
    Sharing = require('expo-sharing');
  } catch (e) {
    console.log('FileSystem or Sharing not available');
  }
}

export interface ExportData {
  transactions: Transaction[];
  accounts: Account[];
  stocks: Stock[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    exportDate: string;
  };
}

export class ExportService {
  static async getAllData(): Promise<ExportData> {
    const transactions = await Database.getTransactions();
    const accounts = await Database.getAccounts();
    const stocks = await Database.getStocks();
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      transactions,
      accounts,
      stocks,
      summary: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        exportDate: new Date().toISOString()
      }
    };
  }

  static async exportToExcel(): Promise<void> {
    try {
      const data = await this.getAllData();

      // Crear workbook
      const wb = XLSX.utils.book_new();

      // Hoja de resumen
      const summaryData = [
        ['TicketGOAT - Export Report'],
        ['Export Date', data.summary.exportDate],
        [''],
        ['Total Income', data.summary.totalIncome],
        ['Total Expenses', data.summary.totalExpenses],
        ['Balance', data.summary.balance]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // Hoja de transacciones
      const transactionsFormatted = data.transactions.map(t => ({
        'ID': t.id,
        'Type': t.type,
        'Amount': t.amount,
        'Description': t.description,
        'Category': t.category,
        'Date': t.date,
        'Account ID': t.accountId,
        'Is Payroll': t.isPayroll ? 'Yes' : 'No',
        'Created At': t.createdAt
      }));
      const wsTransactions = XLSX.utils.json_to_sheet(transactionsFormatted);
      XLSX.utils.book_append_sheet(wb, wsTransactions, 'Transactions');

      // Hoja de cuentas
      const accountsFormatted = data.accounts.map(a => ({
        'ID': a.id,
        'Name': a.name,
        'Initial Balance': a.initialBalance,
        'Current Balance': a.currentBalance,
        'IBAN': a.iban || 'N/A'
      }));
      const wsAccounts = XLSX.utils.json_to_sheet(accountsFormatted);
      XLSX.utils.book_append_sheet(wb, wsAccounts, 'Accounts');

      // Hoja de acciones
      const stocksFormatted = data.stocks.map(s => ({
        'ID': s.id,
        'Symbol': s.symbol,
        'Name': s.name,
        'Quantity': s.quantity,
        'Buy Price': s.buyPrice,
        'Current Price': s.currentPrice,
        'Last Updated': s.lastUpdated
      }));
      const wsStocks = XLSX.utils.json_to_sheet(stocksFormatted);
      XLSX.utils.book_append_sheet(wb, wsStocks, 'Stocks');

      const fileName = `TicketGOAT_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

      if (Platform.OS === 'web') {
        // En web, usar array buffer
        const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // En móvil, usar binary string y convertir manualmente
        if (!FileSystem || !Sharing) {
          throw new Error('FileSystem or Sharing not available');
        }
        
        const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
        const fileUri = FileSystem.cacheDirectory + fileName;
        
        // Convertir binary string a base64 manualmente
        const base64 = this.binaryToBase64(wbout);
        
        // Escribir archivo usando base64
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: 'base64'
        });
        
        // Verificar si el sharing está disponible
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Exportar datos de TicketGOAT',
            UTI: 'com.microsoft.excel.xlsx'
          });
          Alert.alert('Éxito', 'Archivo Excel exportado');
        } else {
          Alert.alert('Error', 'No se puede compartir archivos en este dispositivo');
        }
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  static async exportToCSV(): Promise<void> {
    try {
      const data = await this.getAllData();

      // Crear contenido CSV para transacciones
      const transactionsCSV = this.arrayToCSV([
        ['ID', 'Type', 'Amount', 'Description', 'Category', 'Date', 'Account ID', 'Is Payroll', 'Created At'],
        ...data.transactions.map(t => [
          t.id,
          t.type,
          t.amount,
          t.description,
          t.category,
          t.date,
          t.accountId,
          t.isPayroll ? 'Yes' : 'No',
          t.createdAt
        ])
      ]);

      // Crear contenido CSV para cuentas
      const accountsCSV = this.arrayToCSV([
        ['ID', 'Name', 'Initial Balance', 'Current Balance', 'IBAN'],
        ...data.accounts.map(a => [
          a.id,
          a.name,
          a.initialBalance,
          a.currentBalance,
          a.iban || 'N/A'
        ])
      ]);

      // Crear contenido CSV para acciones
      const stocksCSV = this.arrayToCSV([
        ['ID', 'Symbol', 'Name', 'Quantity', 'Buy Price', 'Current Price', 'Last Updated'],
        ...data.stocks.map(s => [
          s.id,
          s.symbol,
          s.name,
          s.quantity,
          s.buyPrice,
          s.currentPrice,
          s.lastUpdated
        ])
      ]);

      // Crear archivo completo
      const fullCSV = `TicketGOAT Export - ${data.summary.exportDate}\n\n` +
        `Summary\n` +
        `Total Income,${data.summary.totalIncome}\n` +
        `Total Expenses,${data.summary.totalExpenses}\n` +
        `Balance,${data.summary.balance}\n\n` +
        `Transactions\n${transactionsCSV}\n\n` +
        `Accounts\n${accountsCSV}\n\n` +
        `Stocks\n${stocksCSV}`;

      const fileName = `TicketGOAT_Export_${new Date().toISOString().split('T')[0]}.csv`;

      if (Platform.OS === 'web') {
        // En web, descargar directamente
        const blob = new Blob([fullCSV], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // En móvil, guardar y compartir
        if (!FileSystem || !Sharing) {
          throw new Error('FileSystem or Sharing not available');
        }
        
        const fileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, fullCSV, {
          encoding: 'utf8'
        });
        
        // Verificar si el sharing está disponible
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Exportar datos de TicketGOAT',
            UTI: 'public.comma-separated-values-text'
          });
          Alert.alert('Éxito', 'Archivo CSV exportado');
        } else {
          Alert.alert('Error', 'No se puede compartir archivos en este dispositivo');
        }
      }
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  private static arrayToCSV(data: any[][]): string {
    return data.map(row => 
      row.map(cell => {
        const cellStr = String(cell);
        // Escapar comillas y envolver en comillas si contiene comas
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');
  }

  private static bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let base64 = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
      const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      
      base64 += chars[a >> 2];
      base64 += chars[((a & 3) << 4) | (b >> 4)];
      base64 += i + 1 < bytes.length ? chars[((b & 15) << 2) | (c >> 6)] : '=';
      base64 += i + 2 < bytes.length ? chars[c & 63] : '=';
    }
    return base64;
  }

  private static binaryToArrayBuffer(binary: string): ArrayBuffer {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  static async importFromExcel(): Promise<void> {
    try {
      let fileContent: string = '';
      
      if (Platform.OS === 'web') {
        // En web, usar input file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls';
        
        await new Promise<void>((resolve, reject) => {
          input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) {
              reject(new Error('No file selected'));
              return;
            }
            
            const reader = new FileReader();
            reader.onload = async (event: any) => {
              try {
                fileContent = event.target.result;
                resolve();
              } catch (error) {
                reject(error);
              }
            };
            reader.readAsBinaryString(file);
          };
          input.click();
        });
      } else {
        // En móvil, usar DocumentPicker
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
          copyToCacheDirectory: true,
        });
        
        if (result.canceled || !result.assets || result.assets.length === 0) {
          return;
        }
        
        if (!FileSystem) {
          throw new Error('FileSystem not available');
        }
        
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: 'base64'
        });
        fileContent = this.base64ToBinary(base64);
      }

      // Procesar el archivo Excel
      const wb = XLSX.read(fileContent, { type: 'binary' });
      
      // Leer transacciones
      const transactionsSheet = wb.Sheets['Transactions'];
      if (transactionsSheet) {
        const transactionsData = XLSX.utils.sheet_to_json(transactionsSheet) as any[];
        
        for (const row of transactionsData) {
          const transaction: Transaction = {
            id: row['ID'] || `imported-${Date.now()}-${Math.random()}`,
            type: row['Type'],
            amount: Number(row['Amount']),
            description: row['Description'] || '',
            category: row['Category'] || '',
            categoryColor: '#3B82F6',
            date: row['Date'] || new Date().toISOString(),
            accountId: row['Account ID'],
            isPayroll: row['Is Payroll'] === 'Yes',
            createdAt: row['Created At'] || new Date().toISOString()
          };
          
          await Database.addTransaction(transaction);
        }
      }
      
      // Leer cuentas
      const accountsSheet = wb.Sheets['Accounts'];
      if (accountsSheet) {
        const accountsData = XLSX.utils.sheet_to_json(accountsSheet) as any[];
        
        for (const row of accountsData) {
          const account: Account = {
            id: row['ID'] || `imported-${Date.now()}-${Math.random()}`,
            name: row['Name'],
            initialBalance: Number(row['Initial Balance']),
            currentBalance: Number(row['Current Balance']),
            iban: row['IBAN'] !== 'N/A' ? row['IBAN'] : undefined
          };
          
          await Database.addAccount(account);
        }
      }
      
      // Leer acciones
      const stocksSheet = wb.Sheets['Stocks'];
      if (stocksSheet) {
        const stocksData = XLSX.utils.sheet_to_json(stocksSheet) as any[];
        
        for (const row of stocksData) {
          const stock: Stock = {
            id: row['ID'] || `imported-${Date.now()}-${Math.random()}`,
            symbol: row['Symbol'],
            name: row['Name'],
            quantity: Number(row['Quantity']),
            buyPrice: Number(row['Buy Price']),
            currentPrice: Number(row['Current Price']),
            lastUpdated: row['Last Updated'] || new Date().toISOString()
          };
          
          await Database.addStock(stock);
        }
      }
      
      Alert.alert('Éxito', 'Datos importados correctamente desde Excel');
    } catch (error) {
      console.error('Error importing from Excel:', error);
      Alert.alert('Error', 'No se pudo importar el archivo Excel');
      throw error;
    }
  }

  static async importFromCSV(): Promise<void> {
    try {
      let fileContent: string = '';
      
      if (Platform.OS === 'web') {
        // En web, usar input file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        
        await new Promise<void>((resolve, reject) => {
          input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) {
              reject(new Error('No file selected'));
              return;
            }
            
            const reader = new FileReader();
            reader.onload = async (event: any) => {
              try {
                fileContent = event.target.result;
                resolve();
              } catch (error) {
                reject(error);
              }
            };
            reader.readAsText(file);
          };
          input.click();
        });
      } else {
        // En móvil, usar DocumentPicker
        const result = await DocumentPicker.getDocumentAsync({
          type: 'text/csv',
          copyToCacheDirectory: true,
        });
        
        if (result.canceled || !result.assets || result.assets.length === 0) {
          return;
        }
        
        if (!FileSystem) {
          throw new Error('FileSystem not available');
        }
        
        fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: 'utf8'
        });
      }

      // Parsear CSV
      const lines = fileContent.split('\n');
      let currentSection = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === 'Transactions') {
          currentSection = 'transactions';
          i++; // Saltar línea de encabezados
          continue;
        }
        
        if (line === 'Accounts') {
          currentSection = 'accounts';
          i++; // Saltar línea de encabezados
          continue;
        }
        
        if (line === 'Stocks') {
          currentSection = 'stocks';
          i++; // Saltar línea de encabezados
          continue;
        }
        
        if (!line || line.startsWith('TicketGOAT') || line.startsWith('Summary') || 
            line.startsWith('Total Income') || line.startsWith('Total Expenses') || 
            line.startsWith('Balance')) {
          continue;
        }
        
        const values = this.parseCSVLine(line);
        
        if (currentSection === 'transactions' && values.length >= 9) {
          const transaction: Transaction = {
            id: values[0] || `imported-${Date.now()}-${Math.random()}`,
            type: values[1] as 'income' | 'expense',
            amount: Number(values[2]),
            description: values[3] || '',
            category: values[4] || '',
            categoryColor: '#3B82F6',
            date: values[5] || new Date().toISOString(),
            accountId: values[6],
            isPayroll: values[7] === 'Yes',
            createdAt: values[8] || new Date().toISOString()
          };
          
          await Database.addTransaction(transaction);
        }
        
        if (currentSection === 'accounts' && values.length >= 5) {
          const account: Account = {
            id: values[0] || `imported-${Date.now()}-${Math.random()}`,
            name: values[1],
            initialBalance: Number(values[2]),
            currentBalance: Number(values[3]),
            iban: values[4] !== 'N/A' ? values[4] : undefined
          };
          
          await Database.addAccount(account);
        }
        
        if (currentSection === 'stocks' && values.length >= 7) {
          const stock: Stock = {
            id: values[0] || `imported-${Date.now()}-${Math.random()}`,
            symbol: values[1],
            name: values[2],
            quantity: Number(values[3]),
            buyPrice: Number(values[4]),
            currentPrice: Number(values[5]),
            lastUpdated: values[6] || new Date().toISOString()
          };
          
          await Database.addStock(stock);
        }
      }
      
      Alert.alert('Éxito', 'Datos importados correctamente desde CSV');
    } catch (error) {
      console.error('Error importing from CSV:', error);
      Alert.alert('Error', 'No se pudo importar el archivo CSV');
      throw error;
    }
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private static arrayToCSV(data: any[][]): string {
    return data.map(row => 
      row.map(cell => {
        const cellStr = String(cell);
        // Escapar comillas y envolver en comillas si contiene comas
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');
  }

  private static binaryToBase64(binary: string): string {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    // Convertir a base64 manualmente
    let base64 = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
      const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      
      base64 += chars[a >> 2];
      base64 += chars[((a & 3) << 4) | (b >> 4)];
      base64 += i + 1 < bytes.length ? chars[((b & 15) << 2) | (c >> 6)] : '=';
      base64 += i + 2 < bytes.length ? chars[c & 63] : '=';
    }
    return base64;
  }

  private static base64ToBinary(base64: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let binary = '';
    
    for (let i = 0; i < base64.length; i += 4) {
      const a = chars.indexOf(base64[i]);
      const b = chars.indexOf(base64[i + 1]);
      const c = base64[i + 2] === '=' ? 0 : chars.indexOf(base64[i + 2]);
      const d = base64[i + 3] === '=' ? 0 : chars.indexOf(base64[i + 3]);
      
      binary += String.fromCharCode((a << 2) | (b >> 4));
      if (base64[i + 2] !== '=') {
        binary += String.fromCharCode(((b & 15) << 4) | (c >> 2));
      }
      if (base64[i + 3] !== '=') {
        binary += String.fromCharCode(((c & 3) << 6) | d);
      }
    }
    
    return binary;
  }
}
