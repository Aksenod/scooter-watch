/**
 * Примеры использования feature-based архитектуры
 *
 * Этот файл показывает, как использовать новую архитектуру на практике
 */

// ============================================
// ПРИМЕР 1: Использование констант и утилит
// ============================================

import { REPORT_CONSTANTS, getStatusLabel, getViolationLabel, calculateReward } from '@/features/reports'
import type { Report } from '@/features/reports'

// Было (hardcoded):
function OldStatusBadge({ status }: { status: string }) {
  let label = ''
  if (status === 'submitted') label = 'Отправлено'
  else if (status === 'underreview') label = 'На проверке'
  else if (status === 'fineissued') label = 'Штраф выписан'
  else if (status === 'rejected') label = 'Отклонено'

  return <span>{label}</span>
}

// Стало (через константы):
function NewStatusBadge({ status }: { status: Report['status'] }) {
  return <span>{getStatusLabel(status)}</span>
}

// ============================================
// ПРИМЕР 2: Использование типов
// ============================================

import type { ReportStatus, ViolationType } from '@/features/reports'

// Было (any или string):
function processReport(report: any) {
  console.log(report.status)
}

// Стало (типизированно):
function processReportTyped(report: Report) {
  console.log(report.status) // TypeScript знает, что это ReportStatus
  console.log(getViolationLabel(report.violationType)) // Автокомплит!
}

// ============================================
// ПРИМЕР 3: Компонент карточки отчёта
// ============================================

import { Badge } from '@/shared/ui'

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  const statusLabel = getStatusLabel(report.status)
  const violationLabel = getViolationLabel(report.violationType)
  const reward = calculateReward(report.violationType)

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{violationLabel}</h3>
          <p className="text-sm text-gray-500">
            {new Date(report.createdAt).toLocaleDateString('ru')}
          </p>
        </div>

        <Badge variant={getBadgeVariant(report.status)}>
          {statusLabel}
        </Badge>
      </div>

      {report.status === REPORT_CONSTANTS.STATUSES.FINE_ISSUED && (
        <div className="mt-2 text-green-600">
          💰 Награда: {reward} ₽
        </div>
      )}
    </div>
  )
}

function getBadgeVariant(status: ReportStatus) {
  const color = REPORT_CONSTANTS.STATUS_COLORS[status]

  switch (color) {
    case 'green': return 'success'
    case 'yellow': return 'warning'
    case 'red': return 'destructive'
    default: return 'default'
  }
}

// ============================================
// ПРИМЕР 4: Использование в странице
// ============================================

// app/history/page.tsx
export default function HistoryPage() {
  // Пока используем старый код, но готовимся к миграции
  const [reports, setReports] = React.useState<Report[]>([])

  React.useEffect(() => {
    // Загрузка отчётов
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => setReports(data.data))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">История отчётов</h1>

      <div className="space-y-4">
        {reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  )
}

// ============================================
// ПРИМЕР 5: Фильтрация отчётов
// ============================================

import type { ReportFilters } from '@/features/reports'

function ReportFilters() {
  const [filters, setFilters] = React.useState<ReportFilters>({})

  const handleStatusFilter = (status: ReportStatus) => {
    setFilters(prev => ({ ...prev, status }))
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => handleStatusFilter(REPORT_CONSTANTS.STATUSES.SUBMITTED)}>
        {REPORT_CONSTANTS.STATUS_LABELS.submitted}
      </button>

      <button onClick={() => handleStatusFilter(REPORT_CONSTANTS.STATUSES.UNDER_REVIEW)}>
        {REPORT_CONSTANTS.STATUS_LABELS.underreview}
      </button>

      <button onClick={() => handleStatusFilter(REPORT_CONSTANTS.STATUSES.FINE_ISSUED)}>
        {REPORT_CONSTANTS.STATUS_LABELS.fineissued}
      </button>

      <button onClick={() => handleStatusFilter(REPORT_CONSTANTS.STATUSES.REJECTED)}>
        {REPORT_CONSTANTS.STATUS_LABELS.rejected}
      </button>
    </div>
  )
}

// ============================================
// ПРИМЕР 6: Работа с Wallet
// ============================================

import { WALLET_CONSTANTS } from '@/features/wallet'
import type { Wallet } from '@/features/wallet'

function WalletBalance({ wallet }: { wallet: Wallet }) {
  const canWithdraw = wallet.balance >= WALLET_CONSTANTS.WITHDRAWAL.MIN_AMOUNT

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
      <p className="text-sm opacity-90">Доступно</p>
      <h2 className="text-4xl font-bold">
        {wallet.balance} {WALLET_CONSTANTS.CURRENCY.SYMBOL}
      </h2>

      {canWithdraw ? (
        <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded">
          Вывести средства
        </button>
      ) : (
        <p className="mt-4 text-sm opacity-75">
          Минимум для вывода: {WALLET_CONSTANTS.WITHDRAWAL.MIN_AMOUNT} {WALLET_CONSTANTS.CURRENCY.SYMBOL}
        </p>
      )}
    </div>
  )
}

// ============================================
// ПРИМЕР 7: Auth Feature
// ============================================

import { AUTH_CONSTANTS } from '@/features/auth'

function OTPInput() {
  const [code, setCode] = React.useState('')

  const handleSubmit = () => {
    if (code.length !== AUTH_CONSTANTS.OTP.LENGTH) {
      alert(`Код должен содержать ${AUTH_CONSTANTS.OTP.LENGTH} цифры`)
      return
    }

    // Проверка OTP
    // ...
  }

  return (
    <input
      type="text"
      maxLength={AUTH_CONSTANTS.OTP.LENGTH}
      placeholder={`Введите ${AUTH_CONSTANTS.OTP.LENGTH}-значный код`}
      value={code}
      onChange={(e) => setCode(e.target.value)}
    />
  )
}

// ============================================
// ПРИМЕР 8: Recording Feature
// ============================================

import { RECORDING_CONSTANTS } from '@/features/recording'

function CameraCapture() {
  const handleFileSelect = (file: File) => {
    if (file.size > RECORDING_CONSTANTS.CAMERA.MAX_FILE_SIZE) {
      alert(RECORDING_CONSTANTS.MESSAGES.FILE_TOO_LARGE)
      return
    }

    // Обработка файла
    // ...
  }

  return (
    <input
      type="file"
      accept="image/*"
      capture="environment"
      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
    />
  )
}

// ============================================
// ПРИМЕР 9: Classification Feature
// ============================================

import { CLASSIFICATION_CONSTANTS } from '@/features/classification'

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const isHigh = confidence >= CLASSIFICATION_CONSTANTS.CONFIDENCE_THRESHOLDS.HIGH
  const isMedium = confidence >= CLASSIFICATION_CONSTANTS.CONFIDENCE_THRESHOLDS.MEDIUM

  const color = isHigh
    ? CLASSIFICATION_CONSTANTS.CONFIDENCE_COLORS.HIGH
    : isMedium
    ? CLASSIFICATION_CONSTANTS.CONFIDENCE_COLORS.MEDIUM
    : CLASSIFICATION_CONSTANTS.CONFIDENCE_COLORS.LOW

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Уверенность AI</span>
        <span className={`font-bold text-${color}-600`}>
          {Math.round(confidence * 100)}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-500 h-2 rounded-full`}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>

      {!isHigh && (
        <p className="text-xs text-gray-500">
          {CLASSIFICATION_CONSTANTS.MESSAGES.LOW_CONFIDENCE}
        </p>
      )}
    </div>
  )
}

// ============================================
// ПРИМЕР 10: Shared Constants
// ============================================

import { APP_CONSTANTS, ENV } from '@/shared/constants'

function Footer() {
  return (
    <footer className="text-center py-4 text-sm text-gray-500">
      <p>{APP_CONSTANTS.APP.NAME} v{APP_CONSTANTS.APP.VERSION}</p>
      <p>{APP_CONSTANTS.APP.DESCRIPTION}</p>

      {ENV.isDevelopment && (
        <p className="text-red-500">Development Mode</p>
      )}

      <div className="mt-2">
        <a href={`mailto:${APP_CONSTANTS.CONTACTS.SUPPORT_EMAIL}`}>
          Поддержка
        </a>
        {' | '}
        <a href={`https://t.me/${APP_CONSTANTS.CONTACTS.TELEGRAM}`}>
          Telegram
        </a>
      </div>
    </footer>
  )
}
