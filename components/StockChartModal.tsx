import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/modal.styles';
import { fetchStockHistory, StockChartData } from '../services/stockApi';
import { Svg, Path, Circle, Line as SvgLine, Text as SvgText } from 'react-native-svg';

interface StockChartModalProps {
  visible: boolean;
  symbol: string;
  onClose: () => void;
}

export default function StockChartModal({
  visible,
  symbol,
  onClose,
}: StockChartModalProps) {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<StockChartData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && symbol) {
      loadChartData();
    }
  }, [visible, symbol]);

  const loadChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStockHistory(symbol);
      setChartData(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el gráfico');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setChartData(null);
    setError(null);
    onClose();
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth * 0.85, 400);

  const createChartPath = () => {
    if (!chartData || chartData.data.length === 0) return null;
    
    const width = chartWidth;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const cWidth = width - padding.left - padding.right;
    const cHeight = height - padding.top - padding.bottom;
    
    const prices = chartData.data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    
    const points = chartData.data.map((d, i) => {
      const x = padding.left + (i / (chartData.data.length - 1 || 1)) * cWidth;
      const y = padding.top + cHeight - ((d.price - minPrice) / priceRange) * cHeight;
      return { x, y, price: d.price, date: d.date };
    });
    
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');
    
    return { pathData, points, width, height, padding, cWidth, cHeight, minPrice, maxPrice };
  };

  const chart = createChartPath();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={styles.modalTitle}>
              {symbol} - Últimos 30 días
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {loading && (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={{ color: '#9CA3AF', marginTop: 10 }}>Cargando gráfico...</Text>
              </View>
            )}

            {error && (
              <View style={{ padding: 20 }}>
                <Text style={{ color: '#EF4444', textAlign: 'center' }}>{error}</Text>
                <TouchableOpacity
                  style={{ marginTop: 20, backgroundColor: '#10B981', padding: 12, borderRadius: 8 }}
                  onPress={loadChartData}
                >
                  <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>
                    Reintentar
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {chartData && chartData.data.length > 0 && chart && (
              <View>
                <View style={{ height: 300, alignItems: 'center' }}>
                  <Svg width={chart.width} height={chart.height}>
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const y = chart.padding.top + (i / 5) * chart.cHeight;
                      return (
                        <SvgLine
                          key={`grid-${i}`}
                          x1={chart.padding.left}
                          y1={y}
                          x2={chart.width - chart.padding.right}
                          y2={y}
                          stroke="#374151"
                          strokeWidth="0.5"
                        />
                      );
                    })}
                    
                    {/* Y-axis labels */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const price = chart.maxPrice - (i / 5) * (chart.maxPrice - chart.minPrice);
                      const y = chart.padding.top + (i / 5) * chart.cHeight;
                      return (
                        <SvgText
                          key={`y-label-${i}`}
                          x={chart.padding.left - 5}
                          y={y + 4}
                          fontSize="11"
                          fill="#9CA3AF"
                          textAnchor="end"
                        >
                          ${price.toFixed(0)}
                        </SvgText>
                      );
                    })}
                    
                    {/* X-axis labels */}
                    {chartData.data.filter((_, i) => i % Math.ceil(chartData.data.length / 6) === 0).map((d, i) => {
                      const index = i * Math.ceil(chartData.data.length / 6);
                      const x = chart.padding.left + (index / (chartData.data.length - 1 || 1)) * chart.cWidth;
                      const date = new Date(d.date);
                      return (
                        <SvgText
                          key={`x-label-${i}`}
                          x={x}
                          y={chart.height - 20}
                          fontSize="11"
                          fill="#9CA3AF"
                          textAnchor="middle"
                        >
                          {date.getDate()}/{date.getMonth() + 1}
                        </SvgText>
                      );
                    })}
                    
                    {/* Chart line */}
                    <Path
                      d={chart.pathData}
                      stroke="#10B981"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Data points */}
                    {chart.points.map((point, i) => (
                      <Circle
                        key={`point-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#10B981"
                      />
                    ))}
                  </Svg>
                </View>
                
                <View style={{ marginTop: 20, padding: 15, backgroundColor: '#374151', borderRadius: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#9CA3AF' }}>Precio más bajo:</Text>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                      ${Math.min(...chartData.data.map(d => d.price)).toFixed(2)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#9CA3AF' }}>Precio más alto:</Text>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                      ${Math.max(...chartData.data.map(d => d.price)).toFixed(2)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#9CA3AF' }}>Precio actual:</Text>
                    <Text style={{ color: '#10B981', fontWeight: 'bold' }}>
                      ${chartData.data[chartData.data.length - 1].price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton, { marginTop: 20 }]}
            onPress={handleClose}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
