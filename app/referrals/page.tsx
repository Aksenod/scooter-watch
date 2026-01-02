'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@/shared/ui'
import { ArrowLeft, CheckCircle2, Copy, Gift, Link2, Users } from 'lucide-react'

type ReferralInvite = {
  userId: string
  createdAt: string
}

type ReferralInfo = {
  code: string
  invites: ReferralInvite[]
  bonusTotal: number
}

export default function ReferralsPage() {
  const router = useRouter()
  const [info, setInfo] = useState<ReferralInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
      return
    }

    ;(async () => {
      try {
        const { apiService } = await import('@/lib/services/api')
        const data = await apiService.getReferralInfo()
        setInfo(data as any)
      } catch {
        setInfo(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  const referralLink = useMemo(() => {
    if (!info) return ''
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/auth?ref=${encodeURIComponent(info.code)}`
  }, [info])

  const copy = async () => {
    setMessage(null)
    try {
      await navigator.clipboard.writeText(referralLink)
      setMessage('Ссылка скопирована')
    } catch {
      setMessage('Не удалось скопировать ссылку')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">Бонусы</p>
            <h1 className="text-xl font-bold">Реферальная программа</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground font-medium">Загрузка...</span>
          </div>
        ) : !info ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Не удалось загрузить</h3>
            <p className="text-sm text-muted-foreground">Попробуйте обновить страницу позже</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Приглашайте друзей</p>
                  <p className="text-sm text-muted-foreground">Получайте бонус за каждого активного пользователя</p>
                </div>
              </div>
            </div>

            <Card className="rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  Ваша ссылка
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input value={referralLink} readOnly />
                <Button onClick={copy} className="w-full shadow-lg shadow-primary/20">
                  <Copy className="w-4 h-4 mr-2" />
                  Скопировать
                </Button>
                {message ? (
                  <div className="rounded-xl bg-success/10 border border-success/20 p-3">
                    <p className="text-sm text-success">{message}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums">{info.invites.length}</p>
                    <p className="text-xs text-muted-foreground">Приглашено</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums">+{info.bonusTotal} ₽</p>
                    <p className="text-xs text-muted-foreground">Бонусы</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Приглашённые
                </CardTitle>
              </CardHeader>
              <CardContent>
                {info.invites.length === 0 ? (
                  <div className="rounded-xl bg-surface/50 p-4 text-sm text-muted-foreground">
                    Пока никого не пригласили
                  </div>
                ) : (
                  <div className="space-y-2">
                    {info.invites.map((i) => (
                      <div key={i.userId} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{i.userId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(i.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <Badge variant="success" className="text-[10px] px-2 py-0.5">Принят</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
