# Feature-Based Architecture - Migration Guide

## Цель

Перевести проект на feature-based архитектуру для улучшения масштабируемости и поддерживаемости.

## Новая структура

```
scooter-watch/
├── app/                      # Next.js App Router (только страницы)
│   ├── page.tsx
│   ├── auth/
│   ├── record/
│   ├── history/
│   ├── wallet/
│   └── case/[id]/
│
├── features/                 # 🆕 Бизнес-логика по фичам
│   ├── index.ts             # Центральный экспорт
│   ├── auth/                # Фича: Аутентификация
│   │   ├── api/            # API endpoints
│   │   ├── components/     # UI компоненты
│   │   ├── hooks/          # React хуки
│   │   ├── types/          # TypeScript типы
│   │   ├── utils/          # Утилиты
│   │   ├── constants.ts    # Константы
│   │   ├── config.ts       # Конфигурация
│   │   └── index.ts        # Public API
│   │
│   ├── reports/             # Фича: Отчёты
│   ├── recording/           # Фича: Запись
│   ├── classification/      # Фича: AI классификация
│   ├── wallet/              # Фича: Кошелёк
│   └── landing/             # Фича: Лендинг
│
├── shared/                  # 🆕 Общий код
│   ├── ui/                 # UI компоненты (Badge, Button, Card...)
│   ├── lib/                # Утилиты (api-client, prisma, auth...)
│   ├── types/              # Общие типы
│   ├── hooks/              # Общие хуки
│   └── constants/          # Глобальные константы
│
├── prisma/                  # База данных (без изменений)
├── public/                  # Статика (без изменений)
└── docs/                    # Документация
```

## План миграции

### Этап 1: Подготовка (✅ Готово)

- [x] Создать `FEATURES.md` с описанием фич
- [x] Создать структуру `features/`
- [x] Создать barrel exports для каждой фичи
- [x] Создать `constants.ts` и `config.ts` для фич
- [x] Создать `shared/` с общими модулями
- [x] Обновить `tsconfig.json` с path aliases

### Этап 2: Миграция Auth Feature

**Переместить:**
```
hooks/useAuth.ts              → features/auth/hooks/useAuth.ts
types/user.ts                 → features/auth/types/user.ts
lib/auth/session.ts           → features/auth/utils/session.ts
app/api/auth/*                → features/auth/api/*
```

**Создать новые:**
```
features/auth/components/AuthForm.tsx          # Из app/auth/page.tsx
features/auth/components/PhoneInput.tsx
features/auth/components/OTPInput.tsx
features/auth/utils/storage.ts                 # localStorage helpers
features/auth/utils/validation.ts              # Phone validation
```

### Этап 3: Миграция Reports Feature

**Переместить:**
```
types/report.ts               → features/reports/types/report.ts
types/evidence.ts             → features/reports/types/evidence.ts
app/api/reports/*             → features/reports/api/*
```

**Создать новые:**
```
features/reports/components/ReportCard.tsx     # Из app/history
features/reports/components/ReportList.tsx
features/reports/components/ReportDetails.tsx  # Из app/case/[id]
features/reports/components/StatusBadge.tsx
features/reports/hooks/useReports.ts
features/reports/hooks/useReportDetails.ts
features/reports/utils/formatters.ts           # Date, status formatting
```

### Этап 4: Миграция Recording Feature

**Переместить:**
```
hooks/useRecord.ts            → features/recording/hooks/useRecord.ts
components/record/*           → features/recording/components/*
lib/storage/upload.ts         → features/recording/utils/upload.ts
```

**Создать новые:**
```
features/recording/hooks/useMediaCapture.ts
features/recording/types/index.ts
```

### Этап 5: Миграция Classification Feature

**Создать:**
```
features/classification/components/ConfidenceBadge.tsx    # Из components/record
features/classification/components/ConfidenceMeter.tsx
features/classification/components/ClassificationResult.tsx
features/classification/hooks/useClassification.ts
features/classification/utils/confidence.ts
features/classification/api/classify.ts                    # Из lib/ai
```

### Этап 6: Миграция Wallet Feature

**Переместить:**
```
types/wallet.ts               → features/wallet/types/wallet.ts
types/reward.ts               → features/wallet/types/reward.ts
hooks/useWallet.ts            → features/wallet/hooks/useWallet.ts
app/api/wallet/*              → features/wallet/api/*
```

**Создать новые:**
```
features/wallet/components/WalletBalance.tsx   # Из app/wallet
features/wallet/components/RewardHistory.tsx
features/wallet/components/WithdrawButton.tsx
features/wallet/components/WalletStats.tsx
features/wallet/hooks/useRewards.ts
features/wallet/utils/currency.ts
```

### Этап 7: Миграция Shared

**Переместить:**
```
components/ui/*               → shared/ui/*
lib/utils.ts                  → shared/lib/utils.ts
lib/prisma.ts                 → shared/lib/prisma.ts
lib/services/api.ts           → shared/lib/api-client.ts
components/layout/*           → shared/components/layout/*
```

### Этап 8: Обновление импортов

**Старые импорты:**
```typescript
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Report } from '@/types/report'
```

**Новые импорты:**
```typescript
import { useAuth } from '@/features/auth'
import { Button } from '@/shared/ui'
import { Report } from '@/features/reports'
```

### Этап 9: Очистка

- [ ] Удалить старые директории: `/components`, `/hooks`, `/lib`, `/types`
- [ ] Проверить, что все импорты обновлены
- [ ] Запустить TypeScript проверку
- [ ] Запустить тесты (если есть)
- [ ] Обновить документацию

## Правила работы с фичами

### ✅ DO:

1. **Импортируй только через barrel exports**
   ```typescript
   // ✅ Правильно
   import { useAuth, AUTH_CONSTANTS } from '@/features/auth'

   // ❌ Неправильно
   import { useAuth } from '@/features/auth/hooks/useAuth'
   ```

2. **Держи внутренности фичи приватными**
   - Экспортируй только то, что нужно снаружи
   - Внутренние утилиты не экспортируй

3. **Используй constants и config**
   ```typescript
   // ✅ Правильно
   import { AUTH_CONSTANTS } from '@/features/auth'
   const token = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN)

   // ❌ Неправильно
   const token = localStorage.getItem('scooter-watch-token')
   ```

4. **Общий код в shared**
   - UI компоненты → `shared/ui`
   - Утилиты → `shared/lib`
   - Типы → `shared/types`

### ❌ DON'T:

1. **Не импортируй фичи друг из друга напрямую**
   ```typescript
   // ❌ Плохо
   import { useAuth } from '@/features/auth'
   // внутри features/reports/

   // ✅ Хорошо - вынеси общее в shared
   import { requireAuth } from '@/shared/lib'
   ```

2. **Не дублируй код**
   - Если код используется в 2+ фичах → вынеси в `shared`

3. **Не создавай циклические зависимости**
   - Фичи должны быть независимыми

## Преимущества новой структуры

✅ **Понятность**: Вся логика фичи в одном месте
✅ **Масштабируемость**: Легко добавлять новые фичи
✅ **Переиспользование**: Общий код в `shared`
✅ **Изоляция**: Фичи не зависят друг от друга
✅ **Тестирование**: Легко тестировать отдельные фичи
✅ **Onboarding**: Новым разработчикам легче разобраться

## Следующие шаги

1. Начать миграцию с Auth Feature (самая простая)
2. Постепенно мигрировать остальные фичи
3. Обновлять импорты по мере миграции
4. Тестировать после каждого этапа
5. Удалить старую структуру в конце

## Вопросы?

Смотри `FEATURES.md` для общего описания или спрашивай в команде!
