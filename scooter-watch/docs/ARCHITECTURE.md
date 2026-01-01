# ScooterWatch - Архитектура проекта

## Обзор

ScooterWatch использует **Feature-Based Architecture** для организации кода.

```
┌─────────────────────────────────────────────────────────┐
│                    ScooterWatch App                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Features   │  │    Shared    │  │   App Pages  │  │
│  │              │  │              │  │              │  │
│  │  - auth      │  │  - ui        │  │  - /         │  │
│  │  - reports   │  │  - lib       │  │  - /auth     │  │
│  │  - recording │  │  - types     │  │  - /record   │  │
│  │  - wallet    │  │  - hooks     │  │  - /history  │  │
│  │  - classify  │  │  - constants │  │  - /wallet   │  │
│  │  - landing   │  │  - components│  │  - /case/:id │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │         │
│         └──────────────────┴──────────────────┘         │
│                            │                            │
├────────────────────────────┼────────────────────────────┤
│                       Database (Prisma)                 │
│  User │ Report │ Evidence │ Reward │ Wallet             │
└─────────────────────────────────────────────────────────┘
```

## Feature-Based Architecture

### Принципы

1. **Изоляция**: Каждая фича независима
2. **Инкапсуляция**: Внутренние детали скрыты
3. **Переиспользование**: Общий код в `shared/`
4. **Масштабируемость**: Легко добавлять новые фичи

### Структура

```
scooter-watch/
│
├── features/              # Бизнес-логика
│   ├── auth/             # Фича: Аутентификация
│   │   ├── api/         # API endpoints
│   │   ├── components/  # UI компоненты
│   │   ├── hooks/       # React хуки
│   │   ├── types/       # TypeScript типы
│   │   ├── utils/       # Утилиты
│   │   ├── constants.ts # Константы
│   │   ├── config.ts    # Конфигурация
│   │   └── index.ts     # Public API
│   │
│   ├── reports/         # Фича: Отчёты
│   ├── recording/       # Фича: Запись медиа
│   ├── classification/  # Фича: AI классификация
│   ├── wallet/          # Фича: Кошелёк
│   ├── landing/         # Фича: Лендинг
│   └── index.ts         # Центральный экспорт
│
├── shared/              # Общий код
│   ├── ui/             # UI компоненты (Button, Card...)
│   ├── lib/            # Утилиты (api, prisma, auth...)
│   ├── types/          # Общие типы
│   ├── hooks/          # Общие хуки
│   ├── constants/      # Глобальные константы
│   └── components/     # Layout, навигация
│
├── app/                # Next.js App Router
│   ├── page.tsx       # Главная (/)
│   ├── auth/          # Авторизация (/auth)
│   ├── record/        # Запись (/record)
│   ├── history/       # История (/history)
│   ├── wallet/        # Кошелёк (/wallet)
│   └── case/[id]/     # Детали кейса
│
├── prisma/            # База данных
│   ├── schema.prisma  # Схема
│   └── seed.ts        # Тестовые данные
│
└── docs/              # Документация
    ├── FEATURES.md
    ├── FEATURE_MIGRATION_GUIDE.md
    ├── QUICK_REFERENCE.md
    └── ARCHITECTURE.md (этот файл)
```

## Слои приложения

### 1. Presentation Layer (UI)

**Ответственность**: Отображение и взаимодействие

**Компоненты**:
- `app/*` - Next.js страницы
- `features/*/components/*` - Специфичные UI
- `shared/ui/*` - Общие UI компоненты

**Правила**:
- Компоненты получают данные через хуки
- Не содержат бизнес-логику
- Используют константы для текстов

```typescript
// app/history/page.tsx
import { useReports, ReportList } from '@/features/reports'

export default function HistoryPage() {
  const { reports, loading } = useReports()
  return <ReportList reports={reports} loading={loading} />
}
```

### 2. Business Logic Layer

**Ответственность**: Бизнес-логика и состояние

**Компоненты**:
- `features/*/hooks/*` - React хуки с логикой
- `features/*/utils/*` - Вспомогательные функции

**Правила**:
- Хуки управляют состоянием
- Валидация данных
- Вызовы API

```typescript
// features/reports/hooks/useReports.ts
export function useReports() {
  const [reports, setReports] = useState<Report[]>([])

  const fetchReports = async () => {
    const data = await api.get('/api/reports')
    setReports(data)
  }

  return { reports, fetchReports }
}
```

### 3. Data Access Layer

**Ответственность**: Работа с данными

**Компоненты**:
- `features/*/api/*` - API endpoints
- `shared/lib/prisma.ts` - Database client
- `shared/lib/api-client.ts` - HTTP client

**Правила**:
- API routes используют Prisma
- Аутентификация обязательна
- Валидация входных данных

```typescript
// features/reports/api/route.ts
export async function GET(request: NextRequest) {
  const userId = await requireUserId(request)
  const reports = await prisma.report.findMany({
    where: { userId }
  })
  return NextResponse.json({ data: reports })
}
```

### 4. Database Layer

**Ответственность**: Хранение данных

**Компоненты**:
- Prisma ORM
- PostgreSQL database

**Модели**:
- User, Report, Evidence, Reward, Wallet

## Data Flow

### Создание отчёта

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Page   │───▶│   Hook   │───▶│   API    │───▶│ Database │
│          │    │          │    │          │    │          │
│ /record  │    │useRecord │    │POST /api │    │ Prisma   │
└──────────┘    └──────────┘    │/reports  │    └──────────┘
                                 └──────────┘
     │               │                │              │
     │               │                │              │
     ▼               ▼                ▼              ▼
  Render        Manage State    Process Data    Save Data
```

1. **User Action**: Пользователь нажимает "Отправить"
2. **Hook**: `useRecord` вызывает `createReport()`
3. **API Call**: HTTP POST на `/api/reports`
4. **Authentication**: `requireUserId()` проверяет токен
5. **Validation**: Проверка данных
6. **Database**: Prisma создаёт запись
7. **Response**: Возврат данных
8. **State Update**: Хук обновляет состояние
9. **Re-render**: Страница обновляется

## Feature Communication

### ❌ Плохо: Прямые зависимости

```
┌──────────┐
│  Reports │────┐
└──────────┘    │
                ▼
            ┌──────────┐
            │   Auth   │
            └──────────┘
```

Фичи не должны зависеть друг от друга!

### ✅ Хорошо: Через Shared

```
┌──────────┐         ┌──────────┐
│  Reports │────────▶│  Shared  │◀────────│   Auth   │
└──────────┘         │   /lib   │         └──────────┘
                     └──────────┘
```

Общая логика в `shared/lib/auth.ts`:
```typescript
export const requireAuth = () => { ... }
```

Используется в обеих фичах:
```typescript
import { requireAuth } from '@/shared/lib'
```

## API Architecture

### RESTful Endpoints

```
┌─────────────────────────────────────────────────────┐
│                    API Routes                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  /api/auth/otp-request        POST  Request OTP     │
│  /api/auth/otp-verify         POST  Verify OTP      │
│                                                      │
│  /api/reports                 GET   List reports    │
│  /api/reports                 POST  Create report   │
│  /api/reports/[id]            GET   Get report      │
│  /api/reports/classify        POST  AI classify     │
│                                                      │
│  /api/wallet                  GET   Get wallet      │
│  /api/wallet/withdraw         POST  Withdraw        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Request/Response Flow

```
Client                    API Route               Database
  │                          │                        │
  ├──POST /api/reports───────▶│                        │
  │  + Bearer Token           │                        │
  │                           ├─requireUserId()        │
  │                           │                        │
  │                           ├─validate(data)         │
  │                           │                        │
  │                           ├─prisma.create()───────▶│
  │                           │                        │
  │                           │◀──────report───────────┤
  │                           │                        │
  │◀──{success:true,data}─────┤                        │
  │                           │                        │
```

## Authentication Flow

```
┌────────┐                                    ┌────────┐
│ Client │                                    │ Server │
└───┬────┘                                    └───┬────┘
    │                                             │
    ├─POST /api/auth/otp-request {phone}─────────▶│
    │                                             │
    │                                          Generate
    │                                          OTP: 1234
    │                                             │
    │◀──────{success: true}────────────────────────┤
    │                                             │
    │                                             │
    ├─POST /api/auth/otp-verify {phone,code}─────▶│
    │                                             │
    │                                          Verify
    │                                          OTP
    │                                             │
    │                                          Create/
    │                                          Find User
    │                                             │
    │◀──────{token, user}──────────────────────────┤
    │                                             │
    │                                             │
Store token                                      │
in localStorage                                  │
    │                                             │
    │                                             │
    ├─GET /api/reports                           │
    │  + Bearer: {token}──────────────────────────▶│
    │                                             │
    │                                          Extract
    │                                          userId
    │                                             │
    │◀──────{reports}──────────────────────────────┤
    │                                             │
```

## Database Schema

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │       │  Report  │       │ Evidence │
├──────────┤       ├──────────┤       ├──────────┤
│ id       │───┐   │ id       │───┐   │ id       │
│ phone    │   │   │ userId   │   └──▶│ reportId │
│ name     │   └──▶│ type     │       │ type     │
└──────────┘       │ status   │       │ url      │
     │             │ lat/lng  │       └──────────┘
     │             └──────────┘
     │                  │
     │                  │
     ▼                  ▼
┌──────────┐       ┌──────────┐
│  Wallet  │       │  Reward  │
├──────────┤       ├──────────┤
│ id       │       │ id       │
│ userId   │       │ userId   │
│ balance  │       │ reportId │
└──────────┘       │ amount   │
                   │ status   │
                   └──────────┘
```

## Deployment Architecture

### Development

```
┌─────────────────────────────────────┐
│      Next.js Dev Server (3000)      │
│  ┌─────────────────────────────┐   │
│  │  Frontend (React/Next.js)    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Backend (API Routes)        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │  PostgreSQL      │
    │  (Local/Render)  │
    └──────────────────┘
```

### Production

```
┌───────────────────┐         ┌───────────────────┐
│  GitHub Pages     │         │  API Server       │
│  (Static Site)    │────────▶│  (Render/Vercel)  │
└───────────────────┘         └───────────────────┘
                                      │
                                      ▼
                              ┌───────────────────┐
                              │  PostgreSQL       │
                              │  (Render)         │
                              └───────────────────┘
```

## Scalability

### Добавление новой фичи

1. Создай директорию `features/new-feature/`
2. Добавь стандартную структуру
3. Напиши код фичи
4. Экспортируй через `index.ts`
5. Добавь в `features/index.ts`
6. Используй в страницах

**Преимущества**:
- Не затрагиваешь другие фичи
- Нет конфликтов
- Легко тестировать изолированно

### Удаление фичи

1. Удали `features/feature-name/`
2. Удали экспорт из `features/index.ts`
3. Удали использования в страницах
4. Готово!

## Best Practices

### 1. Изоляция фич
```typescript
// ✅ Хорошо
features/
├── auth/      # Независима
├── reports/   # Независима
└── wallet/    # Независима

// ❌ Плохо
features/
├── auth/
│   └── utils/userHelpers.ts  # Используется в reports
└── reports/
    └── components/UserCard.tsx  # Использует auth
```

### 2. Общий код в shared
```typescript
// ✅ Хорошо
shared/lib/formatters.ts  # Используется везде

// ❌ Плохо
features/reports/utils/formatters.ts  # Дублируется
features/wallet/utils/formatters.ts
```

### 3. Константы, не hardcode
```typescript
// ✅ Хорошо
import { REPORT_CONSTANTS } from '@/features/reports'
const status = REPORT_CONSTANTS.STATUSES.SUBMITTED

// ❌ Плохо
const status = 'submitted'
```

### 4. Типизация всего
```typescript
// ✅ Хорошо
import type { Report } from '@/features/reports'
const report: Report = { ... }

// ❌ Плохо
const report: any = { ... }
```

## Документация

- [`/FEATURES.md`](../FEATURES.md) - Обзор фич
- [`/docs/FEATURE_MIGRATION_GUIDE.md`](./FEATURE_MIGRATION_GUIDE.md) - План миграции
- [`/docs/QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) - Быстрая справка
- [`/features/README.md`](../features/README.md) - Работа с фичами
- [`/shared/README.md`](../shared/README.md) - Общий код

---

**Вопросы?** Обращайся к документации или команде!
