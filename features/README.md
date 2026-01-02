# Features Directory

Эта директория содержит все бизнес-фичи приложения ScooterWatch.

## Структура фичи

Каждая фича имеет стандартную структуру:

```
feature-name/
├── api/              # API endpoints (Next.js route handlers)
├── components/       # React компоненты, специфичные для фичи
├── hooks/           # React хуки
├── types/           # TypeScript типы и интерфейсы
├── utils/           # Вспомогательные функции
├── constants.ts     # Константы фичи
├── config.ts        # Конфигурация (опционально)
└── index.ts         # Barrel export - публичное API фичи
```

## Доступные фичи

### 1. Auth (`features/auth`)
**Описание**: Аутентификация пользователей через OTP

**Экспорты**:
```typescript
import {
  // Components
  AuthForm,

  // Hooks
  useAuth,

  // Types
  User,
  AuthToken,

  // Constants
  AUTH_CONSTANTS,

  // Utils
  getAuthToken,
  setAuthToken,
} from '@/features/auth'
```

**Использование**:
```typescript
const { user, isAuthed, login, logout } = useAuth()
```

---

### 2. Reports (`features/reports`)
**Описание**: Управление отчётами о нарушениях

**Экспорты**:
```typescript
import {
  // Components
  ReportCard,
  ReportList,
  ReportDetails,
  StatusBadge,

  // Hooks
  useReports,
  useReportDetails,

  // Types
  Report,
  ReportStatus,
  ViolationType,

  // Constants
  REPORT_CONSTANTS,

  // Utils
  getStatusLabel,
  getViolationLabel,
} from '@/features/reports'
```

**Использование**:
```typescript
const { reports, loading, createReport } = useReports()
```

---

### 3. Recording (`features/recording`)
**Описание**: Захват и загрузка фото/видео

**Экспорты**:
```typescript
import {
  // Components
  CameraFab,
  PhotoPreview,
  RecordButton,

  // Hooks
  useRecord,
  useMediaCapture,

  // Types
  MediaType,
  RecordingState,

  // Constants
  RECORDING_CONSTANTS,
} from '@/features/recording'
```

**Использование**:
```typescript
const { isRecording, blob, startRecording, stopRecording } = useRecord()
```

---

### 4. Classification (`features/classification`)
**Описание**: AI классификация нарушений

**Экспорты**:
```typescript
import {
  // Components
  ConfidenceBadge,
  ConfidenceMeter,
  ClassificationResult,

  // Hooks
  useClassification,

  // Types
  ClassificationResultType,

  // Constants
  CLASSIFICATION_CONSTANTS,

  // Utils
  getConfidenceColor,
  isHighConfidence,
} from '@/features/classification'
```

**Использование**:
```typescript
const { classify, result, isAnalyzing } = useClassification()
```

---

### 5. Wallet (`features/wallet`)
**Описание**: Управление кошельком и наградами

**Экспорты**:
```typescript
import {
  // Components
  WalletBalance,
  RewardHistory,
  WithdrawButton,
  WalletStats,

  // Hooks
  useWallet,
  useRewards,

  // Types
  Wallet,
  Reward,
  RewardStatus,

  // Constants
  WALLET_CONSTANTS,

  // Utils
  formatCurrency,
  canWithdraw,
} from '@/features/wallet'
```

**Использование**:
```typescript
const { wallet, balance, withdraw } = useWallet()
```

---

### 6. Landing (`features/landing`)
**Описание**: Маркетинговая главная страница

**Экспорты**:
```typescript
import {
  // Components
  Hero,
  Features,
  Stats,
  HowItWorks,
} from '@/features/landing'
```

---

## Правила использования

### ✅ DO:

```typescript
// 1. Импортируй только через barrel exports
import { useAuth } from '@/features/auth'
import { ReportCard } from '@/features/reports'

// 2. Используй константы из фич
import { REPORT_CONSTANTS } from '@/features/reports'
const status = REPORT_CONSTANTS.STATUSES.SUBMITTED

// 3. Используй типы из фич
import type { Report } from '@/features/reports'
const report: Report = { ... }
```

### ❌ DON'T:

```typescript
// 1. НЕ импортируй напрямую из внутренних модулей
import { useAuth } from '@/features/auth/hooks/useAuth' // ❌

// 2. НЕ хардкодь константы
const status = 'submitted' // ❌
// Используй: REPORT_CONSTANTS.STATUSES.SUBMITTED

// 3. НЕ импортируй одну фичу из другой
// Внутри features/reports:
import { useAuth } from '@/features/auth' // ❌
// Вместо этого вынеси общую логику в shared/
```

---

## Создание новой фичи

1. Создай директорию `features/new-feature/`
2. Добавь стандартную структуру:
   ```bash
   mkdir -p features/new-feature/{api,components,hooks,types,utils}
   touch features/new-feature/{index.ts,constants.ts,config.ts}
   ```

3. Напиши код фичи

4. Экспортируй через `index.ts`:
   ```typescript
   // features/new-feature/index.ts
   export { MyComponent } from './components/MyComponent'
   export { useMyFeature } from './hooks/useMyFeature'
   export type { MyType } from './types'
   export { MY_CONSTANTS } from './constants'
   ```

5. Добавь в центральный экспорт:
   ```typescript
   // features/index.ts
   export * from './new-feature'
   ```

6. Обнови документацию

---

## Связь между фичами

Фичи НЕ должны зависеть друг от друга напрямую.

**Если нужна общая логика:**

```typescript
// ❌ Плохо - импорт фичи из фичи
// features/reports/hooks/useReports.ts
import { useAuth } from '@/features/auth'

// ✅ Хорошо - общая логика в shared
// shared/lib/auth.ts
export const requireAuth = () => { ... }

// features/reports/hooks/useReports.ts
import { requireAuth } from '@/shared/lib'
```

---

## Тестирование фич

Каждая фича должна быть тестируема независимо:

```typescript
// features/auth/__tests__/useAuth.test.ts
import { renderHook } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'

describe('useAuth', () => {
  it('should login user', async () => {
    const { result } = renderHook(() => useAuth())
    await result.current.login('+79991234567', '1234')
    expect(result.current.isAuthed).toBe(true)
  })
})
```

---

## Вопросы?

- Смотри `/FEATURES.md` для общего описания
- Смотри `/docs/FEATURE_MIGRATION_GUIDE.md` для плана миграции
- Спрашивай в команде!
