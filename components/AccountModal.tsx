import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles/modal.styles';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, iban: string, color: string, initialBalance: number) => void;
}

export default function AccountModal({
  visible,
  onClose,
  onSave,
}: AccountModalProps) {
  const [name, setName] = React.useState('');
  const [iban, setIban] = React.useState('');
  const [initialBalance, setInitialBalance] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('#3B82F6');

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280'];

  const handleSave = () => {
    if (name.trim()) {
      const balance = parseFloat(initialBalance) || 0;
      onSave(name.trim(), iban.trim(), selectedColor, balance);
      setName('');
      setIban('');
      setInitialBalance('');
      setSelectedColor('#3B82F6');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nueva Cuenta</Text>
          
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
      </View>
    </Modal>
  );
}
