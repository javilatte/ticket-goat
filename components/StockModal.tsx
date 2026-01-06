import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/modal.styles';
import { Stock } from '../services/database';
import { fetchStockPrice } from '../services/stockApi';
import StockChartModal from './StockChartModal';

interface StockModalProps {
  visible: boolean;
  stock: Stock | null;
  onClose: () => void;
  onSave: (stock: Partial<Stock>) => void;
  onDelete?: (stockId: string) => void;
}

export default function StockModal({
  visible,
  stock,
  onClose,
  onSave,
  onDelete,
}: StockModalProps) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [currentPrice, setCurrentPrice] = useState('');
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (stock) {
      setSymbol(stock.symbol);
      setName(stock.name);
      setQuantity(stock.quantity.toString());
      setBuyPrice(stock.buyPrice.toString());
      setCurrentPrice(stock.currentPrice.toString());
    } else {
      setSymbol('');
      setName('');
      setQuantity('');
      setBuyPrice('');
      setCurrentPrice('');
    }
  }, [stock, visible]);

  const handleSave = () => {
    if (!symbol.trim() || !quantity || !buyPrice) {
      Alert.alert('Error', 'Por favor completa al menos: Símbolo, Cantidad y Precio de Compra');
      return;
    }

    const stockData: Partial<Stock> = {
      id: stock?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol: symbol.trim().toUpperCase(),
      name: name.trim() || symbol.trim().toUpperCase(),
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice) || parseFloat(buyPrice),
      lastUpdated: new Date().toISOString()
    };

    onSave(stockData);
    handleClose();
  };

  const handleDelete = () => {
    if (stock && onDelete) {
      Alert.alert(
        'Eliminar Stock',
        `¿Eliminar ${stock.symbol}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              onDelete(stock.id);
              handleClose();
            }
          }
        ]
      );
    }
  };

  const handleClose = () => {
    setSymbol('');
    setName('');
    setQuantity('');
    setBuyPrice('');
    setCurrentPrice('');
    setLoadingPrice(false);
    onClose();
  };

  const handleFetchPrice = async () => {
    if (!symbol.trim()) {
      Alert.alert('Error', 'Ingresa un símbolo primero');
      return;
    }

    setLoadingPrice(true);
    try {
      const priceData = await fetchStockPrice(symbol.trim());
      setCurrentPrice(priceData.price.toString());
      if (!name.trim()) {
        setName(priceData.symbol);
      }
      Alert.alert('Éxito', `Precio actualizado: $${priceData.price}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al obtener el precio');
    } finally {
      setLoadingPrice(false);
    }
  };

  const totalInvested = parseFloat(quantity || '0') * parseFloat(buyPrice || '0');
  const currentValue = parseFloat(quantity || '0') * parseFloat(currentPrice || buyPrice || '0');
  const profitLoss = currentValue - totalInvested;
  const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {stock ? 'Editar Acción' : 'Nueva Acción'}
          </Text>

          <Text style={styles.inputLabel}>Símbolo (ej: AAPL, TSLA)</Text>
          <TextInput
            style={styles.input}
            placeholder="AAPL"
            placeholderTextColor="#999"
            value={symbol}
            onChangeText={setSymbol}
            autoCapitalize="characters"
          />

          <Text style={styles.inputLabel}>Nombre (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Apple Inc."
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Cantidad de acciones</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.inputLabel}>Precio de compra (por acción)</Text>
          <TextInput
            style={styles.input}
            placeholder="150.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={buyPrice}
            onChangeText={setBuyPrice}
          />

          <Text style={styles.inputLabel}>Precio actual</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="160.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={currentPrice}
              onChangeText={setCurrentPrice}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#10B981',
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 48,
              }}
              onPress={handleFetchPrice}
              disabled={loadingPrice}
            >
              {loadingPrice ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <MaterialIcons name="refresh" size={18} color="#FFF" />
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14, marginLeft: 5 }}>
                    Actualizar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {(quantity && buyPrice) && (
            <View style={styles.stockSummary}>
              <View style={styles.stockSummaryRow}>
                <Text style={styles.stockSummaryLabel}>Inversión total:</Text>
                <Text style={styles.stockSummaryValue}>{totalInvested.toFixed(2)} €</Text>
              </View>
              <View style={styles.stockSummaryRow}>
                <Text style={styles.stockSummaryLabel}>Valor actual:</Text>
                <Text style={styles.stockSummaryValue}>{currentValue.toFixed(2)} €</Text>
              </View>
              <View style={styles.stockSummaryRow}>
                <Text style={styles.stockSummaryLabel}>Ganancia/Pérdida:</Text>
                <Text style={[
                  styles.stockSummaryValue,
                  profitLoss >= 0 ? styles.profitText : styles.lossText
                ]}>
                  {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} € ({profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%)
                </Text>
              </View>
            </View>
          )}

          {symbol.trim() && (
            <TouchableOpacity
              style={{
                backgroundColor: '#8B5CF6',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15
              }}
              onPress={() => setShowChart(true)}
            >
              <MaterialIcons name="show-chart" size={20} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: 'bold', marginLeft: 8 }}>
                Ver Gráfico de Evolución
              </Text>
            </TouchableOpacity>
          )}

          {stock && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete-forever" size={24} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Eliminar Acción</Text>
            </TouchableOpacity>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
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

      <StockChartModal
        visible={showChart}
        symbol={symbol}
        onClose={() => setShowChart(false)}
      />
    </Modal>
  );
}
