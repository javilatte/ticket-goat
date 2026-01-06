import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingsScreenProps {
  currency: string;
  ocrApiUrl: string;
  onCurrencyChange: (currency: string) => void;
  onOcrApiUrlChange: (url: string) => void;
  onClearAllData: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onImportExcel: () => void;
  onImportCSV: () => void;
  onClose: () => void;
}

export default function SettingsScreen({
  currency,
  ocrApiUrl,
  onCurrencyChange,
  onOcrApiUrlChange,
  onClearAllData,
  onExportExcel,
  onExportCSV,
  onImportExcel,
  onImportCSV,
  onClose: _onClose,
}: SettingsScreenProps) {
  const currencies = ['€', '$', '£', '¥'];
  const [urlInput, setUrlInput] = React.useState(ocrApiUrl || 'http://localhost:8000');
  const [selectedCurrency, setSelectedCurrency] = React.useState(currency);

  const handleOcrUrlSave = () => {
    onOcrApiUrlChange(urlInput);
  };

  const handleCurrencyConfirm = () => {
    onCurrencyChange(selectedCurrency);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moneda</Text>
          <View style={styles.currencyOptions}>
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr}
                style={[
                  styles.currencyOption,
                  selectedCurrency === curr && styles.currencyOptionSelected
                ]}
                onPress={() => setSelectedCurrency(curr)}
              >
                <Text style={styles.currencyOptionText}>{curr}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedCurrency !== currency && (
            <TouchableOpacity
              style={styles.confirmCurrencyButton}
              onPress={handleCurrencyConfirm}
            >
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
              <Text style={styles.confirmCurrencyButtonText}>Confirmar cambio de moneda</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escáner de Tickets (OCR)</Text>
          
          <View style={styles.ocrConfig}>
            <Text style={styles.inputLabel}>URL del servicio OCR (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="http://localhost:8000"
              placeholderTextColor="#999"
              value={urlInput}
              onChangeText={setUrlInput}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TouchableOpacity
              style={styles.saveUrlButton}
              onPress={handleOcrUrlSave}
            >
              <MaterialIcons name="save" size={20} color="#FFFFFF" />
              <Text style={styles.saveUrlButtonText}>Guardar URL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={20} color="#6B7C4F" />
            <Text style={styles.infoText}>
              Si tienes el servicio OCR corriendo localmente con Docker, configura la URL aquí para escanear tickets automáticamente.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <MaterialIcons name="warning" size={20} color="#F59E0B" />
            <Text style={styles.warningText}>
              Función en desarrollo. Sin HTTPS las imágenes viajan sin cifrar. Solo usar en red local privada (localhost o 192.168.x.x).
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exportar Datos</Text>
          
          <TouchableOpacity
            style={styles.exportButton}
            onPress={onExportExcel}
          >
            <MaterialIcons name="table-chart" size={24} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Exportar a Excel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, { marginTop: 12 }]}
            onPress={onExportCSV}
          >
            <MaterialIcons name="description" size={24} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Exportar a CSV</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Importar Datos</Text>
          
          <TouchableOpacity
            style={styles.importButton}
            onPress={onImportExcel}
          >
            <MaterialIcons name="upload-file" size={24} color="#FFFFFF" />
            <Text style={styles.importButtonText}>Importar desde Excel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.importButton, { marginTop: 12 }]}
            onPress={onImportCSV}
          >
            <MaterialIcons name="upload-file" size={24} color="#FFFFFF" />
            <Text style={styles.importButtonText}>Importar desde CSV</Text>
          </TouchableOpacity>
          
          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={20} color="#6B7C4F" />
            <Text style={styles.infoText}>
              Los datos importados se añadirán a los existentes. Usa el formato de exportación de esta app.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={onClearAllData}
          >
            <MaterialIcons name="delete-forever" size={24} color="#FFFFFF" />
            <Text style={styles.dangerButtonText}>Borrar todos los datos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827'
  },
  content: {
    flex: 1,
    padding: 20
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24
  },
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16
  },
  currencyOptions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap'
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
    borderColor: '#6B7C4F',
    backgroundColor: '#5A6A42'
  },
  currencyOptionText: {
    color: '#FFFFFF',
    fontSize: 16
  },
  dangerButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  exportButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  importButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  ocrConfig: {
    marginTop: 8,
    marginBottom: 12
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
  saveUrlButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  saveUrlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  confirmCurrencyButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16
  },
  confirmCurrencyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(107, 124, 79, 0.15)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 124, 79, 0.3)',
    marginTop: 12
  },
  infoText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 13,
    lineHeight: 18
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginTop: 12
  },
  warningText: {
    flex: 1,
    color: '#FCD34D',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500'
  }
});
