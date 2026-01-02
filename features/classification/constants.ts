/**
 * Classification Feature Constants
 */

export const CLASSIFICATION_CONSTANTS = {
  // Пороги уверенности
  CONFIDENCE_THRESHOLDS: {
    HIGH: 0.9, // >= 90% - высокая
    MEDIUM: 0.7, // 70-89% - средняя
    LOW: 0.5, // 50-69% - низкая
  },

  // Цвета для уверенности
  CONFIDENCE_COLORS: {
    HIGH: 'green',
    MEDIUM: 'yellow',
    LOW: 'red',
  } as const,

  // AI провайдер
  AI_PROVIDER: {
    PROVIDER: process.env.AI_PROVIDER || 'mock', // 'openai' | 'claude' | 'mock'
    MODEL: process.env.AI_MODEL || 'gpt-4-vision-preview',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.3,
  },

  // Mock классификация (для разработки)
  MOCK: {
    ENABLED: process.env.NODE_ENV === 'development',
    MIN_CONFIDENCE: 0.7,
    MAX_CONFIDENCE: 1.0,
    DELAY_MS: 2000, // Имитация задержки API
  },

  // Сообщения
  MESSAGES: {
    ANALYZING: 'Анализируем нарушение...',
    SUCCESS: 'Классификация завершена',
    ERROR: 'Ошибка классификации',
    LOW_CONFIDENCE: 'Низкая уверенность. Требуется ручная проверка.',
  } as const,
} as const
