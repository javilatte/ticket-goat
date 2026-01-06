# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.0]: https://github.com/javilatte/ticket-goat-mobile/releases/tag/v1.0.0
