import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../styles/modal.styles';

interface TicketScannerProps {
  onAmountDetected: (amount: string) => void;
  ocrApiUrl?: string;
  visible?: boolean;
}

export default function TicketScanner({ onAmountDetected, ocrApiUrl, visible }: TicketScannerProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      setImageUri(null);
    }
  }, [visible]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se necesita acceso a la cámara para escanear tickets');
      return false;
    }
    return true;
  };

  const processImage = async (uri: string) => {
    setProcessing(true);
    try {
      if (!ocrApiUrl) {
        Alert.alert(
          'Servicio OCR no configurado',
          'Por favor configura la URL del servicio OCR en Ajustes para usar esta función.'
        );
        setProcessing(false);
        return;
      }

      // Crear FormData con la imagen
      const formData = new FormData();
      
      // En web, necesitamos convertir la URI a blob
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('file', blob, 'ticket.jpg');
      } else {
        // En móvil, usar la URI directamente
        formData.append('file', {
          uri,
          type: 'image/jpeg',
          name: 'ticket.jpg',
        } as any);
      }

      // Llamar a la API OCR
      const apiResponse = await fetch(`${ocrApiUrl}/ocr/total`, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error('Error en el servicio OCR');
      }

      const result = await apiResponse.json();
      
      if (result.success && result.total) {
        const amount = result.total.toFixed(2);
        const fullText = result.text || 'No disponible';
        onAmountDetected(amount);
        Alert.alert(
          'Total detectado',
          `Se encontró: ${amount}€\n\n¿Es correcto?`,
          [
            { text: 'Sí', style: 'default' },
            { 
              text: 'Ver texto completo', 
              onPress: () => Alert.alert('Texto detectado', fullText)
            }
          ]
        );
      } else {
        Alert.alert(
          'No se detectó el total',
          result.message || 'No se pudo encontrar el total automáticamente.',
          [
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Error procesando imagen:', error);
      Alert.alert(
        'Error',
        'No se pudo conectar con el servicio OCR. Asegúrate de que está ejecutándose y la URL es correcta.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      // En web, usar la cámara del navegador
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await processImage(uri);
      }
    } else {
      // En móvil, pedir permisos primero
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await processImage(uri);
      }
    }
  };

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // En web, solo pedir selección de archivo
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await processImage(uri);
      }
    } else {
      // En móvil, pedir permisos primero
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Se necesita acceso a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await processImage(uri);
      }
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={[styles.inputLabel, { marginBottom: 10 }]}>Escanear ticket</Text>
      
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={[styles.scanButton, { flex: 1 }]}
          onPress={takePhoto}
          disabled={processing}
        >
          <MaterialIcons name="camera-alt" size={24} color="#FFF" />
          <Text style={styles.scanButtonText}>Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scanButton, { flex: 1 }]}
          onPress={pickImage}
          disabled={processing}
        >
          <MaterialIcons name="photo-library" size={24} color="#FFF" />
          <Text style={styles.scanButtonText}>Galería</Text>
        </TouchableOpacity>
      </View>

      {processing && (
        <View style={{ alignItems: 'center', marginTop: 15 }}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={{ color: '#9CA3AF', marginTop: 10 }}>Procesando ticket...</Text>
        </View>
      )}

      {imageUri && !processing && (
        <View style={{ marginTop: 15, alignItems: 'center' }}>
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: 200, borderRadius: 8 }}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => setImageUri(null)}
          >
            <Text style={{ color: '#EF4444', fontSize: 12 }}>Quitar imagen</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
