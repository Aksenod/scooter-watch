/**
 * Reports Feature - Public API
 */

// Components (будут созданы при миграции)
// export { ReportCard } from './components/ReportCard'
// export { ReportList } from './components/ReportList'
// export { ReportDetails } from './components/ReportDetails'
// export { StatusBadge } from './components/StatusBadge'

// Hooks (будут созданы при миграции)
// export { useReports } from './hooks/useReports'
// export { useReportDetails } from './hooks/useReportDetails'

// Types
export type {
  Report,
  ReportStatus,
  ViolationType,
  CreateReportInput,
  ReportFilters,
} from './types'

// Constants
export { REPORT_CONSTANTS } from './constants'

// Utils
export {
  getStatusLabel,
  getStatusColor,
  getViolationLabel,
  formatReportDate,
  calculateReward,
} from './utils'
