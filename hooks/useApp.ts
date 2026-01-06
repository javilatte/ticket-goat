import { useCallback } from 'react';
import { Alert } from 'react-native';
import { Database } from '../services/database';
import { ExportService } from '../services/export';
import { useAppContext } from '../contexts/AppContext';
import { useTransactions } from './useTransactions';
import { useAccounts } from './useAccounts';
import { useStocks } from './useStocks';

/**
 * Main application hook
 * Coordinates data loading, settings, and global operations
 * @returns App-level functions and state
 */
export function useApp() {
  const { 
    balance, 
    setBalance, 
    settings, 
    setSettings,
    setShowWelcome
  } = useAppContext();
  
  const { loadTransactions, updateBalance } = useTransactions();
  const { loadAccounts } = useAccounts();
  const { loadStocks } = useStocks();

  const loadData = useCallback(async () => {
    const txs = await loadTransactions();
    const bal = await Database.getBalance();
    setBalance(bal);

    const sett = await Database.getSettings();
    setSettings(sett);
    
    if (sett.showWelcomeScreen) {
      setShowWelcome(true);
    }

    await loadAccounts(txs);
    await loadStocks();
    await updateBalance(txs, bal);
  }, [loadTransactions, loadAccounts, loadStocks, updateBalance, setBalance, setSettings, setShowWelcome]);

  const updateSettings = useCallback(async (currency: string) => {
    const updatedSettings = { ...settings, currency };
    await Database.updateSettings(updatedSettings);
    setSettings(updatedSettings);
  }, [settings, setSettings]);

  const updateOcrApiUrl = useCallback(async (url: string) => {
    const updatedSettings = { ...settings, ocrApiUrl: url };
    await Database.updateSettings(updatedSettings);
    setSettings(updatedSettings);
    Alert.alert('Éxito', 'URL del servicio OCR actualizada');
  }, [settings, setSettings]);

  const clearAllData = useCallback(async () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro? Se borrarán todos los datos de forma permanente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Borrar Todo', 
          style: 'destructive',
          onPress: async () => {
            await Database.clearAllData();
            await loadData();
            Alert.alert('Completado', 'Todos los datos han sido borrados');
          }
        }
      ]
    );
  }, [loadData]);

  const exportToExcel = useCallback(async () => {
    try {
      await ExportService.exportToExcel();
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'No se pudo exportar a Excel');
    }
  }, []);

  const exportToCSV = useCallback(async () => {
    try {
      await ExportService.exportToCSV();
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'No se pudo exportar a CSV');
    }
  }, []);

  const importFromExcel = useCallback(async () => {
    try {
      await ExportService.importFromExcel();
      // Pequeño delay para asegurar que AsyncStorage se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      await loadData();
    } catch (error) {
      console.error('Import error:', error);
      // El error ya se muestra en ExportService
    }
  }, [loadData]);

  const importFromCSV = useCallback(async () => {
    try {
      await ExportService.importFromCSV();
      // Pequeño delay para asegurar que AsyncStorage se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      await loadData();
    } catch (error) {
      console.error('Import error:', error);
      // El error ya se muestra en ExportService
    }
  }, [loadData]);

  const togglePeriodFilter = useCallback(async () => {
    const newFilter: 'month' | 'payroll' = settings.periodFilter === 'month' ? 'payroll' : 'month';
    const updatedSettings = { ...settings, periodFilter: newFilter };
    await Database.updateSettings(updatedSettings);
    setSettings(updatedSettings);
  }, [settings, setSettings]);

  const toggleVisibility = useCallback(async () => {
    const updatedSettings = { ...settings, hideBalances: !settings.hideBalances };
    await Database.updateSettings(updatedSettings);
    setSettings(updatedSettings);
  }, [settings, setSettings]);

  const hideWelcomeScreen = useCallback(async () => {
    const updatedSettings = { ...settings, showWelcomeScreen: false };
    await Database.updateSettings(updatedSettings);
    setSettings(updatedSettings);
    setShowWelcome(false);
  }, [settings, setSettings, setShowWelcome]);

  return {
    balance,
    settings,
    loadData,
    updateSettings,
    updateOcrApiUrl,
    clearAllData,
    exportToExcel,
    exportToCSV,
    importFromExcel,
    importFromCSV,
    togglePeriodFilter,
    toggleVisibility,
    hideWelcomeScreen
  };
}
