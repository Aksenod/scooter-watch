'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from '@/shared/ui'

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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Рефералка</h1>
          <Link href="/profile">
            <Button variant="outline" size="sm">В профиль</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка...</p>
          </div>
        ) : !info ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p>Не удалось загрузить рефералку</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ваша ссылка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input value={referralLink} readOnly />
                <Button onClick={copy} className="w-full">Скопировать</Button>
                {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Приглашено</span>
                  <Badge variant="secondary">{info.invites.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Бонусы</span>
                  <span className="font-medium">+{info.bonusTotal} ₽</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Приглашённые</CardTitle>
              </CardHeader>
              <CardContent>
                {info.invites.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Пока никого не пригласили</p>
                ) : (
                  <div className="space-y-3">
                    {info.invites.map((i) => (
                      <div key={i.userId} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                        <div>
                          <p className="font-medium">{i.userId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(i.createdAt).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <Badge variant="success">Принят</Badge>
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
