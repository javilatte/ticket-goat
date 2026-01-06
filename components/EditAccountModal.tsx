import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from '../utils/alert';
import { styles } from '../styles/modal.styles';
import { Account } from '../services/database';

interface EditAccountModalProps {
  visible: boolean;
  account: Account | null;
  onClose: () => void;
  onSave: (accountId: string, updates: Partial<Account> & { oldCurrentBalance?: number }) => void;
  onDelete: (accountId: string) => void;
}

export default function EditAccountModal({
  visible,
  account,
  onClose,
  onSave,
  onDelete,
}: EditAccountModalProps) {
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280'];

  useEffect(() => {
    if (account) {
      setName(account.name);
      setIban(account.iban || '');
      setInitialBalance(account.initialBalance.toString());
      setCurrentBalance(account.currentBalance.toString());
      setSelectedColor(account.color || '#3B82F6');
    }
  }, [account]);

  const handleSave = () => {
    if (account && name.trim()) {
      const updates: Partial<Account> & { oldCurrentBalance?: number } = {
        name: name.trim(),
        iban: iban.trim(),
        initialBalance: parseFloat(initialBalance) || 0,
        currentBalance: parseFloat(currentBalance) || 0,
        color: selectedColor,
        oldCurrentBalance: account.currentBalance
      };
      onSave(account.id, updates);
      onClose();
    }
  };

  const handleDelete = () => {
    if (account) {
      const { confirmAsync } = require('../utils/alert');
      confirmAsync(
        'Eliminar Cuenta',
        `¿Eliminar la cuenta "${account.name}"? Esta acción no se puede deshacer.`,
        () => {
          onDelete(account.id);
          onClose();
        }
      );
    }
  };

  if (!account) return null;

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
            <Text style={styles.modalTitle}>Editar Cuenta</Text>
            
            <Text style={styles.inputLabel}>Nombre de la cuenta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Principal, Ahorros..."
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>IBAN (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="ES00 0000 0000 0000 0000 0000"
              placeholderTextColor="#999"
              value={iban}
              onChangeText={setIban}
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>Balance Inicial</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={initialBalance}
              onChangeText={setInitialBalance}
            />

            <Text style={styles.inputLabel}>Balance Actual (ajuste manual)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={currentBalance}
              onChangeText={setCurrentBalance}
            />

            <Text style={styles.inputLabel}>Color de la cuenta</Text>
            <View style={styles.colorOptions}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete-forever" size={24} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
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
