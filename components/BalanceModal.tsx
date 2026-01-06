import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles/modal.styles';

interface BalanceModalProps {
  visible: boolean;
  value: string;
  onClose: () => void;
  onSave: () => void;
  onValueChange: (value: string) => void;
}

export default function BalanceModal({
  visible,
  value,
  onClose,
  onSave,
  onValueChange,
}: BalanceModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Balance Inicial</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={value}
            onChangeText={onValueChange}
          />

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
      </View>
    </Modal>
  );
}
