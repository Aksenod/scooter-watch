'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Camera, Coins, History, Shield, Users, Wallet } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'
import { BottomNav } from '@/shared/components/layout'

type Report = {
  id: string
  violationType: string
  status: string
  createdAt: string
  rewardAmount?: number
}

function GuestLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            ScooterWatch
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            AI-powered платформа для фиксации нарушений самокатчиков
          </p>
          <p className="text-lg text-muted-foreground mb-12">
            Снимайте нарушения → AI классифицирует → Получайте вознаграждение
          </p>

          <Link
            href="/auth"
            className="inline-flex"
          >
            <Button size="lg" className="text-lg">
              <Camera className="w-6 h-6 mr-2" />
              Начать
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Снимите нарушение</h3>
              <p className="text-muted-foreground">
                Запишите видео нарушения на камеру телефона
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI анализ</h3>
              <p className="text-muted-foreground">
                Искусственный интеллект классифицирует тип нарушения
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Получите награду</h3>
              <p className="text-muted-foreground">
                20% от штрафа за подтвержденное нарушение
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Присоединяйтесь к сообществу</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Пользователей</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">5000+</div>
              <div className="text-muted-foreground">Зафиксированных нарушений</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-warning mb-2">₽500K+</div>
              <div className="text-muted-foreground">Выплачено вознаграждений</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Сделайте город безопаснее вместе с нами
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Каждый отчет помогает улучшить городскую мобильность
          </p>

          <Link
            href="/auth"
            className="inline-flex"
          >
            <Button size="lg" variant="secondary" className="text-lg">
              <Users className="w-6 h-6 mr-2" />
              Присоединиться
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function LandingPage() {
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [userLabel, setUserLabel] = useState<string>('')
  const [reports, setReports] = useState<Report[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [pendingSum, setPendingSum] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      setIsAuthed(false)
      setAuthChecked(true)
      return
    }

    setIsAuthed(true)
    setAuthChecked(true)

    try {
      const rawUser = localStorage.getItem('auth_user')
      const parsed = rawUser ? (JSON.parse(rawUser) as { name?: string; phone?: string } | null) : null
      const name = parsed?.name?.trim()
      const phone = parsed?.phone?.trim()
      setUserLabel(name || (phone ? `+${phone}` : ''))
    } catch {
      setUserLabel('')
    }

    ;(async () => {
      setError(null)
      setLoading(true)
      try {
        const { apiService } = await import('@/lib/services/api')
        const [walletData, reportsData] = await Promise.all([
          apiService.getWallet(),
          apiService.getReports(),
        ])

        const walletBalance = typeof walletData?.wallet?.balance === 'number' ? walletData.wallet.balance : 0
        setBalance(walletBalance)

        const pending = Array.isArray(walletData?.pendingRewards)
          ? walletData.pendingRewards.filter((r: any) => r?.status === 'pending').reduce((sum: number, r: any) => sum + (Number(r?.amount) || 0), 0)
          : 0
        setPendingSum(pending)

        setReports(Array.isArray(reportsData) ? reportsData : [])
      } catch (e) {
        console.error('Home load error:', e)
        setError('Не удалось загрузить данные. Попробуйте позже.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const recentReports = useMemo(() => reports.slice(0, 3), [reports])

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

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthed) {
    return <GuestLanding />
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Главное</div>
          <h1 className="text-2xl font-bold">
            {userLabel ? `Привет, ${userLabel}` : 'Привет'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Быстрые действия, баланс и статус ваших отчётов
          </p>
        </div>

        <Link href="/record" className="block">
          <Button size="lg" className="w-full">
            <Camera className="w-5 h-5 mr-2" />
            Снять нарушение
          </Button>
        </Link>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-primary-foreground/70">Баланс</div>
                <div className="mt-1 text-3xl font-bold tabular-nums">{balance.toLocaleString('ru-RU')} ₽</div>
                <div className="mt-2 text-xs text-primary-foreground/70">
                  {balance >= 500 ? 'Доступно к выводу' : `Ещё ${(500 - balance).toLocaleString('ru-RU')} ₽ до вывода`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-primary-foreground/70">Ожидается</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">+{pendingSum.toLocaleString('ru-RU')} ₽</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Последние отчёты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="text-sm text-muted-foreground">Загрузка...</div>
              </div>
            ) : recentReports.length === 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Пока нет отчётов. Начните с первого.</div>
                <Link href="/record" className="inline-flex">
                  <Button size="sm">
                    Снять первое нарушение
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentReports.map((r) => (
                  <Link key={r.id} href={`/case?id=${r.id}`} className="block">
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-3 hover:bg-surface-2 transition-colors">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">Отчёт #{r.id.slice(-6)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {typeof r.rewardAmount === 'number' ? (
                          <div className="text-xs font-semibold tabular-nums text-success">+{r.rewardAmount} ₽</div>
                        ) : null}
                        <Badge variant={getStatusVariant(r.status) as any}>{getStatusText(r.status)}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/history" className="inline-flex">
                  <Button variant="outline" size="sm">
                    Все отчёты
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Как получать больше</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-foreground">1) Дайте модерации “доказательства”</div>
              <div className="text-muted-foreground">Покажите нарушение + контекст (тротуар/дорога/переход) в одном кадре. Если есть номер/бренд самоката — добавьте в кадр.</div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-foreground">2) Сделайте кадр читаемым</div>
              <div className="text-muted-foreground">Снимайте при хорошем свете, держите телефон ровно. Избегайте сильного зума и тряски — это снижает шанс подтверждения.</div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-foreground">3) Один отчёт — одно нарушение</div>
              <div className="text-muted-foreground">Не смешивайте разные ситуации в одном отчёте. Так проверка проходит быстрее, а статус меняется предсказуемее.</div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-foreground">4) Приватность и безопасность</div>
              <div className="text-muted-foreground">Не снимайте лица крупным планом и не вступайте в конфликт. Лучше снять чуть издалека, но чётко.</div>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <BottomNav />
    </div>
  )
}
