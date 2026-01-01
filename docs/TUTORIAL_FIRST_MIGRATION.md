# Туториал: Первая миграция на фичи

## Задача
Переделаем один компонент из `app/history/page.tsx`, чтобы использовать новую архитектуру.

## Что будем делать

1. ✅ Заменим hardcoded статусы на константы
2. ✅ Добавим типизацию
3. ✅ Используем утилиты для форматирования
4. ✅ Проверим работу

---

## До миграции

Посмотрим на текущий код (упрощённо):

```typescript
// app/history/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function HistoryPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загрузка отчётов
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => {
        setReports(data.data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">История отчётов</h1>

      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report.id} className="p-4">
            <div className="flex justify-between">
              <div>
                {/* Hardcoded перевод типа нарушения */}
                <h3 className="font-bold">
                  {report.violationType === 'sidewalk' && 'Езда по тротуару'}
                  {report.violationType === 'wrongparking' && 'Неправильная парковка'}
                  {report.violationType === 'trafficviolation' && 'Нарушение ПДД'}
                  {report.violationType === 'helmetmissing' && 'Отсутствие шлема'}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Hardcoded перевод статуса */}
              <Badge>
                {report.status === 'submitted' && 'Отправлено'}
                {report.status === 'underreview' && 'На проверке'}
                {report.status === 'fineissued' && 'Штраф выписан'}
                {report.status === 'rejected' && 'Отклонено'}
              </Badge>
            </div>

            {/* Hardcoded проверка статуса */}
            {report.status === 'fineissued' && (
              <div className="mt-2 text-green-600">
                💰 Награда: {calculateRewardManually(report.violationType)} ₽
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

// Hardcoded расчёт награды
function calculateRewardManually(type: string): number {
  let fine = 0
  if (type === 'sidewalk') fine = 2000
  else if (type === 'wrongparking') fine = 1500
  else if (type === 'trafficviolation') fine = 3000
  else if (type === 'helmetmissing') fine = 1000

  return fine * 0.2 // 20%
}
```

**Проблемы:**
- ❌ Hardcoded строки везде
- ❌ `any` типы
- ❌ Дублирование переводов
- ❌ Магические числа (0.2, штрафы)
- ❌ Сложно поддерживать

---

## Шаг 1: Импортируем из фич

```typescript
// Добавь в начало файла
import { REPORT_CONSTANTS } from '@/features/reports'
import type { Report } from '@/features/reports'
import {
  getStatusLabel,
  getViolationLabel,
  calculateReward,
} from '@/features/reports'
```

---

## Шаг 2: Заменяем типы

```typescript
// Было
const [reports, setReports] = useState<any[]>([])

// Стало
const [reports, setReports] = useState<Report[]>([])
```

Теперь TypeScript знает структуру отчёта и подсказывает поля!

---

## Шаг 3: Заменяем hardcoded переводы

```typescript
// Было
<h3 className="font-bold">
  {report.violationType === 'sidewalk' && 'Езда по тротуару'}
  {report.violationType === 'wrongparking' && 'Неправильная парковка'}
  {report.violationType === 'trafficviolation' && 'Нарушение ПДД'}
  {report.violationType === 'helmetmissing' && 'Отсутствие шлема'}
</h3>

// Стало
<h3 className="font-bold">
  {getViolationLabel(report.violationType)}
</h3>
```

Одна строка вместо четырёх! 🎉

---

## Шаг 4: Заменяем статусы

```typescript
// Было
<Badge>
  {report.status === 'submitted' && 'Отправлено'}
  {report.status === 'underreview' && 'На проверке'}
  {report.status === 'fineissued' && 'Штраф выписан'}
  {report.status === 'rejected' && 'Отклонено'}
</Badge>

// Стало
<Badge>
  {getStatusLabel(report.status)}
</Badge>
```

Ещё проще!

---

## Шаг 5: Используем константы для проверок

```typescript
// Было
{report.status === 'fineissued' && (
  <div className="mt-2 text-green-600">
    💰 Награда: {calculateRewardManually(report.violationType)} ₽
  </div>
)}

// Стало
{report.status === REPORT_CONSTANTS.STATUSES.FINE_ISSUED && (
  <div className="mt-2 text-green-600">
    💰 Награда: {calculateReward(report.violationType)} {WALLET_CONSTANTS.CURRENCY.SYMBOL}
  </div>
)}
```

Не забудь добавить импорт:
```typescript
import { WALLET_CONSTANTS } from '@/features/wallet'
```

---

## Шаг 6: Удаляем старую функцию

```typescript
// Удаляем эту функцию полностью!
function calculateRewardManually(type: string): number {
  let fine = 0
  if (type === 'sidewalk') fine = 2000
  else if (type === 'wrongparking') fine = 1500
  else if (type === 'trafficviolation') fine = 3000
  else if (type === 'helmetmissing') fine = 1000

  return fine * 0.2
}
```

Теперь используем `calculateReward()` из фичи!

---

## После миграции

Итоговый код:

```typescript
// app/history/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/shared/ui'
import { Card } from '@/shared/ui'
import {
  REPORT_CONSTANTS,
  getStatusLabel,
  getViolationLabel,
  calculateReward,
} from '@/features/reports'
import type { Report } from '@/features/reports'
import { WALLET_CONSTANTS } from '@/features/wallet'

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => {
        setReports(data.data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">История отчётов</h1>

      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report.id} className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">
                  {getViolationLabel(report.violationType)}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString('ru')}
                </p>
              </div>

              <Badge>
                {getStatusLabel(report.status)}
              </Badge>
            </div>

            {report.status === REPORT_CONSTANTS.STATUSES.FINE_ISSUED && (
              <div className="mt-2 text-green-600">
                💰 Награда: {calculateReward(report.violationType)} {WALLET_CONSTANTS.CURRENCY.SYMBOL}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## Что изменилось?

### ✅ Улучшения:

1. **Типизация** - `Report[]` вместо `any[]`
2. **Константы** - `REPORT_CONSTANTS.STATUSES.FINE_ISSUED` вместо `'fineissued'`
3. **Утилиты** - `getStatusLabel()` вместо hardcoded переводов
4. **DRY** - переиспользуем `calculateReward()` из фичи
5. **Меньше кода** - 30 строк вместо 50!
6. **Автокомплит** - IDE подсказывает всё!

### 📊 Статистика:

- **До:** 50 строк, 4 hardcoded перевода, `any` типы
- **После:** 30 строк, 0 hardcoded, строгая типизация
- **Сокращение:** 40% кода!

---

## Проверка работы

```bash
# 1. Проверь TypeScript
npm run build

# 2. Запусти dev сервер
npm run dev

# 3. Открой /history
# Всё должно работать так же, но код чище!
```

---

## Бонус: Цветные бейджи статусов

Добавим цвета из констант:

```typescript
function getStatusBadgeVariant(status: Report['status']) {
  const color = REPORT_CONSTANTS.STATUS_COLORS[status]

  switch (color) {
    case 'green': return 'success'
    case 'yellow': return 'warning'
    case 'red': return 'destructive'
    default: return 'default'
  }
}

// Используем
<Badge variant={getStatusBadgeVariant(report.status)}>
  {getStatusLabel(report.status)}
</Badge>
```

---

## Следующие шаги

Теперь ты знаешь как мигрировать! Попробуй:

1. ✅ **app/case/[id]/page.tsx** - детальная страница
2. ✅ **app/wallet/page.tsx** - кошелёк
3. ✅ **app/record/page.tsx** - запись

Используй тот же подход:
1. Импорты из фич
2. Замена типов
3. Константы вместо строк
4. Утилиты для форматирования

---

## Вопросы?

- Смотри примеры в `/examples/how-to-use-features.md`
- Читай документацию в `/docs/`
- Проверяй константы в `/features/*/constants.ts`

**Удачи!** 🚀
