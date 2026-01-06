import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#111827' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 50, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    backgroundColor: '#1F2937', 
    borderBottomWidth: 1, 
    borderBottomColor: '#374151' 
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerTitle: { 
    fontSize: 42, 
    fontWeight: '600', 
    color: '#FFFFFF', 
    fontFamily: 'StackSansNotch-SemiBold' 
  },
  clearButton: {
    backgroundColor: '#EF4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearButtonText: {
    fontSize: 16
  },
  settingsButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  visibilityButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addTransactionButton: {
    backgroundColor: '#6B7C4F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8
  },
  addTransactionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  addButton: { 
    backgroundColor: '#3B82F6', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  addButtonText: { 
    color: '#FFFFFF', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  content: { 
    flex: 1, 
    padding: 20 
  },
  balanceCard: { 
    backgroundColor: '#6B7C4F', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16 
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  balanceLabel: { 
    color: '#FFFFFF', 
    fontSize: 26, 
    fontWeight: '600'
  },
  balanceAmount: { 
    color: '#FFFFFF', 
    fontSize: 36, 
    fontWeight: 'bold', 
    marginBottom: 8
  },
  balanceSubtextContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  balanceSubtext: { 
    color: '#DBEAFE', 
    fontSize: 12, 
  },
  balanceEditText: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    fontWeight: '600', 
  },
  statsContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 24 
  },
  statCard: { 
    flex: 1, 
    backgroundColor: '#1F2937', 
    borderRadius: 12, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#374151' 
  },
  statLabel: { 
    color: '#9CA3AF', 
    fontSize: 12, 
    marginBottom: 8, 
  },
  statIncome: { 
    color: '#10B981', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  statExpense: { 
    color: '#EF4444', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  transactionsSection: { 
    marginBottom: 24 
  },
  sectionTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 12 
  },
  emptyText: { 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: 40, 
  },
  transactionCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1F2937', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#374151' 
  },
  transactionInfo: { 
    flex: 1,
    marginRight: 16
  },
  transactionDescription: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 8
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600'
  },
  transactionCategory: { 
    color: '#9CA3AF', 
    fontSize: 12, 
    marginBottom: 2 
  },
  transactionDate: { 
    color: '#9CA3AF', 
    fontSize: 11, 
    flex: 1,
    textAlign: 'right'
  },
  transactionAmount: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 16
  },
  incomeAmount: { 
    color: '#10B981' 
  },
  expenseAmount: { 
    color: '#EF4444' 
  },
  rightView: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  deleteTransactionButton: {
    padding: 8,
    marginLeft: 8
  },
  periodFilterContainer: {
    marginBottom: 16,
    alignItems: 'center'
  },
  periodFilterButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  periodFilterActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#3B82F6'
  },
  periodFilterText: {
    color: '#FFFFFF',
    fontSize: 14
  },
  accountsSection: {
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  addAccountButton: {
    color: '#6B7C4F',
    fontSize: 14,
    fontWeight: '600'
  },
  accountCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6'
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  accountIban: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8
  },
  accountBalance: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  accountStats: {
    flexDirection: 'row',
    gap: 16
  },
  accountStat: {
    color: '#9CA3AF',
    fontSize: 12
  },
  navigationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    gap: 8
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6'
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  navTextInactive: {
    color: '#9CA3AF',
    fontSize: 14
  },
  balanceBreakdown: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  balanceBreakdownText: {
    color: '#9CA3AF',
    fontSize: 12
  },
  stockCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6'
  },
  stockCardSquare: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    width: 270,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6'
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  stockHeaderSquare: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  stockSymbol: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  stockName: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2
  },
  stockNameSquare: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2
  },
  stockDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  stockValueSquare: {
    marginBottom: 8
  },
  stockQuantity: {
    color: '#9CA3AF',
    fontSize: 13
  },
  stockQuantitySquare: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2
  },
  stockValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  stockProfitLoss: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  stockProfitLossSquare: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  stockProfitLossText: {
    fontSize: 14,
    fontWeight: '600'
  },
  stockProfitLossTextSquare: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  stockProfitPercent: {
    fontSize: 12,
    fontWeight: '600'
  },
  profitText: {
    color: '#10B981'
  },
  lossText: {
    color: '#EF4444'
  },
  profitBg: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)'
  },
  lossBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  }
});
