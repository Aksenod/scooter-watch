'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from '@/shared/ui'
import { ArrowLeft, Clock, FileText, MessageCircle, Send, Sparkles } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          {context.from === 'case' && context.reportId ? (
            <Link href={`/case?id=${encodeURIComponent(context.reportId)}`}>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">Помощь</p>
            <h1 className="text-xl font-bold">Поддержка</h1>
          </div>
        </div>

        {context.reportId ? (
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Контекст</p>
                <p className="text-xs text-muted-foreground">Отчёт #{context.reportId.slice(-6)}</p>
              </div>
            </div>
          </div>
        ) : null}

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Новое обращение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Тема" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите проблему или вопрос"
              className="w-full min-h-[120px] rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
            <Button onClick={onSubmit} className="w-full shadow-lg shadow-primary/20" disabled={submitting}>
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Отправка...' : 'Отправить'}
            </Button>
            {error ? (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Мои обращения</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-muted-foreground font-medium">Загрузка...</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-xl bg-surface/50 p-4 text-sm text-muted-foreground">
                Пока нет обращений
              </div>
            ) : (
              <div className="space-y-2">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          <p className="font-medium truncate">{t.subject}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(t.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(t.status) as any} className="text-[10px] px-2 py-0.5">
                        {getStatusText(t.status)}
                      </Badge>
                    </div>
                    <p className="text-sm mt-3 whitespace-pre-wrap">{t.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium">Совет</p>
              <p className="text-xs text-muted-foreground">Если вопрос по конкретному отчёту — укажите номер кейса и приложите детали.</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
