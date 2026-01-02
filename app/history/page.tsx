'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/ui'
import { Calendar, MapPin, TrendingUp } from 'lucide-react'
import { BottomNav } from '@/shared/components/layout'

interface Report {
  id: string
  violationType: string
  status: string
  createdAt: string
  rewardAmount?: number
}

export default function HistoryPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [filter, setFilter] = useState<'all' | 'submitted' | 'underreview' | 'fineissued' | 'rejected'>('all')

  // Проверка авторизации
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
    } else {
      setIsAuthenticated(true)
      fetchReports()
    }
  }, [router])

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
      case 'submitted':
        return 'secondary'
      case 'underreview':
        return 'warning'
      case 'fineissued':
        return 'success'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Отправлено'
      case 'underreview':
        return 'На проверке'
      case 'fineissued':
        return 'Штраф выписан'
      case 'rejected':
        return 'Отклонено'
      default:
        return status
    }
  }

  const getViolationTypeText = (type: string) => {
    switch (type) {
      case 'sidewalk':
        return 'Езда по тротуару'
      case 'wrongparking':
        return 'Неправильная парковка'
      case 'trafficviolation':
        return 'Нарушение ПДД'
      case 'helmetmissing':
        return 'Отсутствие шлема'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка истории...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">История отчетов</h1>
          <div className="text-sm text-muted-foreground">
            Всего: {reports.length}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" variant={filter === 'all' ? 'secondary' : 'outline'} onClick={() => setFilter('all')}>
            Все
          </Button>
          <Button size="sm" variant={filter === 'fineissued' ? 'secondary' : 'outline'} onClick={() => setFilter('fineissued')}>
            Выплачено
          </Button>
          <Button size="sm" variant={filter === 'underreview' ? 'secondary' : 'outline'} onClick={() => setFilter('underreview')}>
            На проверке
          </Button>
          <Button size="sm" variant={filter === 'submitted' ? 'secondary' : 'outline'} onClick={() => setFilter('submitted')}>
            Отправлено
          </Button>
          <Button size="sm" variant={filter === 'rejected' ? 'secondary' : 'outline'} onClick={() => setFilter('rejected')}>
            Отклонено
          </Button>
        </div>

        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Нет отчетов</h3>
              <p className="text-muted-foreground mb-4">
                {reports.length === 0 ? 'Вы еще не создали ни одного отчета' : 'По выбранному фильтру ничего не найдено'}
              </p>
              {reports.length === 0 ? (
                <Link href="/record">
                  <Button>Создать первый отчет</Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={() => setFilter('all')}>Сбросить фильтр</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Link key={report.id} href={`/case?id=${report.id}`} className="block">
                <Card className="transition-colors hover:bg-surface">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold capitalize mb-1 truncate">
                          {getViolationTypeText(report.violationType)}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          Москва, Россия
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusVariant(report.status) as any}>
                          {getStatusText(report.status)}
                        </Badge>
                        {typeof report.rewardAmount === 'number' ? (
                          <div className="flex items-center text-success text-sm font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            +{report.rewardAmount} ₽
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
