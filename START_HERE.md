# 🚀 НАЧНИ ЗДЕСЬ!

## Что было сделано?

Проект переведён на **feature-based архитектуру** - современный подход к организации кода.

## Зачем это нужно?

✅ **Проще навигация** - вся логика фичи в одном месте
✅ **Нет hardcoded** - константы вместо "магических строк"
✅ **Типизация** - TypeScript подсказывает всё
✅ **Переиспользование** - общий код в `shared/`
✅ **Легче добавлять** - новые фичи не ломают старые

---

## 📖 Где читать?

### 1️⃣ Для быстрого старта (5 минут)
👉 **[GETTING_STARTED.md](./docs/GETTING_STARTED.md)**

Покажет как:
- Использовать константы
- Добавить типы
- Применить утилиты

### 2️⃣ Для понимания примера (15 минут)
👉 **[TUTORIAL_FIRST_MIGRATION.md](./docs/TUTORIAL_FIRST_MIGRATION.md)**

Покажет миграцию файла:
- ДО: hardcoded, any типы
- ПОСЛЕ: константы, типизация
- Сокращение кода на 40%!

### 3️⃣ Для изучения примеров кода
👉 **[examples/how-to-use-features.md](./examples/how-to-use-features.md)**

10 практических примеров:
- Как использовать каждую фичу
- Правильные импорты
- Best practices

### 4️⃣ Для справки
👉 **[QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)**

Быстрая шпаргалка:
- Импорты
- Константы
- Утилиты
- Типы

---

## 💡 Быстрые примеры

### Было (hardcoded):
```typescript
if (report.status === 'submitted') {
  return <Badge>Отправлено</Badge>
}

const fine = 2000
const reward = fine * 0.2
```

### Стало (через фичи):
```typescript
import { REPORT_CONSTANTS, getStatusLabel, calculateReward } from '@/features/reports'

if (report.status === REPORT_CONSTANTS.STATUSES.SUBMITTED) {
  return <Badge>{getStatusLabel(report.status)}</Badge>
}

const reward = calculateReward('sidewalk') // 400
```

---

## 🎯 Что делать дальше?

### Сегодня (10 минут):
1. Прочитай [GETTING_STARTED.md](./docs/GETTING_STARTED.md)
2. Открой любой файл в `app/`
3. Замени 1-2 hardcoded строки на константы

### Завтра (30 минут):
1. Прочитай [TUTORIAL](./docs/TUTORIAL_FIRST_MIGRATION.md)
2. Мигрируй один файл полностью
3. Проверь что всё работает

### На неделе:
1. Постепенно мигрируй остальные файлы
2. Добавляй типизацию
3. Используй утилиты

---

## 📁 Структура проекта

```
scooter-watch/
├── features/              # 🆕 ФИЧИ
│   ├── auth/             # Аутентификация
│   ├── reports/          # Отчёты (✅ готовы типы и утилиты!)
│   ├── recording/        # Запись
│   ├── classification/   # AI
│   └── wallet/           # Кошелёк
│
├── shared/               # 🆕 ОБЩИЙ КОД
│   ├── ui/              # Button, Card, Badge...
│   ├── lib/             # Утилиты
│   ├── types/           # Типы
│   └── constants/       # Глобальные константы
│
├── app/                 # Страницы (как было)
│
├── docs/                # 🆕 ДОКУМЕНТАЦИЯ
│   ├── GETTING_STARTED.md
│   ├── TUTORIAL_FIRST_MIGRATION.md
│   ├── QUICK_REFERENCE.md
│   └── ARCHITECTURE.md
│
└── examples/            # 🆕 ПРИМЕРЫ
    └── how-to-use-features.md
```

---

## 🔥 Доступные константы

```typescript
// Отчёты
import { REPORT_CONSTANTS } from '@/features/reports'
REPORT_CONSTANTS.STATUSES.SUBMITTED        // 'submitted'
REPORT_CONSTANTS.STATUS_LABELS.submitted   // 'Отправлено'
REPORT_CONSTANTS.FINES.sidewalk            // 2000

// Кошелёк
import { WALLET_CONSTANTS } from '@/features/wallet'
WALLET_CONSTANTS.WITHDRAWAL.MIN_AMOUNT     // 500
WALLET_CONSTANTS.CURRENCY.SYMBOL           // '₽'

// Auth
import { AUTH_CONSTANTS } from '@/features/auth'
AUTH_CONSTANTS.OTP.LENGTH                  // 4
AUTH_CONSTANTS.OTP.MOCK_CODE               // '1234'

// AI
import { CLASSIFICATION_CONSTANTS } from '@/features/classification'
CLASSIFICATION_CONSTANTS.CONFIDENCE_THRESHOLDS.HIGH  // 0.9

// Запись
import { RECORDING_CONSTANTS } from '@/features/recording'
RECORDING_CONSTANTS.CAMERA.MAX_FILE_SIZE   // 10 * 1024 * 1024

// Глобальные
import { APP_CONSTANTS } from '@/shared/constants'
APP_CONSTANTS.APP.NAME                     // 'ScooterWatch'
APP_CONSTANTS.ROUTES.HOME                  // '/'
```

---

## 🛠 Доступные утилиты

```typescript
// Отчёты
import {
  getStatusLabel,       // 'submitted' → 'Отправлено'
  getViolationLabel,    // 'sidewalk' → 'Езда по тротуару'
  calculateReward,      // 'sidewalk' → 400
  formatReportDate,     // Date → '1 января 2024 14:30'
} from '@/features/reports'

// Общие
import { cn } from '@/shared/lib'  // Tailwind class merging
```

---

## 🎓 Доступные типы

```typescript
// Отчёты
import type {
  Report,              // Основной тип отчёта
  ReportStatus,        // 'submitted' | 'underreview' | ...
  ViolationType,       // 'sidewalk' | 'wrongparking' | ...
  CreateReportInput,   // Для создания
  ReportFilters,       // Для фильтрации
} from '@/features/reports'

// Кошелёк
import type {
  Wallet,
  Reward,
  RewardStatus,
} from '@/features/wallet'

// Общие
import type {
  ApiResponse,
  Coordinates,
  Location,
} from '@/shared/types'
```

---

## ✅ Чек-лист

При работе с любым файлом проверь:

- [ ] Нет hardcoded строк (`'submitted'`, `'sidewalk'`)
- [ ] Используются константы из фич
- [ ] Переменные типизированы (не `any`)
- [ ] Импорты через barrel exports (`@/features/reports`, не `@/features/reports/utils/index`)
- [ ] UI компоненты из `@/shared/ui`

---

## 🚨 Частые ошибки

### ❌ Неправильно:
```typescript
// Прямой импорт
import { getStatusLabel } from '@/features/reports/utils'

// Hardcoded
if (status === 'submitted') { ... }

// Any
const report: any = data
```

### ✅ Правильно:
```typescript
// Через barrel export
import { getStatusLabel, REPORT_CONSTANTS } from '@/features/reports'

// Через константу
if (status === REPORT_CONSTANTS.STATUSES.SUBMITTED) { ... }

// Типизировано
import type { Report } from '@/features/reports'
const report: Report = data
```

---

## 🤝 Нужна помощь?

1. **Примеры кода** → [examples/how-to-use-features.md](./examples/how-to-use-features.md)
2. **Быстрый старт** → [GETTING_STARTED.md](./docs/GETTING_STARTED.md)
3. **Туториал** → [TUTORIAL_FIRST_MIGRATION.md](./docs/TUTORIAL_FIRST_MIGRATION.md)
4. **Шпаргалка** → [QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)
5. **Архитектура** → [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 🎉 Готово!

Проект готов к работе с feature-based архитектурой.

**Начни прямо сейчас:**
1. Открой [GETTING_STARTED.md](./docs/GETTING_STARTED.md)
2. Выполни одну задачу (5-10 минут)
3. Увидишь результат!

Удачи! 🚀
