/**
 * Reports Feature Constants
 */

export const REPORT_CONSTANTS = {
  // Статусы отчётов
  STATUSES: {
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'underreview',
    FINE_ISSUED: 'fineissued',
    REJECTED: 'rejected',
  } as const,

  // Типы нарушений
  VIOLATION_TYPES: {
    SIDEWALK: 'sidewalk',
    WRONG_PARKING: 'wrongparking',
    TRAFFIC_VIOLATION: 'trafficviolation',
    HELMET_MISSING: 'helmetmissing',
  } as const,

  // Лейблы статусов (русский)
  STATUS_LABELS: {
    submitted: 'Отправлено',
    underreview: 'На проверке',
    fineissued: 'Штраф выписан',
    rejected: 'Отклонено',
  } as const,

  // Лейблы нарушений (русский)
  VIOLATION_LABELS: {
    sidewalk: 'Езда по тротуару',
    wrongparking: 'Неправильная парковка',
    trafficviolation: 'Нарушение ПДД',
    helmetmissing: 'Отсутствие шлема',
  } as const,

  // Цвета статусов
  STATUS_COLORS: {
    submitted: 'blue',
    underreview: 'yellow',
    fineissued: 'green',
    rejected: 'red',
  } as const,

  // Штрафы за нарушения (в рублях)
  FINES: {
    sidewalk: 2000,
    wrongparking: 1500,
    trafficviolation: 3000,
    helmetmissing: 1000,
  } as const,

  // Процент награды
  REWARD_PERCENTAGE: 0.2, // 20%
} as const
