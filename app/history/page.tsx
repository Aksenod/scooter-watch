'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Badge, Button } from '@/shared/ui'
import { Calendar, Camera, ChevronRight, FileText, TrendingUp } from 'lucide-react'
import { BottomNav } from '@/shared/components/layout'
import { cn } from '@/lib/utils'

interface Report {
  id: string
  violationType: string
  status: string
  createdAt: string
  rewardAmount?: number
}

const filters = [
  { key: 'all', label: 'Все' },
  { key: 'fineissued', label: 'Выплачено' },
  { key: 'underreview', label: 'На проверке' },
  { key: 'submitted', label: 'Отправлено' },
  { key: 'rejected', label: 'Отклонено' },
] as const

export default function HistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [filter, setFilter] = useState<'all' | 'submitted' | 'underreview' | 'fineissued' | 'rejected'>('all')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
    } else {
      setIsAuthenticated(true)
      fetchReports()
    }
  }, [router])

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam && ['submitted', 'underreview', 'fineissued', 'rejected'].includes(filterParam)) {
      setFilter(filterParam as any)
    }
  }, [searchParams])

  const fetchReports = async () => {
    try {
      const { apiService } = await import('@/lib/services/api')
      const data = await apiService.getReports()
      setReports(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = useMemo(() => {
    if (filter === 'all') return reports
    return reports.filter((r) => r.status === filter)
  }, [reports, filter])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'submitted': return 'secondary'
      case 'underreview': return 'warning'
      case 'fineissued': return 'success'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return 'Отправлено'
      case 'underreview': return 'На проверке'
      case 'fineissued': return 'Штраф выписан'
      case 'rejected': return 'Отклонено'
      default: return status
    }
  }

  const getViolationTypeText = (type: string) => {
    switch (type) {
      case 'sidewalk': return 'Езда по тротуару'
      case 'wrongparking': return 'Неправильная парковка'
      case 'trafficviolation': return 'Нарушение ПДД'
      case 'helmetmissing': return 'Отсутствие шлема'
      case 'double_riding': return 'Езда вдвоём'
      case 'crosswalk': return 'Езда по пешеходному переходу'
      case 'red_light': return 'Проезд на красный'
      case 'phone_use': return 'Телефон в руках во время движения'
      case 'other': return 'Другое'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground font-medium">Загрузка...</span>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground font-medium">Ваша активность</p>
          <div className="flex items-center justify-between mt-1">
            <h1 className="text-2xl font-bold">История отчётов</h1>
            <div className="px-3 py-1.5 rounded-full bg-surface-2 text-sm font-medium tabular-nums">
              {reports.length} отчётов
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                filter === key
                  ? "bg-foreground text-background shadow-md"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Reports list */}
        {filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Нет отчётов</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {reports.length === 0 ? 'Вы ещё не создали ни одного отчёта' : 'По выбранному фильтру ничего не найдено'}
            </p>
            {reports.length === 0 ? (
              <Link href="/record">
                <Button className="shadow-lg shadow-primary/20">
                  <Camera className="w-4 h-4 mr-2" />
                  Создать первый отчёт
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => setFilter('all')}>Сбросить фильтр</Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <Link key={report.id} href={`/case?id=${report.id}`} className="block group">
                <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5 text-muted-foreground" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {getViolationTypeText(report.violationType)}
                        </h3>
                        {typeof report.rewardAmount === 'number' && (
                          <span className="text-xs font-bold tabular-nums text-success flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{report.rewardAmount} ₽
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <Badge variant={getStatusVariant(report.status) as any} className="text-[10px] px-2 py-0.5">
                          {getStatusText(report.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
