import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#1F2937', 
    borderRadius: 16, 
    padding: 24, 
    width: '90%', 
    maxWidth: 400,
    overflow: 'hidden'
  },
  modalTitle: { 
    color: '#FFFFFF', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  typeContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 16 
  },
  typeButton: { 
    flex: 1, 
    backgroundColor: '#374151', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  typeButtonExpense: { 
    backgroundColor: '#EF4444' 
  },
  typeButtonIncome: { 
    backgroundColor: '#10B981' 
  },
  typeButtonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold' 
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8
  },
  input: { 
    backgroundColor: '#374151', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12, 
    color: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#4B5563' 
  },
  colorPickerContainer: {
    marginBottom: 12
  },
  colorPickerLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap'
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  colorOptionSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 3
  },
  currencyOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  currencyOption: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  currencyOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E40AF'
  },
  currencyOptionText: {
    color: '#FFFFFF',
    fontSize: 16
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center'
  },
  dateInput: {
    flex: 2,
    marginBottom: 0,
    marginRight: 8,
    minWidth: 0
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
    minWidth: 0
  },
  modalButtons: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 8 
  },
  modalButton: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  cancelButton: { 
    backgroundColor: '#374151' 
  },
  saveButton: { 
    backgroundColor: '#3B82F6' 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold' 
  },
  modalScrollView: {
    width: '100%'
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  accountOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap'
  },
  accountOption: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  accountOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E40AF'
  },
  accountOptionText: {
    color: '#FFFFFF',
    fontSize: 14
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6'
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 14
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
    marginTop: 8
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 24
  },
  authSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4
  },
  switchAuthMode: {
    padding: 8,
    marginBottom: 16,
    alignItems: 'center'
  },
  switchAuthModeText: {
    color: '#6B7C4F',
    fontSize: 14
  },
  disabledButton: {
    opacity: 0.5
  },
  stockSummary: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  stockSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  stockSummaryLabel: {
    color: '#9CA3AF',
    fontSize: 14
  },
  stockSummaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  profitText: {
    color: '#10B981'
  },
  lossText: {
    color: '#EF4444'
  },
  scanButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
});
