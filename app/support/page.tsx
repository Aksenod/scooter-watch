'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from '@/shared/ui'

type SupportTicket = {
  id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: string
  updatedAt: string
}

export default function SupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<{ from?: string; reportId?: string; intent?: string }>({})

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
      return
    }

    try {
      const params = new URLSearchParams(window.location.search)
      const from = params.get('from') || undefined
      const reportId = params.get('reportId') || undefined
      const intent = params.get('intent') || undefined
      setContext({ from, reportId, intent })

      setSubject((prev) => {
        if (prev.trim()) return prev
        if (intent === 'appeal' && reportId) return `Оспорить решение по отчёту #${reportId.slice(-6)}`
        if (reportId) return `Вопрос по отчёту #${reportId.slice(-6)}`
        if (intent === 'payout') return 'Вопрос по выплате/выводу'
        return ''
      })
    } catch {
      setContext({})
    }
    void fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchTickets = async () => {
    try {
      const { apiService } = await import('@/lib/services/api')
      const data = await apiService.getSupportTickets()
      setTickets(data)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить обращения')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async () => {
    setError(null)
    const s = subject.trim()
    const m = message.trim()
    if (!s || !m) {
      setError('Заполни тему и сообщение')
      return
    }

    setSubmitting(true)
    try {
      const { apiService } = await import('@/lib/services/api')
      await apiService.createSupportTicket({ subject: s, message: m })
      setSubject('')
      setMessage('')
      await fetchTickets()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось отправить обращение')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusVariant = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'warning'
      case 'in_progress':
        return 'secondary'
      case 'resolved':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'Открыто'
      case 'in_progress':
        return 'В работе'
      case 'resolved':
        return 'Решено'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Поддержка</h1>
          {context.from === 'case' && context.reportId ? (
            <Link href={`/case?id=${encodeURIComponent(context.reportId)}`}>
              <Button variant="outline" size="sm">К кейсу</Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="outline" size="sm">На главную</Button>
            </Link>
          )}
        </div>

        {context.reportId ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Контекст: отчёт #{context.reportId.slice(-6)}
              </p>
            </CardContent>
          </Card>
        ) : null}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Новое обращение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Тема"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опиши проблему или вопрос"
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button onClick={onSubmit} className="w-full" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Отправить'}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Мои обращения</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mt-4">Загрузка...</p>
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Пока нет обращений</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3 bg-surface rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(t.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(t.status) as any}>{getStatusText(t.status)}</Badge>
                    </div>
                    <p className="text-sm mt-2 whitespace-pre-wrap">{t.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
