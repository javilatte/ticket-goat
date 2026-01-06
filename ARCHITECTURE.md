# TicketGOAT Mobile - Arquitectura

## Estructura del Proyecto

```
ticket-goat/
├── types/              # Tipos TypeScript centralizados
│   ├── models.ts       # Interfaces de datos (Transaction, Account, Stock, etc.)
│   └── index.ts        # Barrel export
├── contexts/           # React Context para estado global
│   └── AppContext.tsx  # Estado de la aplicación (state + setters)
├── hooks/              # Custom Hooks para lógica de negocio
│   ├── useTransactions.ts  # Lógica de transacciones
│   ├── useAccounts.ts      # Lógica de cuentas
│   ├── useStocks.ts        # Lógica de stocks/acciones
│   ├── useApp.ts           # Lógica general de la app
│   └── index.ts            # Barrel export
├── services/           # Servicios de datos y APIs
│   ├── database.ts     # AsyncStorage & Secure Storage
│   ├── stockApi.ts     # API de precios de stocks
│   └── export.ts       # Exportación a Excel/CSV
├── components/         # Componentes React
│   ├── ui/             # Componentes UI reutilizables
│   │   ├── Button.tsx  # Botón genérico
│   │   ├── Input.tsx   # Input genérico
│   │   ├── Card.tsx    # Card container
│   │   └── index.ts    # Barrel export
│   ├── Dashboard.tsx   # Pantalla principal
│   ├── SettingsScreen.tsx
│   ├── TransactionModal.tsx
│   ├── EditAccountModal.tsx
│   ├── AccountModal.tsx
│   ├── StockModal.tsx
│   ├── StockCard.tsx
│   ├── StockChartModal.tsx
│   ├── WelcomeScreen.tsx
│   ├── TicketScanner.tsx
│   ├── AuthModal.tsx
│   └── BalanceModal.tsx
├── styles/             # Estilos compartidos
│   ├── modal.styles.tsx
│   └── dashboard.styles.tsx
└── App.tsx             # Componente raíz (simplificado)
```

## Principios de Arquitectura

### 1. Separación de Responsabilidades

- **Types**: Define estructuras de datos
- **Context**: Gestiona estado global
- **Hooks**: Contiene lógica de negocio
- **Services**: Maneja persistencia y APIs externas
- **Components**: Solo renderizado y UI

### 2. Flujo de Datos

```
App.tsx (Provider)
    ↓
AppContext (Estado Global)
    ↓
Custom Hooks (Lógica)
    ↓
Services (Datos/APIs)
    ↓
Database/APIs
```

### 3. Uso de Hooks

#### useAppContext()
Accede al estado global desde cualquier componente:
```typescript
const { 
  transactions, 
  accounts, 
  showModal, 
  setShowModal 
} = useAppContext();
```

#### useTransactions()
```typescript
const { 
  addTransaction, 
  deleteTransaction, 
  editTransaction 
} = useTransactions();
```

#### useAccounts()
```typescript
const { 
  addAccount, 
  updateAccount, 
  deleteAccount 
} = useAccounts();
```

#### useStocks()
```typescript
const { 
  saveStock, 
  deleteStock, 
  updateStockPrices 
} = useStocks();
```

#### useApp()
```typescript
const { 
  loadData, 
  exportToExcel, 
  clearAllData 
} = useApp();
```

## Beneficios

### Mantenibilidad
- Código organizado por funcionalidad
- Fácil de encontrar y modificar

### Escalabilidad
- Agregar features sin tocar código existente
- Hooks reutilizables en múltiples componentes

### Testabilidad
- Hooks y servicios testables aisladamente
- Lógica separada de UI

### Legibilidad
- App.tsx reducido de ~700 líneas a ~370
- Cada archivo tiene una responsabilidad clara

### Reutilización
- Componentes UI (Button, Input, Card) compartidos
- Hooks utilizables en cualquier componente



### Agregar nueva funcionalidad:
1. Definir tipos en `types/models.ts`
2. Crear hook específico en `hooks/`
3. Agregar al contexto si es estado global
4. Crear componente UI
5. Usar hook en componente

### Ejemplo - Agregar "Categories":
```typescript
// 1. types/models.ts
export interface Category {
  id: string;
  name: string;
  color: string;
}

// 2. hooks/useCategories.ts
export function useCategories() {
  const { categories, setCategories } = useAppContext();
  const addCategory = async (cat: Category) => { ... };
  return { categories, addCategory };
}

// 3. components/CategoryModal.tsx
function CategoryModal() {
  const { addCategory } = useCategories();
  // UI implementation
}
```


