/**
 * Wallet Feature Constants
 */

export const WALLET_CONSTANTS = {
  // Статусы наград
  REWARD_STATUSES: {
    PENDING: 'pending',
    APPROVED: 'approved',
    PAID: 'paid',
  } as const,

  // Лейблы статусов
  REWARD_STATUS_LABELS: {
    pending: 'В ожидании',
    approved: 'Одобрено',
    paid: 'Выплачено',
  } as const,

  // Вывод средств
  WITHDRAWAL: {
    MIN_AMOUNT: 500, // ₽500
    MAX_AMOUNT: 50000, // ₽50,000
    FEE_PERCENTAGE: 0, // Без комиссии
  },

  // Валюта
  CURRENCY: {
    CODE: 'RUB',
    SYMBOL: '₽',
    DECIMAL_PLACES: 0,
  },

  // Платёжные системы (для будущего)
  PAYMENT_PROVIDERS: {
    YOOKASSA: 'yookassa',
    SBERBANK: 'sberbank',
    TINKOFF: 'tinkoff',
  } as const,
} as const
