# Shared Directory

Общий код, используемый в нескольких фичах.

## Структура

```
shared/
├── ui/              # Переиспользуемые UI компоненты
├── lib/             # Утилиты и библиотеки
├── types/           # Общие TypeScript типы
├── hooks/           # Общие React хуки
├── constants/       # Глобальные константы
└── components/      # Общие компоненты (layout, навигация)
```

## UI Components (`shared/ui`)

Переиспользуемые UI компоненты на базе Radix UI и Tailwind CSS.

**Доступные компоненты**:
```typescript
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
} from '@/shared/ui'
```

**Пример**:
```typescript
import { Button, Card, CardContent } from '@/shared/ui'

export function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button variant="primary">Click me</Button>
      </CardContent>
    </Card>
  )
}
```

---

## Libraries (`shared/lib`)

Общие утилиты и библиотеки.

**Доступные модули**:
```typescript
import {
  cn,              // Tailwind class merging
  api,             // API client
  prisma,          // Database client
  requireUserId,   // Auth helper
  getAuthToken,    // Auth helper
} from '@/shared/lib'
```

**Примеры**:

### Классы Tailwind
```typescript
import { cn } from '@/shared/lib'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

### API Client
```typescript
import { api } from '@/shared/lib'

const reports = await api.get('/reports')
const report = await api.post('/reports', data)
```

### Database
```typescript
import { prisma } from '@/shared/lib'

const users = await prisma.user.findMany()
```

### Auth Helpers
```typescript
import { requireUserId, getAuthToken } from '@/shared/lib'

// В API route
export async function GET(request: Request) {
  const userId = await requireUserId(request)
  // ...
}

// В клиенте
const token = getAuthToken()
```

---

## Types (`shared/types`)

Общие TypeScript типы, используемые в нескольких фичах.

**Доступные типы**:
```typescript
import type {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  DateRange,
  Coordinates,
  Location,
  Status,
  FileUpload,
  UploadedFile,
} from '@/shared/types'
```

**Примеры**:

### API Response
```typescript
import type { ApiResponse } from '@/shared/types'

const response: ApiResponse<User> = {
  success: true,
  data: user,
}
```

### Pagination
```typescript
import type { PaginationParams, PaginatedResponse } from '@/shared/types'

function getReports(params: PaginationParams): Promise<PaginatedResponse<Report>> {
  // ...
}
```

### Location
```typescript
import type { Coordinates, Location } from '@/shared/types'

const coords: Coordinates = { latitude: 55.7558, longitude: 37.6173 }
const location: Location = {
  coordinates: coords,
  city: 'Москва',
  country: 'Россия',
}
```

---

## Hooks (`shared/hooks`)

Общие React хуки (планируется).

**Примеры будущих хуков**:
- `useDebounce` - Debounce values
- `useLocalStorage` - LocalStorage sync
- `useMediaQuery` - Responsive breakpoints
- `useOnClickOutside` - Click outside detection

---

## Constants (`shared/constants`)

Глобальные константы приложения.

**Использование**:
```typescript
import { APP_CONSTANTS, ENV } from '@/shared/constants'

// Информация о приложении
console.log(APP_CONSTANTS.APP.NAME) // 'ScooterWatch'

// Маршруты
const loginUrl = APP_CONSTANTS.ROUTES.AUTH // '/auth'

// API
const apiUrl = APP_CONSTANTS.API.BASE_URL

// Environment
if (ENV.isDevelopment) {
  // dev-only code
}
```

---

## Components (`shared/components`)

Общие компоненты приложения (layout, навигация и т.д.).

**Будущие компоненты**:
```typescript
import {
  BottomNav,
  Header,
  Layout,
  ErrorBoundary,
} from '@/shared/components'
```

---

## Когда добавлять в Shared?

### ✅ Добавляй в shared если:

1. **Компонент используется в 2+ фичах**
   ```typescript
   // Button используется везде → shared/ui/Button
   ```

2. **Утилита не специфична для фичи**
   ```typescript
   // formatDate - общая → shared/lib/formatters
   ```

3. **Тип используется в нескольких фичах**
   ```typescript
   // ApiResponse<T> - везде → shared/types
   ```

4. **Константа глобальная**
   ```typescript
   // API_BASE_URL - глобально → shared/constants
   ```

### ❌ НЕ добавляй в shared если:

1. **Компонент специфичен для фичи**
   ```typescript
   // ReportCard - только reports → features/reports/components
   ```

2. **Утилита используется только в одной фиче**
   ```typescript
   // getReportStatus - только reports → features/reports/utils
   ```

3. **Тип специфичен для фичи**
   ```typescript
   // Report - только reports → features/reports/types
   ```

---

## Правила

### ✅ DO:

```typescript
// 1. Импортируй из shared
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib'
import type { ApiResponse } from '@/shared/types'

// 2. Экспортируй через barrel exports
// shared/ui/index.ts
export { Button } from './button'
export { Card } from './card'

// 3. Документируй сложные утилиты
/**
 * Merges Tailwind CSS classes
 * @param inputs - Class names to merge
 */
export function cn(...inputs: ClassValue[]) { ... }
```

### ❌ DON'T:

```typescript
// 1. НЕ импортируй напрямую
import { Button } from '@/shared/ui/button' // ❌
import { Button } from '@/shared/ui'        // ✅

// 2. НЕ создавай зависимости от фич
// В shared/lib/utils.ts
import { useAuth } from '@/features/auth' // ❌

// 3. НЕ дублируй код
// Если компонент нужен в 2+ местах - вынеси в shared
```

---

## Миграция в Shared

При переносе кода в shared:

1. Убедись, что код используется в 2+ местах
2. Переименуй файл если нужно (более общее название)
3. Обнови импорты везде
4. Добавь в barrel export
5. Напиши документацию

**Пример**:
```bash
# Было
features/reports/utils/formatDate.ts
features/wallet/utils/formatDate.ts

# Стало
shared/lib/formatters.ts  # Объединили

# Обновили импорты
import { formatDate } from '@/shared/lib'
```

---

## Вопросы?

Смотри `/FEATURES.md` или спрашивай в команде!
