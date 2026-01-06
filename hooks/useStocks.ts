import { useCallback } from 'react';
import { Stock } from '../types';
import { Alert } from '../utils/alert';
import { Database } from '../services/database';
import { updateAllStockPrices } from '../services/stockApi';
import { useAppContext } from '../contexts/AppContext';

/**
 * Custom hook for managing stock portfolio
 * Handles stock CRUD operations and price updates
 * @returns Stock management functions and state
 */
export function useStocks() {
  const { 
    stocks, 
    setStocks,
    editingStock,
    setEditingStock,
    setShowStockModal
  } = useAppContext();

  const loadStocks = useCallback(async () => {
    const stks = await Database.getStocks();
    setStocks(stks);
    return stks;
  }, [setStocks]);

  const addStock = useCallback(async (stockData: Partial<Stock>) => {
    await Database.addStock(stockData as Stock);
    await loadStocks();
    setShowStockModal(false);
    setEditingStock(null);
  }, [loadStocks, setShowStockModal, setEditingStock]);

  const updateStock = useCallback(async (stockData: Partial<Stock>) => {
    if (editingStock) {
      await Database.updateStock(editingStock.id, stockData);
      await loadStocks();
    }
    setShowStockModal(false);
    setEditingStock(null);
  }, [editingStock, loadStocks, setShowStockModal, setEditingStock]);

  const saveStock = useCallback(async (stockData: Partial<Stock>) => {
    if (editingStock) {
      await updateStock(stockData);
    } else {
      await addStock(stockData);
    }
  }, [editingStock, updateStock, addStock]);

  const deleteStock = useCallback(async (stockId: string) => {
    await Database.deleteStock(stockId);
    await loadStocks();
    setShowStockModal(false);
    setEditingStock(null);
  }, [loadStocks, setShowStockModal, setEditingStock]);

  const editStock = useCallback((stock: Stock) => {
    setEditingStock(stock);
    setShowStockModal(true);
  }, [setEditingStock, setShowStockModal]);

  const updateStockPrices = useCallback(async () => {
    if (stocks.length === 0) return;
    
    try {
      const updatedStocks = await updateAllStockPrices(stocks);
      await Database.saveStocks(updatedStocks);
      await loadStocks();
      Alert.alert('Éxito', 'Precios actualizados correctamente');
    } catch (error) {
      console.error('Error updating stock prices:', error);
      Alert.alert('Error', 'Error al actualizar algunos precios');
    }
  }, [stocks, loadStocks]);

  return {
    stocks,
    loadStocks,
    addStock,
    updateStock,
    saveStock,
    deleteStock,
    editStock,
    updateStockPrices
  };
}
