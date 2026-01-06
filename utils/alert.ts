import { Alert as RNAlert, Platform } from 'react-native';

/**
 * Cross-platform alert utility
 * Uses native Alert on mobile and browser dialogs on web
 */
export const Alert = {
  alert: (title: string, message?: string, buttons?: any[]) => {
    if (Platform.OS === 'web') {
      // En web, usar window.alert
      const fullMessage = message ? `${title}\n\n${message}` : title;
      
      // Usar setTimeout para evitar bloqueos y problemas con el event loop
      setTimeout(() => {
        window.alert(fullMessage);
        // Ejecutar el callback del primer botón si existe
        if (buttons && buttons.length > 0 && buttons[0].onPress) {
          try {
            buttons[0].onPress();
          } catch (error) {
            console.error('Error executing alert callback:', error);
          }
        }
      }, 0);
    } else {
      // En móvil, usar Alert nativo
      RNAlert.alert(title, message, buttons);
    }
  }
};

/**
 * Cross-platform confirm dialog
 * Returns true if user confirms, false otherwise
 */
export const confirm = (title: string, message: string): boolean => {
  if (Platform.OS === 'web') {
    const fullMessage = `${title}\n\n${message}`;
    return window.confirm(fullMessage);
  }
  // En móvil, no se puede usar de forma síncrona, devuelve false
  return false;
};

/**
 * Cross-platform confirm with callbacks
 * Works on both web and mobile
 */
export const confirmAsync = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  if (Platform.OS === 'web') {
    const fullMessage = `${title}\n\n${message}`;
    
    // Usar setTimeout para evitar bloqueos
    setTimeout(() => {
      try {
        if (window.confirm(fullMessage)) {
          onConfirm();
        } else if (onCancel) {
          onCancel();
        }
      } catch (error) {
        console.error('Error executing confirm callback:', error);
      }
    }, 0);
  } else {
    RNAlert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel', onPress: onCancel },
      { text: 'OK', onPress: onConfirm }
    ]);
  }
};
