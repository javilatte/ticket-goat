import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { styles } from '../styles/modal.styles';
import { Account } from '../services/database';
import TicketScanner from './TicketScanner';

interface TransactionModalProps {
  visible: boolean;
  formData: {
    type: 'income' | 'expense';
    amount: string;
    description: string;
    category: string;
    categoryColor: string;
    date: string;
    time: string;
    accountId: string;
    isPayroll: boolean;
  };
  accounts: Account[];
  ocrApiUrl?: string;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (data: any) => void;
}

export default function TransactionModal({
  visible,
  formData,
  accounts,
  ocrApiUrl,
  onClose,
  onSave,
  onFormChange,
}: TransactionModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{formData.type === 'expense' ? 'Gasto' : 'Ingreso'}</Text>
            
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'expense' && styles.typeButtonExpense]}
                onPress={() => onFormChange({...formData, type: 'expense'})}
              >
                <Text style={styles.typeButtonText}>Gasto</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.typeButton, formData.type === 'income' && styles.typeButtonIncome]}
              onPress={() => onFormChange({...formData, type: 'income'})}
            >
              <Text style={styles.typeButtonText}>Ingreso</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(text) => onFormChange({...formData, amount: text})}
          />

          {formData.type === 'expense' && (
            <TicketScanner
              onAmountDetected={(amount) => onFormChange({...formData, amount})}
              ocrApiUrl={ocrApiUrl}
              visible={visible}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            placeholderTextColor="#999"
            value={formData.description}
            onChangeText={(text) => onFormChange({...formData, description: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Categoría"
            placeholderTextColor="#999"
            value={formData.category}
            onChangeText={(text) => onFormChange({...formData, category: text})}
          />

          <View style={styles.colorPickerContainer}>
            <Text style={styles.colorPickerLabel}>Color de categoría:</Text>
            <View style={styles.colorOptions}>
              {['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#EF4444', '#06B6D4', '#6B7280'].map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    formData.categoryColor === color && styles.colorOptionSelected
                  ]}
                  onPress={() => onFormChange({...formData, categoryColor: color})}
                />
              ))}
            </View>
          </View>

          <Text style={styles.inputLabel}>Cuenta</Text>
          <View style={styles.accountOptions}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  formData.accountId === account.id && styles.accountOptionSelected
                ]}
                onPress={() => onFormChange({...formData, accountId: account.id})}
              >
                <Text style={styles.accountOptionText}>{account.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {formData.type === 'income' && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => onFormChange({...formData, isPayroll: !formData.isPayroll})}
            >
              <View style={[styles.checkbox, formData.isPayroll && styles.checkboxChecked]}>
                {formData.isPayroll && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Marcar como nómina</Text>
            </TouchableOpacity>
          )}

          <View style={styles.dateTimeContainer}>
            <TextInput
              style={[styles.input, styles.dateInput]}
              placeholder="Fecha (DD/MM/YYYY)"
              placeholderTextColor="#999"
              value={formData.date}
              onChangeText={(text) => onFormChange({...formData, date: text})}
            />
            <TextInput
              style={[styles.input, styles.timeInput]}
              placeholder="Hora (HH:MM)"
              placeholderTextColor="#999"
              value={formData.time}
              onChangeText={(text) => onFormChange({...formData, time: text})}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
