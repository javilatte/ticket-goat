import { useCallback } from 'react';
import { Account, Transaction } from '../types';
import { Alert } from '../utils/alert';
import { Database } from '../services/database';
import { useAppContext } from '../contexts/AppContext';

/**
 * Custom hook for managing financial accounts
 * Handles CRUD operations and balance calculations
 * @returns Account management functions and state
 */
export function useAccounts() {
  const { 
    accounts, 
    setAccounts,
    transactions,
    setTransactions,
    setShowEditAccountModal,
    setEditingAccount,
    setShowAccountModal
  } = useAppContext();

  const loadAccounts = useCallback(async (txs?: Transaction[]) => {
    const accs = await Database.getAccounts();
    
    if (accs.length === 0) {
      const defaultAccount: Account = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: 'Principal',
        initialBalance: 0,
        currentBalance: 0,
        color: '#3B82F6'
      };
      await Database.addAccount(defaultAccount);
      setAccounts([defaultAccount]);
      return [defaultAccount];
    } else {
      // Recalcular currentBalance de cada cuenta
      const accountTxs = txs || transactions;
      const updatedAccounts = accs.map(acc => {
        const accTxs = accountTxs.filter(t => t.accountId === acc.id);
        const income = accTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = accTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const calculatedBalance = acc.initialBalance + income - expense;
        return { ...acc, currentBalance: calculatedBalance };
      });
      
      await Database.saveAccounts(updatedAccounts);
      setAccounts(updatedAccounts);
      return updatedAccounts;
    }
  }, [setAccounts, transactions]);

  const addAccount = useCallback(async (name: string, iban: string, color: string, initialBalance: number) => {
    const newAccount: Account = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      initialBalance: initialBalance,
      currentBalance: initialBalance,
      color: color,
      iban: iban
    };
    await Database.addAccount(newAccount);
    setAccounts([...accounts, newAccount]);
    setShowAccountModal(false);
  }, [accounts, setAccounts, setShowAccountModal]);

  const updateAccount = useCallback(async (accountId: string, updates: Partial<Account> & { oldCurrentBalance?: number }) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    // Obtener transacciones actuales de la cuenta
    const allTxs = await Database.getTransactions();
    const accountTxs = allTxs.filter(t => t.accountId === accountId);
    
    // Calcular balance basado en transacciones
    const income = accountTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = accountTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    // Determinar el nuevo initialBalance (puede haber cambiado)
    const newInitialBalance = updates.initialBalance ?? account.initialBalance;
    
    // Calcular el balance que DEBERÍA tener con el nuevo initialBalance
    const calculatedBalance = newInitialBalance + income - expense;
    
    // Balance que el usuario quiere (puede haber editado manualmente)
    const desiredBalance = updates.currentBalance ?? account.currentBalance;
    
    // Si el usuario cambió manualmente el balance actual, crear transacción de ajuste
    const oldBalance = updates.oldCurrentBalance ?? account.currentBalance;
    
    // Solo crear ajuste si:
    // 1. El usuario cambió manualmente el currentBalance (desiredBalance !== oldBalance)
    // 2. Y ese cambio no es simplemente el resultado de cambiar el initialBalance
    const manualAdjustment = desiredBalance - oldBalance;
    const initialBalanceChange = newInitialBalance - account.initialBalance;
    const needsAdjustment = manualAdjustment !== 0 && manualAdjustment !== initialBalanceChange;
    
    if (needsAdjustment) {
      const adjustmentAmount = desiredBalance - calculatedBalance;
      if (adjustmentAmount !== 0) {
        const adjustmentTransaction: Transaction = {
          type: adjustmentAmount > 0 ? 'income' : 'expense',
          amount: Math.abs(adjustmentAmount),
          description: 'Reajuste Manual',
          category: 'Ajuste',
          categoryColor: '#8B5CF6',
          date: new Date().toLocaleString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false 
          }).replace(',', ''),
          createdAt: new Date().toISOString(),
          accountId: accountId,
          isPayroll: false
        };
        await Database.addTransaction(adjustmentTransaction);
      }
    }

    // Actualizar cuenta (nombre, IBAN, initialBalance, color)
    const { currentBalance, oldCurrentBalance, ...accountUpdates } = updates;
    if (Object.keys(accountUpdates).length > 0) {
      await Database.updateAccount(accountId, accountUpdates);
    }
    
    // Recargar transacciones y cuentas con balances recalculados
    const txs = await Database.getTransactions();
    setTransactions(txs);
    await loadAccounts(txs);
    
    setShowEditAccountModal(false);
    setEditingAccount(null);
  }, [accounts, loadAccounts, setTransactions, setShowEditAccountModal, setEditingAccount]);

  const deleteAccount = useCallback(async (accountId: string) => {
    try {
      const accountTransactions = transactions.filter(t => t.accountId === accountId);
      for (const transaction of accountTransactions) {
        if (transaction.id) {
          await Database.deleteTransaction(transaction.id);
        }
      }
      
      await Database.deleteAccount(accountId);
      const updatedAccounts = accounts.filter(a => a.id !== accountId);
      setAccounts(updatedAccounts);
      setShowEditAccountModal(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'No se pudo eliminar la cuenta');
    }
  }, [accounts, transactions, setAccounts, setShowEditAccountModal, setEditingAccount]);

  const editAccount = useCallback((account: Account) => {
    setEditingAccount(account);
    setShowEditAccountModal(true);
  }, [setEditingAccount, setShowEditAccountModal]);

  return {
    accounts,
    loadAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    editAccount
  };
}
