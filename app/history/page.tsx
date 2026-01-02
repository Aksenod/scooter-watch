'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/ui'
import { Eye, Calendar, MapPin, TrendingUp } from 'lucide-react'
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

        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Нет отчетов</h3>
              <p className="text-muted-foreground mb-4">
                Вы еще не создали ни одного отчета
              </p>
              <Link href="/record">
                <Button>Создать первый отчет</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="transition-colors hover:bg-surface">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold capitalize mb-1">
                        {getViolationTypeText(report.violationType)}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        Москва, Россия
                      </div>
                    </div>

                    <Badge variant={getStatusVariant(report.status) as any}>
                      {getStatusText(report.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    {typeof report.rewardAmount === 'number' ? (
                      <div className="flex items-center text-success">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-medium">+{report.rewardAmount} ₽</span>
                      </div>
                    ) : (
                      <div />
                    )}

                    <Link href={`/case?id=${report.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Подробнее
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
