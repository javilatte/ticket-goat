# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-01-10

### Security
- **Actualizado a SheetJS Community Edition (xlsx@0.20.3)** para solucionar vulnerabilidades de seguridad
  - Solucionado: Prototype Pollution en xlsx@0.18.5
  - Solucionado: Regular Expression Denial of Service (ReDoS) en xlsx@0.18.5
  - Migrado a versión actualizada desde https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
  - Compatible con React Native y Web sin problemas de stack overflow

## [1.1.0] - 2026-01-06

### Security Enhancement - Cifrado por Defecto

#### Added
- **Cifrado AES automático** para todos los datos almacenados
  - Cifrado de transacciones, cuentas, acciones, balances y configuración
  - Claves de cifrado almacenadas de forma segura en SecureStore (Keychain/KeyStore) en móvil
  - AsyncStorage para claves en web (menos seguro pero funcional)
  - Generación de claves usando expo-crypto en móvil, Web Crypto API en navegadores
  - Cifrado/descifrado transparente en todas las operaciones
- **Migración automática** de datos no cifrados a cifrados
  - Se ejecuta automáticamente al iniciar la app usando useRef
  - No requiere intervención del usuario
  - Detecta y migra datos existentes sin cifrar
  - Detecta y elimina datos corruptos automáticamente
  - Solo se ejecuta una vez por sesión
- **Documentación de seguridad** completa (SECURITY.md)
  - Detalles técnicos del cifrado AES + expo-crypto
  - Mejores prácticas de seguridad
  - Limitaciones conocidas
  - Política de reporte de vulnerabilidades
- **expo-crypto** para generación segura de números aleatorios
  - Reemplaza Math.random() con números criptográficamente seguros
  - Override del generador de números aleatorios de CryptoJS
- **Sistema de alertas multiplataforma** (utils/alert.ts)
  - Usa `window.alert` y `window.confirm` en web
  - Usa Alert nativo en móvil
  - Soporte para callbacks asíncronos con setTimeout

#### Changed
- **Settings.encryptionEnabled** ahora siempre es `true`
  - Se mantiene el campo por compatibilidad
  - No se puede deshabilitar el cifrado
- **Exportaciones** mantienen el formato sin cifrar
  - Los archivos Excel/CSV no están cifrados
  - Advertencia visible en la interfaz de usuario
- **clearAllData** ahora elimina TODO
  - Elimina datos de AsyncStorage
  - Elimina la clave de cifrado de SecureStore/AsyncStorage
  - Limpia completamente la cache con AsyncStorage.clear()
  - Regenera nueva clave de cifrado automáticamente
  - Reinicializa la app desde cero
- **README.md** actualizado con información de seguridad
- **SettingsScreen** muestra estado de cifrado y advertencias
  - Mayor espaciado entre advertencia y botones de exportación
  - Información clara sobre cifrado activo

#### Fixed
- **Loop infinito en web** que congelaba la aplicación
  - Removido `loadData` de dependencias del useEffect en App.tsx
  - Aplicación web ahora carga correctamente sin congelarse
- **Bucle infinito** en migración de datos corregido
  - Uso de useRef para ejecutar migración solo una vez
  - loadData() ya no incluye la migración en sus dependencias
- **Error "Native crypto module"** corregido
  - CryptoJS intentaba usar módulo crypto de Node.js no disponible en RN
  - Implementado override con expo-crypto (móvil) y Web Crypto API (web)
- **Error "Malformed UTF-8 data"** corregido
  - Try-catch en todas las funciones de lectura
  - Detecta datos no cifrados y los lee directamente
  - Maneja datos corruptos eliminándolos automáticamente
- **Lógica de actualización de cuentas** mejorada
  - Ahora distingue entre cambios de initialBalance y ajustes manuales
  - No crea transacciones de ajuste innecesarias al cambiar solo el nombre
  - Calcula correctamente cuando cambiar initialBalance vs currentBalance
- **Alertas nativas incompatibles con web**
  - Todos los Alert.alert actualizados para usar sistema multiplataforma
  - Actualizados todos los componentes y hooks para compatibilidad web/móvil
- **CORS bloqueando API de Yahoo Finance en web**
  - Implementado proxy CORS (corsproxy.io) para peticiones web
  - Actualización de precios de acciones funcional en navegador
  - Datos históricos de acciones disponibles en web
- **Reajustes manuales no aparecían inmediatamente**
  - Actualización automática del estado de transacciones después de crear ajuste manual
  - Cambios visibles instantáneamente sin necesidad de recargar
- **ActivityIndicator faltante** en StockModal causaba crash
- **UI del modal de acciones** mejorada
  - Botón "Actualizar precio" ahora tiene la misma altura que el input
  - Mejor alineación y aspecto visual más consistente
- **Configuración EAS Build** corregida
  - Actualizado slug a "ticket-goat-mobile" para coincidir con projectId
  - Añadido campo requerido "appVersionSource": "local" en eas.json
  - Actualizada versión a 1.1.0 en app.json

#### Security
- **AES (Advanced Encryption Standard)** vía CryptoJS
- **Generación segura de claves** (32 bytes/256 bits) usando expo-crypto
- **Keychain** en iOS para proteger claves
- **KeyStore** en Android (API 23+) para proteger claves
- **Cifrado end-to-end local** - datos nunca salen del dispositivo
- **GDPR compliant** - datos permanecen en el dispositivo del usuario
- **Vectores de inicialización (IV)** generados con expo-crypto para cada operación

#### Technical Details
- `Database.getTransactions()` descifra automáticamente con fallback a datos sin cifrar
- `Database.saveAccounts()` cifra automáticamente antes de guardar
- Todas las operaciones CRUD pasan por cifrado/descifrado
- ExportService descifra solo durante exportación
- ImportService cifra datos al importar
- `migrateToEncryption()` valida JSON antes de cifrar
- Eliminación automática de datos corruptos que no son ni JSON ni cifrado válido

#### Dependencies
- **expo-crypto** (^14.0.1) - Generación segura de números aleatorios

#### Notes
**Importante**: 
- Los usuarios existentes experimentarán una migración automática
- Los archivos exportados NO están cifrados (por diseño)
- Mantén backups del dispositivo (desinstalar la app pierde la clave)
- El cifrado no se puede deshabilitar (por seguridad)
- Ver [SECURITY.md](SECURITY.md) para más detalles

## [1.0.0] - 2026-01-05

### Initial Release

#### Added
- **Gestión de Transacciones**
  - Agregar, editar y eliminar transacciones
  - Categorización personalizable
  - Filtros por periodo (mes/nómina)
  - Soporte para múltiples cuentas

- **Portfolio de Acciones**
  - Seguimiento de inversiones
  - Actualización de precios en tiempo real
  - Gráficos de rendimiento
  - Cálculo de ganancias/pérdidas

- **Múltiples Cuentas**
  - Gestión ilimitada de cuentas
  - Colores personalizables
  - Ajuste manual de balances
  - Soporte para IBAN

- **Exportación de Datos**
  - Exportar a Excel (multi-hoja)
  - Exportar a CSV
  - Compartir vía apps nativas

- **OCR de Tickets** (Opcional)
  - Escaneo automático de tickets
  - Extracción de totales
  - Integración con servicio OCR

- **Interfaz de Usuario**
  - Diseño moderno oscuro
  - Animaciones fluidas
  - Navegación por deslizamiento
  - Pantalla de bienvenida personalizada

- **Arquitectura**
  - TypeScript strict mode
  - Context API para estado global
  - Custom hooks para lógica reutilizable
  - Separación de responsabilidades
  - Componentes UI reutilizables

#### Technical
- Expo SDK 54
- React Native 0.81.5
- TypeScript 5.9
- AsyncStorage para persistencia
- Expo Secure Store para datos sensibles

### Security
- Almacenamiento local de datos
- Sin telemetría
- Privacidad por diseño

---

## Formato de Versiones

### [X.Y.Z] - YYYY-MM-DD

#### Added
Para nuevas funcionalidades.

#### Changed
Para cambios en funcionalidades existentes.

#### Deprecated
Para funcionalidades que serán removidas.

#### Removed
Para funcionalidades removidas.

#### Fixed
Para corrección de bugs.

#### Security
Para vulnerabilidades de seguridad.

---

[1.0.0]: https://github.com/javilatte/ticket-goat/releases/tag/v1.0.0
