'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/ui'
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon } from 'lucide-react'
import { BottomNav } from '@/shared/components/layout'

interface ReportDetail {
  id: string
  violationType: string
  status: string
  confidence?: number
  createdAt: string
  latitude?: number
  longitude?: number
  evidence: { id: string; type: 'video' | 'photo'; url: string }[]
}

function CaseContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [report, setReport] = useState<ReportDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const { apiService } = await import('@/lib/services/api')
        const data = await apiService.getReportById(id)
        setReport(data)
      } catch (error) {
        console.error('Error fetching report:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка кейса...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!id || !report) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="mb-4">Кейс не найден</p>
              <Link href="/history">
                <Button>К истории</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    )
  }

  const photoEvidence = report.evidence.find((e) => e.type === 'photo')

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/history">
              <Button variant="outline" size="sm" className="mr-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Кейс #{report.id.slice(-6)}</h1>
          </div>
          <Badge variant={getStatusVariant(report.status) as any}>{getStatusText(report.status)}</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Детали</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {typeof report.latitude === 'number' && typeof report.longitude === 'number'
                ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`
                : 'Локация не указана'}
            </div>
            {typeof report.confidence === 'number' && (
              <div className="text-sm text-muted-foreground">
                Уверенность AI: {Math.round(report.confidence * 100)}%
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Фото
            </CardTitle>
          </CardHeader>
          <CardContent>
            {photoEvidence ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoEvidence.url} alt="Фото нарушения" className="w-full rounded-lg" />
            ) : (
              <p className="text-sm text-muted-foreground">Фото не найдено</p>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Поддержка по отчёту</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.status === 'rejected' ? (
              <Link href={`/support?from=case&reportId=${encodeURIComponent(report.id)}&intent=appeal`}>
                <Button className="w-full">Оспорить решение</Button>
              </Link>
            ) : null}
            <Link href={`/support?from=case&reportId=${encodeURIComponent(report.id)}`}>
              <Button variant={report.status === 'rejected' ? 'outline' : 'default'} className="w-full">
                Задать вопрос по отчёту
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}

export default function CasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    }>
      <CaseContent />
    </Suspense>
  )
}
