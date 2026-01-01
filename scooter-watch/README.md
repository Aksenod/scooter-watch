# ScooterWatch MVP

AI-powered crowdsourced scooter violation reporting MVP. Users capture violations, AI classifies them, receive 20% reward from fines.

## Быстрый старт

1. Скопируй переменные окружения:

```bash
cp .env.local.example .env.local
```

2. Установи зависимости:

```bash
npm install
```

3. Prisma:

```bash
npx prisma generate
# затем
npx prisma db push
```

4. Запуск:

```bash
npm run dev
```

## Что уже есть (MVP)

- Landing page: `/`
- Auth (mock OTP): `/auth` (код `1234`)
- Record (MediaRecorder + mock upload + mock AI): `/record`
- History (список моков): `/history`
- Wallet (моки): `/wallet`
- Case detail: `/case/[id]`

## Render PostgreSQL

- Создай PostgreSQL на Render
- Скопируй `External Database URL` в `DATABASE_URL` в `.env.local`
- Выполни `npx prisma db push`

---

## 🏗 Feature-Based Architecture

Проект использует feature-based архитектуру для лучшей организации кода.

### Структура

```
scooter-watch/
├── features/           # Бизнес-фичи
│   ├── auth/          # Аутентификация
│   ├── reports/       # Отчёты о нарушениях
│   ├── recording/     # Запись фото/видео
│   ├── classification/# AI классификация
│   └── wallet/        # Кошелёк и награды
│
├── shared/            # Общий код
│   ├── ui/           # UI компоненты
│   ├── lib/          # Утилиты
│   ├── types/        # Типы
│   └── constants/    # Константы
│
└── app/              # Next.js страницы
```

### Использование

```typescript
// Импорты из фич
import { REPORT_CONSTANTS, getStatusLabel } from '@/features/reports'
import type { Report } from '@/features/reports'

// Shared UI
import { Button, Card } from '@/shared/ui'

// Константы вместо hardcoded значений
const status = REPORT_CONSTANTS.STATUSES.SUBMITTED
const label = getStatusLabel(status) // "Отправлено"
```

### 📚 Документация

**Начни здесь:**
- 📘 [FEATURES.md](./FEATURES.md) - Обзор фич и правила
- 🚀 [Getting Started](./docs/GETTING_STARTED.md) - Практический старт за 5 шагов
- 📖 [Tutorial](./docs/TUTORIAL_FIRST_MIGRATION.md) - Первая миграция пошагово

**Справочники:**
- 📗 [Quick Reference](./docs/QUICK_REFERENCE.md) - Быстрая шпаргалка
- 📙 [Architecture](./docs/ARCHITECTURE.md) - Архитектура проекта
- 📕 [Migration Guide](./docs/FEATURE_MIGRATION_GUIDE.md) - План миграции

**Примеры:**
- 💡 [How to Use Features](./examples/how-to-use-features.tsx) - 10 практических примеров

### Быстрые примеры

**Константы:**
```typescript
import { REPORT_CONSTANTS } from '@/features/reports'

// Статусы
REPORT_CONSTANTS.STATUSES.SUBMITTED
REPORT_CONSTANTS.STATUS_LABELS.submitted // "Отправлено"

// Типы нарушений
REPORT_CONSTANTS.VIOLATION_LABELS.sidewalk // "Езда по тротуару"

// Штрафы
REPORT_CONSTANTS.FINES.sidewalk // 2000
```

**Утилиты:**
```typescript
import { getStatusLabel, calculateReward } from '@/features/reports'

const label = getStatusLabel('submitted') // "Отправлено"
const reward = calculateReward('sidewalk') // 400 (20% от 2000)
```

**Типы:**
```typescript
import type { Report, ReportStatus } from '@/features/reports'

const report: Report = { ... }
const status: ReportStatus = 'submitted'
```

---

## 🎯 Доступные фичи

| Фича | Описание | Статус |
|------|----------|--------|
| **auth** | Аутентификация через OTP | ✅ Готово |
| **reports** | Отчёты о нарушениях | ✅ Готово |
| **recording** | Запись фото/видео | ✅ Готово |
| **classification** | AI классификация | ✅ Готово |
| **wallet** | Кошелёк и награды | ✅ Готово |
| **landing** | Главная страница | 🔄 Планируется |

Каждая фича имеет:
- 📁 `api/` - API endpoints
- 🎨 `components/` - UI компоненты
- 🪝 `hooks/` - React хуки
- 📝 `types/` - TypeScript типы
- 🛠 `utils/` - Утилиты
- 📌 `constants.ts` - Константы
- 📤 `index.ts` - Public API

---

## 🚀 Начало работы

### Для новых разработчиков

1. **Прочитай основы:**
   - [FEATURES.md](./FEATURES.md) - 5 минут
   - [Getting Started](./docs/GETTING_STARTED.md) - 10 минут

2. **Изучи пример:**
   - [Tutorial](./docs/TUTORIAL_FIRST_MIGRATION.md) - 15 минут
   - [Examples](./examples/how-to-use-features.tsx) - просмотр кода

3. **Начни кодить:**
   - Используй константы из фич
   - Добавляй типы
   - Следуй [Quick Reference](./docs/QUICK_REFERENCE.md)

### Для добавления фичи

```bash
# 1. Создай структуру
mkdir -p features/new-feature/{api,components,hooks,types,utils}

# 2. Создай файлы
touch features/new-feature/{index.ts,constants.ts,types/index.ts}

# 3. Напиши код

# 4. Экспортируй в features/index.ts
```

Подробнее: [Migration Guide](./docs/FEATURE_MIGRATION_GUIDE.md)

---
