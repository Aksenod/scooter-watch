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
