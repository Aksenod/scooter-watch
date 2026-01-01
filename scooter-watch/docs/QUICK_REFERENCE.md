# Quick Reference - Feature-Based Architecture

Быстрая шпаргалка для работы с feature-based архитектурой.

## Импорты

### ✅ Правильные импорты

```typescript
// Фичи
import { useAuth } from '@/features/auth'
import { ReportCard, useReports } from '@/features/reports'
import { WalletBalance } from '@/features/wallet'

// Shared UI
import { Button, Card, Badge } from '@/shared/ui'

// Shared Utils
import { cn, api, prisma } from '@/shared/lib'

// Shared Types
import type { ApiResponse, Coordinates } from '@/shared/types'

// Shared Constants
import { APP_CONSTANTS } from '@/shared/constants'
```

### ❌ Неправильные импорты

```typescript
// НЕ импортируй напрямую из внутренних модулей
import { useAuth } from '@/features/auth/hooks/useAuth' // ❌
import { Button } from '@/shared/ui/button' // ❌

// НЕ импортируй фичи друг из друга
// В features/reports/hooks/useReports.ts:
import { useAuth } from '@/features/auth' // ❌
```

---

## Структура фичи

```
features/my-feature/
├── api/                    # API endpoints
│   └── route.ts           # Next.js API route
├── components/            # UI компоненты
│   ├── MyComponent.tsx
│   └── AnotherComponent.tsx
├── hooks/                 # React хуки
│   └── useMyFeature.ts
├── types/                 # TypeScript типы
│   └── index.ts
├── utils/                 # Утилиты
│   └── helpers.ts
├── constants.ts           # Константы
├── config.ts              # Конфигурация (опционально)
└── index.ts               # Barrel export (обязательно!)
```

---

## Barrel Export Template

```typescript
// features/my-feature/index.ts

/**
 * My Feature - Public API
 */

// Components
export { MyComponent } from './components/MyComponent'
export { AnotherComponent } from './components/AnotherComponent'

// Hooks
export { useMyFeature } from './hooks/useMyFeature'

// Types
export type { MyType, AnotherType } from './types'

// Constants
export { MY_FEATURE_CONSTANTS } from './constants'

// Utils (только если нужны снаружи!)
export { publicHelper } from './utils/helpers'
```

---

## Constants Template

```typescript
// features/my-feature/constants.ts

export const MY_FEATURE_CONSTANTS = {
  // Статусы, типы и т.д.
  STATUSES: {
    PENDING: 'pending',
    ACTIVE: 'active',
    COMPLETED: 'completed',
  } as const,

  // Лейблы
  STATUS_LABELS: {
    pending: 'В ожидании',
    active: 'Активно',
    completed: 'Завершено',
  } as const,

  // Настройки
  CONFIG: {
    MAX_ITEMS: 100,
    TIMEOUT: 5000,
  },

  // Routes
  ROUTES: {
    LIST: '/my-feature',
    DETAIL: '/my-feature/:id',
  },

  // Сообщения
  MESSAGES: {
    SUCCESS: 'Операция выполнена',
    ERROR: 'Произошла ошибка',
  } as const,
} as const
```

---

## Config Template

```typescript
// features/my-feature/config.ts

export const myFeatureConfig = {
  // API endpoints
  endpoints: {
    list: '/api/my-feature',
    create: '/api/my-feature/create',
  },

  // Feature flags
  features: {
    enableBeta: process.env.NEXT_PUBLIC_BETA === 'true',
    enableAnalytics: true,
  },

  // External services
  services: {
    apiKey: process.env.MY_FEATURE_API_KEY,
    endpoint: process.env.MY_FEATURE_ENDPOINT,
  },
} as const
```

---

## Использование констант

```typescript
// ✅ Правильно
import { REPORT_CONSTANTS } from '@/features/reports'

const status = REPORT_CONSTANTS.STATUSES.SUBMITTED
const label = REPORT_CONSTANTS.STATUS_LABELS[status]

// ❌ Неправильно
const status = 'submitted' // Hardcoded
```

---

## Создание API Route в фиче

```typescript
// features/my-feature/api/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { requireUserId } from '@/shared/lib'
import { prisma } from '@/shared/lib'
import { MY_FEATURE_CONSTANTS } from '../constants'

export async function GET(request: NextRequest) {
  try {
    // Требуем аутентификацию
    const userId = await requireUserId(request)

    // Бизнес-логика
    const items = await prisma.myFeatureItem.findMany({
      where: { userId },
      take: MY_FEATURE_CONSTANTS.CONFIG.MAX_ITEMS,
    })

    return NextResponse.json({
      success: true,
      data: items,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId(request)
    const body = await request.json()

    // Валидация
    // ...

    // Создание
    const item = await prisma.myFeatureItem.create({
      data: {
        userId,
        ...body,
      },
    })

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}
```

---

## Создание хука

```typescript
// features/my-feature/hooks/useMyFeature.ts

import { useState, useEffect } from 'react'
import { api } from '@/shared/lib'
import type { MyType } from '../types'
import { MY_FEATURE_CONSTANTS } from '../constants'

export function useMyFeature() {
  const [items, setItems] = useState<MyType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await api.get(MY_FEATURE_CONSTANTS.ROUTES.LIST)
      setItems(response.data)
      setError(null)
    } catch (err) {
      setError(MY_FEATURE_CONSTANTS.MESSAGES.ERROR)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const createItem = async (data: Partial<MyType>) => {
    try {
      const response = await api.post(
        MY_FEATURE_CONSTANTS.ROUTES.LIST,
        data
      )
      setItems(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      throw new Error(MY_FEATURE_CONSTANTS.MESSAGES.ERROR)
    }
  }

  return {
    items,
    loading,
    error,
    createItem,
    refresh: fetchItems,
  }
}
```

---

## Использование фичи в странице

```typescript
// app/my-feature/page.tsx

import { useMyFeature, MyComponent } from '@/features/my-feature'
import { Button } from '@/shared/ui'

export default function MyFeaturePage() {
  const { items, loading, createItem } = useMyFeature()

  if (loading) return <div>Загрузка...</div>

  return (
    <div>
      <h1>My Feature</h1>
      <Button onClick={() => createItem({ name: 'New Item' })}>
        Создать
      </Button>
      {items.map(item => (
        <MyComponent key={item.id} item={item} />
      ))}
    </div>
  )
}
```

---

## Работа с типами

```typescript
// features/my-feature/types/index.ts

export type MyType = {
  id: string
  name: string
  status: 'pending' | 'active' | 'completed'
  createdAt: Date
}

export type CreateMyTypeInput = Omit<MyType, 'id' | 'createdAt'>

export type UpdateMyTypeInput = Partial<CreateMyTypeInput>

// Использование
import type { MyType, CreateMyTypeInput } from '@/features/my-feature'

const item: MyType = { ... }
const input: CreateMyTypeInput = { name: 'Test', status: 'pending' }
```

---

## Добавление новой фичи

```bash
# 1. Создай структуру
mkdir -p features/new-feature/{api,components,hooks,types,utils}

# 2. Создай файлы
touch features/new-feature/index.ts
touch features/new-feature/constants.ts
touch features/new-feature/config.ts
touch features/new-feature/types/index.ts

# 3. Напиши код

# 4. Добавь в центральный экспорт
# features/index.ts
export * from './new-feature'

# 5. Используй!
import { useNewFeature } from '@/features/new-feature'
```

---

## Вынос кода в Shared

### Когда выносить?

- Код используется в **2+ фичах**
- Компонент/утилита **не специфична** для фичи
- Это **общая** бизнес-логика

### Как выносить?

```bash
# 1. Переместить файл
mv features/reports/utils/formatDate.ts shared/lib/formatters.ts

# 2. Обновить barrel export
# shared/lib/index.ts
export { formatDate } from './formatters'

# 3. Обновить все импорты
# Было:
import { formatDate } from '@/features/reports'
# Стало:
import { formatDate } from '@/shared/lib'
```

---

## Чек-лист для PR

- [ ] Код организован по фичам
- [ ] Barrel exports настроены
- [ ] Нет прямых импортов внутренних модулей
- [ ] Нет циклических зависимостей
- [ ] Константы вынесены в `constants.ts`
- [ ] Типы экспортируются из фичи
- [ ] Общий код в `shared/`
- [ ] TypeScript проходит без ошибок
- [ ] ESLint правила соблюдены

---

## Полезные команды

```bash
# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Найти неправильные импорты
grep -r "from '@/features/.*/.*/.*/'" --include="*.ts" --include="*.tsx"

# Структура фичи
tree features/my-feature
```

---

## Паттерны и anti-паттерны

### ✅ Хорошие паттерны

```typescript
// 1. Используй константы
import { REPORT_CONSTANTS } from '@/features/reports'
const status = REPORT_CONSTANTS.STATUSES.SUBMITTED

// 2. Типизируй всё
import type { Report } from '@/features/reports'
const report: Report = { ... }

// 3. Общий код в shared
import { formatDate } from '@/shared/lib'

// 4. Feature flags
import { authConfig } from '@/features/auth'
if (authConfig.features.mockOtp) { ... }
```

### ❌ Anti-паттерны

```typescript
// 1. Hardcoded values
const status = 'submitted' // ❌

// 2. Any types
const data: any = ... // ❌

// 3. Фичи зависят друг от друга
// В features/reports:
import { useAuth } from '@/features/auth' // ❌

// 4. Дублирование кода
// Один и тот же код в 2+ фичах // ❌
```

---

## Связь с командой

- Вопросы по архитектуре? → `/FEATURES.md`
- Миграция кода? → `/docs/FEATURE_MIGRATION_GUIDE.md`
- Как использовать фичу? → `/features/README.md`
- Общий код? → `/shared/README.md`

Удачной разработки! 🚀
