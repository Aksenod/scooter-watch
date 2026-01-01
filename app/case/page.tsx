'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon } from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка кейса...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!id || !report) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto p-4">
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/history">
              <Button variant="outline" size="sm" className="mr-3">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Кейс #{report.id.slice(-6)}</h1>
          </div>
          <Badge>{getStatusText(report.status)}</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Детали</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(report.createdAt).toLocaleString('ru-RU')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {typeof report.latitude === 'number' && typeof report.longitude === 'number'
                ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`
                : 'Локация не указана'}
            </div>
            {typeof report.confidence === 'number' && (
              <div className="text-sm text-gray-600">
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
              <p className="text-sm text-gray-600">Фото не найдено</p>
            )}
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
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
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
