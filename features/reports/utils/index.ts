/**
 * Reports Feature - Utility Functions
 */

import { REPORT_CONSTANTS } from '../constants'
import type { ReportStatus, ViolationType } from '../types'

/**
 * Получить русский лейбл для статуса
 */
export function getStatusLabel(status: ReportStatus): string {
  return REPORT_CONSTANTS.STATUS_LABELS[status] || status
}

/**
 * Получить цвет для статуса
 */
export function getStatusColor(status: ReportStatus): string {
  return REPORT_CONSTANTS.STATUS_COLORS[status] || 'gray'
}

/**
 * Получить русский лейбл для типа нарушения
 */
export function getViolationLabel(type: ViolationType): string {
  return REPORT_CONSTANTS.VIOLATION_LABELS[type] || type
}

/**
 * Форматировать дату отчёта
 */
export function formatReportDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Получить сумму награды за нарушение (20% от штрафа)
 */
export function calculateReward(type: ViolationType): number {
  const fine = REPORT_CONSTANTS.FINES[type]
  return Math.floor(fine * REPORT_CONSTANTS.REWARD_PERCENTAGE)
}
