/**
 * Global Application Constants
 */

export const APP_CONSTANTS = {
  // Информация о приложении
  APP: {
    NAME: 'ScooterWatch',
    DESCRIPTION: 'AI-платформа для мониторинга нарушений самокатчиков',
    VERSION: '1.0.0',
  },

  // Навигация
  ROUTES: {
    HOME: '/',
    AUTH: '/auth',
    RECORD: '/record',
    HISTORY: '/history',
    WALLET: '/wallet',
    CASE: '/case',
  } as const,

  // API
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
    TIMEOUT: 30000, // 30 seconds
  },

  // Локализация
  LOCALE: {
    DEFAULT: 'ru',
    SUPPORTED: ['ru', 'en'],
    CURRENCY: 'RUB',
    TIMEZONE: 'Europe/Moscow',
  },

  // Лимиты
  LIMITS: {
    MAX_REPORTS_PER_DAY: 50,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  },

  // Контакты
  CONTACTS: {
    SUPPORT_EMAIL: 'support@scooterwatch.ru',
    TELEGRAM: '@scooterwatch',
  },
} as const

// Environment variables helper
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const
