import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  disabled = false,
  style,
  textStyle 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <MaterialIcons name={icon} size={20} color="#FFFFFF" style={styles.icon} />}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  primary: {
    backgroundColor: '#3B82F6'
  },
  secondary: {
    backgroundColor: '#6B7280'
  },
  danger: {
    backgroundColor: '#EF4444'
  },
  success: {
    backgroundColor: '#10B981'
  },
  disabled: {
    opacity: 0.5
  },
  icon: {
    marginRight: 4
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
});
