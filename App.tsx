import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, PanResponder, useWindowDimensions, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { useApp, useTransactions, useAccounts, useStocks } from './hooks';
import Dashboard from './components/Dashboard';
import TransactionModal from './components/TransactionModal';
import EditAccountModal from './components/EditAccountModal';
import SettingsScreen from './components/SettingsScreen';
import AccountModal from './components/AccountModal';
import StockModal from './components/StockModal';
import WelcomeScreen from './components/WelcomeScreen';

function AppContent() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  
  const [fontsLoaded, error] = useFonts({
    'StackSansNotch-SemiBold': require('./assets/fonts/fonts_temp/Stack_Sans_Notch/static/StackSansNotch-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading fonts:', error);
    }
  }, [error]);

  // Context
  const {
    transactions,
    accounts,
    stocks,
    formData,
    setFormData,
    editingAccount,
    editingStock,
    editingTransaction: _editingTransaction,
    showModal,
    setShowModal,
    showEditAccountModal,
    setShowEditAccountModal,
    showSettingsScreen,
    setShowSettingsScreen,
    showAccountModal,
    setShowAccountModal,
    showStockModal,
    setShowStockModal,
    showWelcome
  } = useAppContext();

  // Hooks
  const { 
    balance: _balance, 
    settings, 
    loadData, 
    updateSettings, 
    updateOcrApiUrl, 
    clearAllData, 
    exportToExcel, 
    exportToCSV,
    importFromExcel,
    importFromCSV,
    togglePeriodFilter: _togglePeriodFilter,
    toggleVisibility,
    hideWelcomeScreen
  } = useApp();
  
  const { addTransaction, deleteTransaction, editTransaction } = useTransactions();
  const { addAccount, updateAccount, deleteAccount, editAccount } = useAccounts();
  const { saveStock, deleteStock, editStock, updateStockPrices } = useStocks();

  useEffect(() => {
    if (fontsLoaded) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded]);

  // Handlers
  const handleAddTransaction = () => {
    setFormData({
      ...formData,
      accountId: accounts.length > 0 ? accounts[0].id : '',
      isPayroll: false
    });
    setShowModal(true);
  };

  const handleAddStock = () => {
    setShowStockModal(true);
  };

  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Listener para cambiar showSettingsScreen dinámicamente
  React.useEffect(() => {
    const listenerId = slideAnim.addListener(({ value }) => {
      const shouldShowSettings = value < -SCREEN_WIDTH / 2;
      if (shouldShowSettings !== showSettingsScreen) {
        setShowSettingsScreen(shouldShowSettings);
      }
    });
    return () => slideAnim.removeListener(listenerId);
  }, [showSettingsScreen, SCREEN_WIDTH, slideAnim, setShowSettingsScreen]);

  // Actualizar posición cuando cambia SCREEN_WIDTH
  React.useEffect(() => {
    if (showSettingsScreen) {
      slideAnim.setValue(-SCREEN_WIDTH);
    } else {
      slideAnim.setValue(0);
    }
  }, [SCREEN_WIDTH, showSettingsScreen, slideAnim]);

  const openSettings = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSettings = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (!showSettingsScreen && gestureState.dx < 0) {
          // Deslizar hacia la izquierda desde Dashboard
          slideAnim.setValue(Math.max(gestureState.dx, -SCREEN_WIDTH));
        } else if (showSettingsScreen && gestureState.dx > 0) {
          // Deslizar hacia la derecha desde Settings
          slideAnim.setValue(Math.min(-SCREEN_WIDTH + gestureState.dx, 0));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!showSettingsScreen && gestureState.dx < -100) {
          // Abrir Settings
          openSettings();
        } else if (showSettingsScreen && gestureState.dx > 100) {
          // Cerrar Settings
          closeSettings();
        } else {
          // Volver a posición original
          Animated.timing(slideAnim, {
            toValue: showSettingsScreen ? -SCREEN_WIDTH : 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header fijo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>TicketGOAT</Text>
          
          {/* Navegación debajo del título */}
          <View style={styles.navigationIndicator}>
            {showSettingsScreen ? (
              <>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={closeSettings}
                >
                  <Text style={styles.navTextInactive}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={openSettings}
                >
                  <Text style={styles.navText}>Ajustes</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={closeSettings}
                >
                  <Text style={styles.navText}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={openSettings}
                >
                  <Text style={styles.navTextInactive}>Ajustes</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Contenido deslizable */}
      <View style={styles.contentWrapper}>
        <Animated.View 
          style={[
            styles.screensContainer,
            { 
              width: SCREEN_WIDTH * 2,
              transform: [{ translateX: slideAnim }] 
            }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Dashboard Content */}
          <View style={[styles.screen, { width: SCREEN_WIDTH }]}>
            <Dashboard
              transactions={transactions}
              accounts={accounts}
              stocks={stocks}
              currency={settings.currency}
              hideBalances={settings.hideBalances}
              onAddTransaction={handleAddTransaction}
              onEditAccount={editAccount}
              onEditTransaction={editTransaction}
              onDeleteTransaction={deleteTransaction}
              onAddAccount={() => setShowAccountModal(true)}
              onToggleVisibility={toggleVisibility}
              onAddStock={handleAddStock}
              onEditStock={editStock}
              onUpdateStockPrices={updateStockPrices}
            />
          </View>

          {/* Settings Content */}
          <View style={[styles.screen, { width: SCREEN_WIDTH }]}>
            <SettingsScreen
              currency={settings.currency}
              ocrApiUrl={settings.ocrApiUrl || ''}
              onCurrencyChange={updateSettings}
              onOcrApiUrlChange={updateOcrApiUrl}
              onClearAllData={clearAllData}
              onExportExcel={exportToExcel}
              onExportCSV={exportToCSV}
              onImportExcel={importFromExcel}
              onImportCSV={importFromCSV}
              onClose={closeSettings}
            />
        </View>
      </Animated.View>
      </View>

      {/* Modals */}
      <TransactionModal
        visible={showModal}
        formData={formData}
        accounts={accounts}
        ocrApiUrl={settings.ocrApiUrl}
        onClose={() => setShowModal(false)}
        onSave={addTransaction}
        onFormChange={setFormData}
      />

      <EditAccountModal
        visible={showEditAccountModal}
        account={editingAccount}
        onClose={() => setShowEditAccountModal(false)}
        onSave={updateAccount}
        onDelete={deleteAccount}
      />

      <AccountModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSave={addAccount}
      />

      <StockModal
        visible={showStockModal}
        stock={editingStock}
        onClose={() => setShowStockModal(false)}
        onSave={saveStock}
        onDelete={deleteStock}
      />

      {showWelcome && (
        <WelcomeScreen onClose={hideWelcomeScreen} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#111827',
    overflow: 'hidden'
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#111827'
  },
  headerContent: {
    width: '100%'
  },
  headerTitle: {
    fontSize: 56,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'StackSansNotch-SemiBold',
    marginBottom: 12
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
    width: '100%'
  },
  screensContainer: {
    flexDirection: 'row',
    flex: 1
  },
  screen: {
    flex: 1
  },
  navigationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  navDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6'
  },
  navText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3
  },
  navTextInactive: {
    fontSize: 22,
    color: '#9CA3AF'
  }
});

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
