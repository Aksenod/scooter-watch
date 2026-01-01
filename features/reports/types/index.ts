/**
 * Reports Feature - TypeScript Types
 */

// Статусы отчёта
export type ReportStatus = 'submitted' | 'underreview' | 'fineissued' | 'rejected'

// Типы нарушений
export type ViolationType = 'sidewalk' | 'wrongparking' | 'trafficviolation' | 'helmetmissing'

// Основной тип отчёта
export type Report = {
  id: string
  userId: string
  violationType: ViolationType
  status: ReportStatus
  confidence: number
  latitude: number | null
  longitude: number | null
  createdAt: Date
  updatedAt: Date
}

// Входные данные для создания отчёта
export type CreateReportInput = {
  violationType?: ViolationType
  latitude?: number
  longitude?: number
}

// Фильтры для списка отчётов
export type ReportFilters = {
  status?: ReportStatus
  violationType?: ViolationType
  dateFrom?: Date
  dateTo?: Date
}
