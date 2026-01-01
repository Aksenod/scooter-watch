# Getting Started - Практическое руководство

## 🚀 Быстрый старт за 5 шагов

### Шаг 1: Проверь установку

```bash
# Убедись что TypeScript видит новые path aliases
npx tsc --showConfig | grep -A 10 "paths"

# Должны быть:
# "@/features": ["./features"]
# "@/shared": ["./shared"]
```

### Шаг 2: Используй константы прямо сейчас

Открой любой файл где есть hardcoded значения и замени их:

**Пример - app/history/page.tsx:**

```typescript
// ❌ Было
if (report.status === 'submitted') {
  return <Badge>Отправлено</Badge>
}

// ✅ Стало
import { REPORT_CONSTANTS, getStatusLabel } from '@/features/reports'

if (report.status === REPORT_CONSTANTS.STATUSES.SUBMITTED) {
  return <Badge>{getStatusLabel(report.status)}</Badge>
}
```

### Шаг 3: Добавь типы

```typescript
// ❌ Было
const report: any = { ... }

// ✅ Стало
import type { Report } from '@/features/reports'

const report: Report = { ... }
```

### Шаг 4: Используй утилиты

```typescript
import {
  getStatusLabel,
  getViolationLabel,
  calculateReward
} from '@/features/reports'

// Автоматический перевод
const statusLabel = getStatusLabel('submitted') // "Отправлено"
const violationLabel = getViolationLabel('sidewalk') // "Езда по тротуару"

// Расчёт награды
const reward = calculateReward('sidewalk') // 400 (20% от 2000)
```

### Шаг 5: Проверь работу

```bash
# Запусти TypeScript проверку
npm run build

# Если ошибок нет - всё работает!
```

---

## 📝 Практические задачи

### Задача 1: Замени hardcoded статусы (5 мин)

**Файл:** `app/history/page.tsx`

1. Найди все места где используются строки `'submitted'`, `'underreview'`, etc.
2. Замени на `REPORT_CONSTANTS.STATUSES.SUBMITTED`
3. Импортируй константы: `import { REPORT_CONSTANTS } from '@/features/reports'`

**Пример:**
```typescript
// Было
const filteredReports = reports.filter(r => r.status === 'fineissued')

// Стало
import { REPORT_CONSTANTS } from '@/features/reports'
const filteredReports = reports.filter(
  r => r.status === REPORT_CONSTANTS.STATUSES.FINE_ISSUED
)
```

### Задача 2: Добавь типизацию (10 мин)

**Файл:** `app/history/page.tsx`

1. Импортируй тип: `import type { Report } from '@/features/reports'`
2. Замени `any` на `Report` для всех отчётов
3. Проверь что TypeScript подсказывает поля

**Пример:**
```typescript
// Было
const [reports, setReports] = useState<any[]>([])

// Стало
import type { Report } from '@/features/reports'
const [reports, setReports] = useState<Report[]>([])

// Теперь при написании report. появляется автокомплит!
```

### Задача 3: Используй утилиты для форматирования (10 мин)

**Файл:** `app/case/[id]/page.tsx`

1. Импортируй утилиты
2. Замени ручное форматирование на утилиты

**Пример:**
```typescript
// Было
let statusText = ''
switch(report.status) {
  case 'submitted': statusText = 'Отправлено'; break
  case 'underreview': statusText = 'На проверке'; break
  // ...
}

// Стало
import { getStatusLabel, getViolationLabel } from '@/features/reports'

const statusText = getStatusLabel(report.status)
const violationText = getViolationLabel(report.violationType)
```

### Задача 4: Wallet константы (5 мин)

**Файл:** `app/wallet/page.tsx`

1. Найди минимальную сумму вывода (500)
2. Замени на константу
3. Добавь символ валюты

**Пример:**
```typescript
// Было
if (balance < 500) {
  return <p>Минимум 500 руб.</p>
}

// Стало
import { WALLET_CONSTANTS } from '@/features/wallet'

if (balance < WALLET_CONSTANTS.WITHDRAWAL.MIN_AMOUNT) {
  return (
    <p>
      Минимум {WALLET_CONSTANTS.WITHDRAWAL.MIN_AMOUNT} {WALLET_CONSTANTS.CURRENCY.SYMBOL}
    </p>
  )
}
```

---

## 🎯 Чеклист для каждого файла

Когда редактируешь файл, проверь:

- [ ] Нет hardcoded строк для статусов/типов
- [ ] Используются константы из `@/features/*`
- [ ] Все переменные типизированы (не `any`)
- [ ] Импорты через barrel exports (`@/features/reports`, не `@/features/reports/utils/index`)
- [ ] UI компоненты из `@/shared/ui`

---

## 📂 Где что находится

### Константы

```typescript
// Отчёты
import { REPORT_CONSTANTS } from '@/features/reports'
REPORT_CONSTANTS.STATUSES.SUBMITTED
REPORT_CONSTANTS.STATUS_LABELS.submitted
REPORT_CONSTANTS.VIOLATION_LABELS.sidewalk

// Кошелёк
import { WALLET_CONSTANTS } from '@/features/wallet'
WALLET_CONSTANTS.WITHDRAWAL.MIN_AMOUNT
WALLET_CONSTANTS.CURRENCY.SYMBOL

// Авторизация
import { AUTH_CONSTANTS } from '@/features/auth'
AUTH_CONSTANTS.OTP.LENGTH
AUTH_CONSTANTS.STORAGE_KEYS.TOKEN

// Запись
import { RECORDING_CONSTANTS } from '@/features/recording'
RECORDING_CONSTANTS.CAMERA.MAX_FILE_SIZE
RECORDING_CONSTANTS.MESSAGES.UPLOAD_SUCCESS

// AI
import { CLASSIFICATION_CONSTANTS } from '@/features/classification'
CLASSIFICATION_CONSTANTS.CONFIDENCE_THRESHOLDS.HIGH

// Глобальные
import { APP_CONSTANTS } from '@/shared/constants'
APP_CONSTANTS.APP.NAME
APP_CONSTANTS.ROUTES.HOME
```

### Типы

```typescript
// Отчёты
import type { Report, ReportStatus, ViolationType } from '@/features/reports'

// Кошелёк
import type { Wallet, Reward, RewardStatus } from '@/features/wallet'

// Пользователь (пока в старом месте)
import type { User } from '@/types/user'

// Общие типы
import type { ApiResponse, Coordinates } from '@/shared/types'
```

### Утилиты

```typescript
// Форматирование отчётов
import {
  getStatusLabel,
  getViolationLabel,
  calculateReward
} from '@/features/reports'

// UI компоненты
import { Button, Card, Badge } from '@/shared/ui'

// Общие утилиты
import { cn } from '@/shared/lib'
```

---

## 🔥 Частые ошибки

### ❌ Ошибка 1: Прямой импорт

```typescript
// Неправильно
import { getStatusLabel } from '@/features/reports/utils'

// Правильно
import { getStatusLabel } from '@/features/reports'
```

### ❌ Ошибка 2: Hardcoded значения

```typescript
// Неправильно
if (status === 'submitted') { ... }

// Правильно
import { REPORT_CONSTANTS } from '@/features/reports'
if (status === REPORT_CONSTANTS.STATUSES.SUBMITTED) { ... }
```

### ❌ Ошибка 3: Использование any

```typescript
// Неправильно
const report: any = data

// Правильно
import type { Report } from '@/features/reports'
const report: Report = data
```

### ❌ Ошибка 4: Импорт UI из старого места

```typescript
// Неправильно (старое место)
import { Button } from '@/components/ui/button'

// Правильно (новое место)
import { Button } from '@/shared/ui'
```

---

## 🎓 Следующие шаги

1. **Сегодня:** Замени hardcoded значения на константы
2. **Завтра:** Добавь типизацию
3. **Эта неделя:** Начни миграцию компонентов в фичи

---

## 💡 Советы

- **Начни с малого** - замени константы в одном файле
- **Проверяй TypeScript** - `npm run build` после каждого изменения
- **Используй автокомплит** - IDE теперь подсказывает всё!
- **Смотри примеры** - `/examples/how-to-use-features.tsx`

---

## 📚 Документация

- [FEATURES.md](../FEATURES.md) - Обзор фич
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Быстрая справка
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура
- [examples/how-to-use-features.tsx](../examples/how-to-use-features.tsx) - Примеры кода

---

**Удачи! Начни с малого, и постепенно весь проект станет чище и понятнее!** 🚀
