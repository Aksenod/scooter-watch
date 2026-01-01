'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Calendar, MapPin, TrendingUp } from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'

interface Report {
  id: string
  violationType: string
  status: string
  createdAt: string
  rewardAmount?: number
}

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reports', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'underreview':
        return 'bg-yellow-100 text-yellow-800'
      case 'fineissued':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка истории...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">История отчетов</h1>
          <div className="text-sm text-gray-600">
            Всего: {reports.length}
          </div>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Нет отчетов</h3>
              <p className="text-gray-600 mb-4">
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
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold capitalize mb-1">
                        {getViolationTypeText(report.violationType)}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        Москва, Россия
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusText(report.status)}
                    </Badge>
                  </div>

                  {report.rewardAmount && (
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-medium">
                          +{report.rewardAmount} ₽
                        </span>
                      </div>
                      <Link href={`/case/${report.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  )}
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
