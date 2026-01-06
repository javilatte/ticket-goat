import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stock } from '../services/database';
import { fetchStockHistory, StockChartData } from '../services/stockApi';
import { styles } from '../styles/dashboard.styles';
import { Svg, Path, Circle, Line as SvgLine, Text as SvgText } from 'react-native-svg';

interface StockCardProps {
  stock: Stock;
  currency: string;
  onEdit: (stock: Stock) => void;
  formatAmount: (amount: number) => string;
}

export default function StockCard({ stock, currency: _currency, onEdit, formatAmount }: StockCardProps) {
  const [chartData, setChartData] = useState<StockChartData | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);

  const totalValue = stock.quantity * stock.currentPrice;
  const invested = stock.quantity * stock.buyPrice;
  const profitLoss = totalValue - invested;
  const profitLossPercent = (profitLoss / invested) * 100;

  useEffect(() => {
    if (!chartData && !loadingChart) {
      loadChart();
    }
  }, []);

  const loadChart = async () => {
    setLoadingChart(true);
    try {
      const data = await fetchStockHistory(stock.symbol);
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart:', error);
    } finally {
      setLoadingChart(false);
    }
  };

  const getFilteredData = () => {
    if (!chartData || chartData.data.length === 0) return [];
    
    // Show last 30 days
    const daysToShow = 30;
    
    return chartData.data.slice(-daysToShow).map((item, index) => ({
      x: index,
      y: item.price,
      date: item.date
    }));
  };

  const filteredData = useMemo(() => getFilteredData(), [chartData]);
  const minPrice = filteredData.length > 0 ? Math.min(...filteredData.map(d => d.y)) : 0;
  const maxPrice = filteredData.length > 0 ? Math.max(...filteredData.map(d => d.y)) : 0;

  const createChartPath = () => {
    if (filteredData.length === 0) return '';
    
    const width = 250;
    const height = 140;
    const padding = { top: 10, right: 15, bottom: 30, left: 45 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const priceRange = maxPrice - minPrice || 1;
    
    const points = filteredData.map((d, i) => {
      const x = padding.left + (i / (filteredData.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.y - minPrice) / priceRange) * chartHeight;
      return { x, y, price: d.y, date: d.date };
    });
    
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');
    
    return { pathData, points, width, height, padding, chartWidth, chartHeight };
  };

  const chart = createChartPath();

  return (
    <View style={styles.stockCardSquare}>
      <TouchableOpacity onPress={() => onEdit(stock)}>
        <View style={styles.stockHeaderSquare}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stockSymbol}>{stock.symbol}</Text>
            <Text style={styles.stockNameSquare} numberOfLines={1}>{stock.name}</Text>
          </View>
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            onEdit(stock);
          }}>
            <MaterialIcons name="edit" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.stockValueSquare}>
          <Text style={styles.stockValue}>{formatAmount(totalValue)} USD</Text>
          <Text style={styles.stockQuantitySquare}>
            {stock.quantity} × ${formatAmount(stock.currentPrice)}
          </Text>
        </View>
        
        <View style={[styles.stockProfitLossSquare, profitLoss >= 0 ? styles.profitBg : styles.lossBg]}>
          <Text style={[
            styles.stockProfitLossTextSquare,
            profitLoss >= 0 ? styles.profitText : styles.lossText
          ]}>
            {profitLoss >= 0 ? '+' : ''}{formatAmount(profitLoss)} USD
          </Text>
          <Text style={[
            styles.stockProfitPercent,
            profitLoss >= 0 ? styles.profitText : styles.lossText
          ]}>
            {profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(1)}%
          </Text>
        </View>
      </TouchableOpacity>

      {loadingChart && (
        <View style={{ alignItems: 'center', padding: 20 }}>
          <ActivityIndicator color="#10B981" size="small" />
        </View>
      )}

      {!loadingChart && filteredData.length > 0 && typeof chart !== 'string' && chart.pathData && (
        <View style={{ height: 160, marginTop: 5 }}>
          <Svg width={chart.width} height={chart.height}>
            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => {
              const y = chart.padding.top + (i / 3) * chart.chartHeight;
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
            
            {/* Y-axis labels (prices) */}
            {[0, 1, 2, 3].map((i) => {
              const price = maxPrice - (i / 3) * (maxPrice - minPrice);
              const y = chart.padding.top + (i / 3) * chart.chartHeight;
              return (
                <SvgText
                  key={`y-label-${i}`}
                  x={chart.padding.left - 8}
                  y={y + 3}
                  fontSize="9"
                  fill="#9CA3AF"
                  textAnchor="end"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                >
                  ${price.toFixed(0)}
                </SvgText>
              );
            })}
            
            {/* X-axis labels (dates) */}
            {filteredData.filter((_, i) => i % Math.ceil(filteredData.length / 4) === 0).map((d, i) => {
              const index = i * Math.ceil(filteredData.length / 4);
              const x = chart.padding.left + (index / (filteredData.length - 1 || 1)) * chart.chartWidth;
              const date = new Date(d.date);
              return (
                <SvgText
                  key={`x-label-${i}`}
                  x={x}
                  y={chart.height - 10}
                  fontSize="9"
                  fill="#9CA3AF"
                  textAnchor="middle"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                >
                  {date.getDate()}/{date.getMonth() + 1}
                </SvgText>
              );
            })}
            
            {/* Chart line */}
            <Path
              d={chart.pathData}
              stroke={profitLoss >= 0 ? '#10B981' : '#EF4444'}
              strokeWidth="2"
              fill="none"
            />
            
            {/* Data points */}
            {chart.points.map((point: { x: number; y: number; price: number; date: string }, i: number) => (
              <Circle
                key={`point-${i}`}
                cx={point.x}
                cy={point.y}
                r="3"
                fill={profitLoss >= 0 ? '#10B981' : '#EF4444'}
              />
            ))}
          </Svg>
        </View>
      )}

      {!loadingChart && !chartData && (
        <Text style={{ color: '#EF4444', fontSize: 10, textAlign: 'center', marginTop: 10 }}>
          Sin datos
        </Text>
      )}
    </View>
  );
}
