// Yahoo Finance API - Completely free, no API key required
const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance';
// CORS proxy for web browsers
const CORS_PROXY = 'https://corsproxy.io/?';

import { Stock } from '../types';
import { Platform } from 'react-native';

export interface StockPrice {
  symbol: string;
  price: number;
  currency: string;
  timestamp: number;
}

export interface StockHistoricalData {
  date: string;
  price: number;
}

export interface StockChartData {
  symbol: string;
  data: StockHistoricalData[];
  currency: string;
}

/**
 * Fetch stock price using Yahoo Finance API
 */
export async function fetchStockPrice(symbol: string): Promise<StockPrice> {
  try {
    // En web, usar proxy CORS para evitar problemas de CORS
    const url = `${YAHOO_BASE_URL}/chart/${symbol.toUpperCase()}?interval=1d&range=1d`;
    const finalUrl = Platform.OS === 'web' ? `${CORS_PROXY}${encodeURIComponent(url)}` : url;
    
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error('Símbolo no encontrado');
    }
    
    const result = data.chart.result[0];
    const meta = result.meta;
    
    if (!meta.regularMarketPrice) {
      throw new Error('No se encontraron datos de precio');
    }
    
    return {
      symbol: meta.symbol,
      price: parseFloat(meta.regularMarketPrice.toFixed(2)),
      currency: meta.currency || 'USD',
      timestamp: Date.now()
    };
  } catch (error: any) {
    console.error('Error fetching stock price from Yahoo Finance:', error);
    throw new Error(error.message || `No se pudo obtener el precio de ${symbol}.`);
  }
}

/**
 * Search for stock symbols (simplified - Yahoo doesn't have search API)
 * @param _query - Search query (unused - Yahoo Finance has no free search endpoint)
 * @returns Empty array (Yahoo Finance doesn't provide free search API)
 */
export async function searchStockSymbol(_query: string): Promise<[]> {
  // Yahoo Finance doesn't provide a free search API
  // Return empty array - user must know exact symbol
  return [];
}

/**
 * Update stock prices for all stocks in the portfolio
 * @param stocks - Array of stock holdings to update
 * @returns Updated stocks with current prices
 */
export async function updateAllStockPrices(stocks: Stock[]): Promise<Stock[]> {
  const updatedStocks = await Promise.all(
    stocks.map(async (stock) => {
      try {
        const priceData = await fetchStockPrice(stock.symbol);
        return {
          ...stock,
          currentPrice: priceData.price,
          lastUpdated: new Date(priceData.timestamp).toISOString()
        };
      } catch (error) {
        console.error(`Error updating ${stock.symbol}:`, error);
        return stock; // Return unchanged if error
      }
    })
  );
  
  return updatedStocks;
}

/**
 * Fetch historical stock data for chart using Yahoo Finance
 */
export async function fetchStockHistory(symbol: string, days: number = 30): Promise<StockChartData> {
  try {
    // En web, usar proxy CORS para evitar problemas de CORS
    const url = `${YAHOO_BASE_URL}/chart/${symbol.toUpperCase()}?interval=1d&range=${days}d`;
    const finalUrl = Platform.OS === 'web' ? `${CORS_PROXY}${encodeURIComponent(url)}` : url;
    
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error('No se encontraron datos históricos');
    }
    
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;
    
    if (!timestamps || !prices) {
      throw new Error('No se encontraron datos históricos');
    }
    
    const historicalData: StockHistoricalData[] = timestamps.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      price: parseFloat(prices[index]?.toFixed(2) || '0')
    })).filter((item: StockHistoricalData) => item.price > 0);
    
    return {
      symbol: result.meta.symbol,
      data: historicalData,
      currency: result.meta.currency || 'USD'
    };
  } catch (error: any) {
    console.error('Error fetching stock history from Yahoo Finance:', error);
    throw new Error(error.message || `No se pudo obtener el historial de ${symbol}.`);
  }
}
