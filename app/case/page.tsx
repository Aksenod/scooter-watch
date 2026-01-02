'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Badge, Button } from '@/shared/ui'
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, Sparkles, MessageCircle, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react'
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
      case 'submitted': return 'Отправлено'
      case 'underreview': return 'На проверке'
      case 'fineissued': return 'Штраф выписан'
      case 'rejected': return 'Отклонено'
      default: return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'submitted': return 'secondary'
      case 'underreview': return 'warning'
      case 'fineissued': return 'success'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return Clock
      case 'underreview': return Sparkles
      case 'fineissued': return CheckCircle2
      case 'rejected': return XCircle
      default: return Clock
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

  if (!id || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
        <div className="max-w-md mx-auto p-4">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Кейс не найден</h3>
            <p className="text-sm text-muted-foreground mb-5">Возможно, он был удалён или ссылка неверна</p>
            <Link href="/history">
              <Button>К истории</Button>
            </Link>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  const photoEvidence = report.evidence.find((e) => e.type === 'photo')
  const StatusIcon = getStatusIcon(report.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/history">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">Детали отчёта</p>
            <h1 className="text-xl font-bold">Кейс #{report.id.slice(-6)}</h1>
          </div>
        </div>

        {/* Status Card */}
        <div className={`rounded-2xl p-5 ${
          report.status === 'fineissued' ? 'bg-success/10 border border-success/20' :
          report.status === 'rejected' ? 'bg-destructive/10 border border-destructive/20' :
          report.status === 'underreview' ? 'bg-warning/10 border border-warning/20' :
          'bg-surface border border-border'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              report.status === 'fineissued' ? 'bg-success/20' :
              report.status === 'rejected' ? 'bg-destructive/20' :
              report.status === 'underreview' ? 'bg-warning/20' :
              'bg-surface-2'
            }`}>
              <StatusIcon className={`w-6 h-6 ${
                report.status === 'fineissued' ? 'text-success' :
                report.status === 'rejected' ? 'text-destructive' :
                report.status === 'underreview' ? 'text-warning' :
                'text-muted-foreground'
              }`} />
            </div>
            <div className="flex-1">
              <Badge variant={getStatusVariant(report.status) as any} className="mb-1">
                {getStatusText(report.status)}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {report.status === 'fineissued' ? 'Нарушение подтверждено, вознаграждение начислено' :
                 report.status === 'rejected' ? 'Отчёт не прошёл модерацию' :
                 report.status === 'underreview' ? 'Отчёт проверяется модератором' :
                 'Отчёт получен и ожидает проверки'}
              </p>
            </div>
          </div>
        </div>

        {/* Photo */}
        {photoEvidence && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoEvidence.url} alt="Фото нарушения" className="w-full aspect-video object-cover" />
          </div>
        )}

        {/* Details */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Детали</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Дата</p>
                <p className="text-sm font-medium">
                  {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Локация</p>
                <p className="text-sm font-medium">
                  {typeof report.latitude === 'number' && typeof report.longitude === 'number'
                    ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`
                    : 'Не указана'}
                </p>
              </div>
            </div>
            {typeof report.confidence === 'number' && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Уверенность AI</p>
                  <p className="text-sm font-medium">{Math.round(report.confidence * 100)}%</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support Actions */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold">Поддержка</h2>
          </div>
          <div className="space-y-2">
            {report.status === 'rejected' && (
              <Link href={`/support?from=case&reportId=${encodeURIComponent(report.id)}&intent=appeal`} className="block">
                <Button className="w-full shadow-lg shadow-primary/20">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Оспорить решение
                </Button>
              </Link>
            )}
            <Link href={`/support?from=case&reportId=${encodeURIComponent(report.id)}`} className="block">
              <Button variant={report.status === 'rejected' ? 'outline' : 'default'} className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Задать вопрос
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default function CasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground font-medium">Загрузка...</span>
          </div>
        </div>
        <BottomNav />
      </div>
    }>
      <CaseContent />
    </Suspense>
  )
}
