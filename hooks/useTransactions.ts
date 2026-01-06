import { useCallback } from 'react';
import { Alert } from 'react-native';
import { Transaction } from '../types';
import { Database } from '../services/database';
import { useAppContext } from '../contexts/AppContext';

/**
 * Custom hook for managing transactions
 * Handles CRUD operations for income and expense transactions
 * @returns Transaction management functions and state
 */
export function useTransactions() {
  const { 
    transactions, 
    setTransactions, 
    balance, 
    setBalance,
    accounts,
    formData,
    setFormData,
    editingTransaction,
    setEditingTransaction,
    setShowModal
  } = useAppContext();

  const loadTransactions = useCallback(async () => {
    const txs = await Database.getTransactions();
    setTransactions(txs);
    return txs;
  }, [setTransactions]);

  const updateBalance = useCallback(async (txs: Transaction[], bal: typeof balance) => {
    const income = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const current = bal.initialBalance + income - expense;
    
    const newBalance = { ...bal, currentBalance: current, lastUpdated: new Date().toISOString() };
    await Database.updateBalance(newBalance);
    setBalance(newBalance);
  }, [setBalance]);

  const addTransaction = useCallback(async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida');
      return;
    }

    const transaction: Transaction = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description || 'Sin descripción',
      category: formData.category || 'Otros',
      categoryColor: formData.categoryColor,
      date: `${formData.date} ${formData.time}`,
      createdAt: new Date().toISOString(),
      accountId: formData.accountId || (accounts.length > 0 ? accounts[0].id : ''),
      isPayroll: formData.isPayroll
    };

    if (editingTransaction) {
      await Database.deleteTransaction(editingTransaction.id!);
      transaction.id = editingTransaction.id;
    }

    await Database.addTransaction(transaction);
    
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      categoryColor: '#6B7280',
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
      accountId: accounts.length > 0 ? accounts[0].id : '',
      isPayroll: false
    });
    
    // Reload data
    const txs = await loadTransactions();
    const bal = await Database.getBalance();
    await updateBalance(txs, bal);
  }, [formData, editingTransaction, accounts, setShowModal, setEditingTransaction, setFormData, loadTransactions, updateBalance]);

  const deleteTransaction = useCallback(async (id: string) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar esta transacción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await Database.deleteTransaction(id);
            const txs = await loadTransactions();
            const bal = await Database.getBalance();
            await updateBalance(txs, bal);
          }
        }
      ]
    );
  }, [loadTransactions, updateBalance]);

  const editTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      categoryColor: transaction.categoryColor || '#6B7280',
      date: transaction.date.split(' ')[0],
      time: transaction.date.split(' ')[1] || '00:00',
      accountId: transaction.accountId,
      isPayroll: transaction.isPayroll || false
    });
    setShowModal(true);
  }, [setEditingTransaction, setFormData, setShowModal]);

  return {
    transactions,
    loadTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    updateBalance
  };
}
