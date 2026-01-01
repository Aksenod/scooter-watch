# Деплой на Render

## Проблема с текущим деплоем

Приложение сейчас деплоится на GitHub Pages как **статический сайт**, но API routes Next.js не работают на статических хостингах. Из-за этого возникает ошибка 404 при попытке входа:

```
your-backend.onrender.com/api/auth/otp-verify:1  Failed to load resource: the server responded with a status of 404 ()
```

## Решение: Деплой на Render

Чтобы API routes работали, нужно деплоить всё приложение на Render как полноценный Next.js сервер.

## Пошаговая инструкция

### 1. Подготовка базы данных

Для работы приложения нужна PostgreSQL база данных. На Render можно создать бесплатную базу:

1. Зайдите на [render.com](https://render.com) и создайте аккаунт
2. Нажмите "New +" → "PostgreSQL"
3. Заполните:
   - Name: `scooter-watch-db`
   - Database: `scooter_watch`
   - User: `scooter_watch_user`
   - Region: выберите ближайший (Frankfurt для Европы)
   - Plan: **Free**
4. Нажмите "Create Database"
5. Скопируйте **Internal Database URL** (начинается с `postgresql://`)

### 2. Деплой приложения на Render

#### Вариант А: Автоматический деплой (через render.yaml)

1. Убедитесь, что файл `render.yaml` находится в корне репозитория
2. Зайдите на [render.com](https://render.com)
3. Нажмите "New +" → "Blueprint"
4. Подключите ваш GitHub репозиторий `scooter-watch`
5. Render автоматически обнаружит `render.yaml` и создаст сервис
6. После создания сервиса, добавьте переменную окружения:
   - Key: `DATABASE_URL`
   - Value: Internal Database URL из шага 1

#### Вариант Б: Ручной деплой

1. Зайдите на [render.com](https://render.com)
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub репозиторий `scooter-watch`
4. Заполните настройки:
   - **Name**: `scooter-watch`
   - **Region**: Frankfurt (или ближайший)
   - **Root Directory**: `scooter-watch`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Добавьте переменные окружения (Environment Variables):
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = Internal Database URL из шага 1
6. Нажмите "Create Web Service"

### 3. Настройка базы данных

После деплоя нужно применить миграции Prisma:

1. Зайдите в настройки вашего Web Service на Render
2. Перейдите в раздел "Shell"
3. Выполните команды:
   ```bash
   cd scooter-watch
   npx prisma migrate deploy
   npx prisma generate
   ```

### 4. Проверка работы

После успешного деплоя ваше приложение будет доступно по адресу:
```
https://scooter-watch.onrender.com
```

Попробуйте войти в приложение:
- Введите номер телефона
- В консоли Render (Logs) вы увидите OTP код
- Введите код для входа

## Отключение GitHub Pages (опционально)

Если хотите использовать только Render, можно отключить GitHub Pages деплой:

1. Переименуйте `.github/workflows/deploy.yml` в `.github/workflows/deploy.yml.disabled`
2. Или удалите workflow полностью

## Переменные окружения

### Обязательные:
- `DATABASE_URL` - URL PostgreSQL базы данных
- `NODE_ENV` - установите в `production`

### Опциональные:
- `SMS_PROVIDER` - провайдер SMS (по умолчанию `mock`)
- `SMS_API_KEY` - API ключ для SMS провайдера

## Стоимость

- **Free plan Render**:
  - 750 часов в месяц бесплатно
  - Приложение "засыпает" после 15 минут неактивности
  - Первый запрос после сна может занять 30-60 секунд
  - Достаточно для тестирования и MVP

- **Starter plan** ($7/месяц):
  - Без "сна"
  - Больше ресурсов
  - Подходит для production

## Проблемы и решения

### Приложение долго запускается после сна
Это нормально для Free плана. Рассмотрите Starter план для production.

### Ошибка подключения к базе данных
Проверьте, что `DATABASE_URL` правильно установлен и миграции применены.

### 404 на API routes
Убедитесь, что приложение деплоится как Next.js сервер (не статический export).

## Полезные ссылки

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Render](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
