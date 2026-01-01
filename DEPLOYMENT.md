# Деплой на GitHub Pages

Этот проект настроен для автоматического деплоя на GitHub Pages при пуше в основную ветку.

## Архитектура

- **Frontend**: Статический Next.js сайт на GitHub Pages
- **Backend**: API на Render (или другом хостинге)

Фронтенд делает прямые API запросы к бекенду через fetch.

## Настройка деплоя

### 1. Настройка GitHub Pages

1. Перейдите в Settings вашего репозитория
2. Выберите Pages в боковом меню
3. В разделе "Build and deployment":
   - Source: выберите "GitHub Actions"

### 2. Добавление секретов

1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте секрет `NEXT_PUBLIC_API_URL`:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: URL вашего бекенда (например: `https://your-api.onrender.com`)

### 3. Настройка CORS на бекенде

Важно! Ваш бекенд на Render должен разрешать запросы с GitHub Pages:

```javascript
// Пример для Express.js
app.use(cors({
  origin: [
    'https://yourusername.github.io',
    'http://localhost:3000' // для локальной разработки
  ],
  credentials: true
}));
```

### 4. Запуск деплоя

После настройки просто пушите в основную ветку:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

GitHub Actions автоматически:
1. Соберет статический сайт
2. Задеплоит его на GitHub Pages
3. Сайт будет доступен по адресу: `https://yourusername.github.io/scooter-watch`

## Локальная разработка

1. Скопируйте `.env.example` в `.env.local`:
```bash
cp .env.example .env.local
```

2. Укажите URL бекенда:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Запустите dev сервер:
```bash
npm run dev
```

## Проверка статического экспорта

Перед пушем можно проверить, что статический экспорт работает:

```bash
npm run build
```

Это создаст папку `out/` с готовым статическим сайтом.

## Известные ограничения

- API routes Next.js не работают на GitHub Pages
- Все данные хранятся на бекенде Render
- Нужно настроить CORS на бекенде

## Полезные ссылки

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Render Documentation](https://render.com/docs)
