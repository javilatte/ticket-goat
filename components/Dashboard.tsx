import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Transaction, Account, Stock } from '../services/database';
import { styles } from '../styles/dashboard.styles';
import StockCard from './StockCard';

interface DashboardProps {
  transactions: Transaction[];
  accounts: Account[];
  stocks: Stock[];
  currency: string;
  hideBalances: boolean;
  onAddTransaction: () => void;
  onEditAccount: (account: Account) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddAccount: () => void;
  onToggleVisibility: () => void;
  onAddStock: () => void;
  onEditStock: (stock: Stock) => void;
  onUpdateStockPrices?: () => void;
}

export default function Dashboard({
  transactions,
  accounts,
  stocks,
  currency,
  hideBalances,
  onAddTransaction,
  onEditAccount,
  onEditTransaction,
  onDeleteTransaction,
  onAddAccount,
  onToggleVisibility,
  onAddStock,
  onEditStock,
  onUpdateStockPrices,
}: DashboardProps) {
  const [stocksExpanded, setStocksExpanded] = useState(false);
  
  const stats = {
    income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    expense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Comida': '#F59E0B',
      'Transporte': '#3B82F6',
      'Entretenimiento': '#8B5CF6',
      'Salud': '#10B981',
      'Compras': '#EC4899',
      'Servicios': '#6366F1',
      'Educación': '#06B6D4',
      'Hogar': '#EF4444',
      'Otros': '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  const formatDate = (dateString: string): string => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${day} ${monthNames[date.getMonth()]} ${year}, ${timePart}`;
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return hideBalances ? '***' : '0.00';
    }
    return hideBalances ? '***' : amount.toFixed(2);
  };

  const formatIban = (iban: string): string => {
    if (!iban) return '';
    return hideBalances ? '****' : iban;
  };

  // Calcular balance total de todas las cuentas
  const totalBalance = accounts.reduce((total, account) => {
    const accountTransactions = transactions.filter(t => t.accountId === account.id);
    const accountIncome = accountTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const accountExpense = accountTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const accountBalance = account.initialBalance + accountIncome - accountExpense;
    return total + accountBalance;
  }, 0);

  // Calcular valor total de acciones
  const totalStocksValue = stocks.reduce((total, stock) => {
    return total + (stock.quantity * stock.currentPrice);
  }, 0);

  // Balance total incluyendo acciones
  const totalBalanceWithStocks = totalBalance + totalStocksValue;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Balance Total</Text>
            <TouchableOpacity 
              style={styles.visibilityButton}
              onPress={onToggleVisibility}
            >
              <MaterialIcons 
                name={hideBalances ? 'visibility-off' : 'visibility'} 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{formatAmount(totalBalanceWithStocks)} {currency}</Text>
          {stocks.length > 0 && (
            <View style={styles.balanceBreakdown}>
              <Text style={styles.balanceBreakdownText}>Cuentas: {formatAmount(totalBalance)} {currency}</Text>
              <Text style={styles.balanceBreakdownText}>Acciones: {formatAmount(totalStocksValue)} {currency}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ingresos</Text>
            <Text style={styles.statIncome}>+{formatAmount(stats.income)} {currency}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Gastos</Text>
            <Text style={styles.statExpense}>-{formatAmount(stats.expense)} {currency}</Text>
          </View>
        </View>

        <View style={styles.accountsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cuentas</Text>
            <TouchableOpacity onPress={onAddAccount}>
              <Text style={styles.addAccountButton}>+ Añadir</Text>
            </TouchableOpacity>
          </View>
          {accounts.map((account) => {
            const accountTransactions = transactions.filter(t => t.accountId === account.id);
            const accountIncome = accountTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const accountExpense = accountTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const accountBalance = account.initialBalance + accountIncome - accountExpense;
            
            return (
              <TouchableOpacity 
                key={account.id} 
                style={[styles.accountCard, account.color && { borderLeftColor: account.color }]}
                onLongPress={() => onEditAccount(account)}
              >
                <View style={styles.accountHeader}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <TouchableOpacity onPress={() => onEditAccount(account)}>
                    <MaterialIcons name="edit" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                {account.iban && (
                  <Text style={styles.accountIban}>{formatIban(account.iban)}</Text>
                )}
                <Text style={styles.accountBalance}>{formatAmount(accountBalance)} {currency}</Text>
                <View style={styles.accountStats}>
                  <Text style={styles.accountStat}>+{formatAmount(accountIncome)}</Text>
                  <Text style={styles.accountStat}>-{formatAmount(accountExpense)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.addTransactionButton}
          onPress={onAddTransaction}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addTransactionButtonText}>Nueva Transacción</Text>
        </TouchableOpacity>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transacciones</Text>
          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No hay transacciones aún</Text>
          ) : (
            transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => onEditTransaction(transaction)}
              >
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <View style={[styles.categoryBadge, { backgroundColor: transaction.categoryColor || getCategoryColor(transaction.category) }]}>
                    <Text style={styles.categoryBadgeText}>{transaction.category}</Text>
                  </View>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount)} {currency}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteTransactionButton}
                  onPress={() => onDeleteTransaction(transaction.id!)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons name="delete" size={20} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.accountsSection}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setStocksExpanded(!stocksExpanded)}
          >
            <Text style={styles.sectionTitle}>Acciones</Text>
          </TouchableOpacity>
          {stocksExpanded && (
            <>
              <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                <View style={{ flex: 1 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {onUpdateStockPrices && stocks.length > 0 && (
                    <TouchableOpacity 
                      onPress={onUpdateStockPrices}
                      style={{ marginRight: 15 }}
                    >
                      <MaterialIcons name="refresh" size={20} color="#10B981" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={onAddStock}>
                    <Text style={styles.addAccountButton}>+ Añadir</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {stocks.length === 0 ? (
                <Text style={styles.emptyText}>No tienes acciones registradas</Text>
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 10 }}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {stocks.map((stock) => (
                    <StockCard
                      key={stock.id}
                      stock={stock}
                      currency={currency}
                      onEdit={onEditStock}
                      formatAmount={formatAmount}
                    />
                  ))}
                </ScrollView>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
