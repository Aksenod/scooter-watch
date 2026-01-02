'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Camera, Coins, Shield, Users, Sparkles, TrendingUp, Clock, CheckCircle2, ChevronRight, Zap, Target, Gift } from 'lucide-react'
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-surface">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-success/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            AI-powered платформа
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight">
            Scooter<span className="text-primary">Watch</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
            Фиксируй нарушения. Получай вознаграждение.
          </p>
          <p className="text-base text-muted-foreground/80 mb-10 max-w-md mx-auto">
            Снимайте нарушения ПДД самокатчиками, наш AI проверит и классифицирует, а вы получите до 20% от штрафа
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth" className="inline-flex">
              <Button size="lg" className="text-lg px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Camera className="w-5 h-5 mr-2" />
                Начать бесплатно
              </Button>
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Бесплатно</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Быстрый вывод</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>AI-проверка</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Как это работает?</h2>
            <p className="text-muted-foreground">Три простых шага до вознаграждения</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">1</div>
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Снимите нарушение</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Откройте приложение и запишите видео или фото нарушения ПДД самокатчиком
              </p>
            </div>

            <div className="group relative bg-card rounded-2xl p-6 border border-border hover:border-success/50 hover:shadow-lg hover:shadow-success/5 transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-bold shadow-lg">2</div>
              <div className="w-14 h-14 bg-gradient-to-br from-success/20 to-success/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI проверит</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Нейросеть автоматически распознает тип нарушения и отправит на модерацию
              </p>
            </div>

            <div className="group relative bg-card rounded-2xl p-6 border border-border hover:border-warning/50 hover:shadow-lg hover:shadow-warning/5 transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-warning text-warning-foreground flex items-center justify-center text-sm font-bold shadow-lg">3</div>
              <div className="w-14 h-14 bg-gradient-to-br from-warning/20 to-warning/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Coins className="w-7 h-7 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Получите награду</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                После подтверждения нарушения вам начислится 20% от суммы штрафа
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent">
              <div className="text-4xl md:text-5xl font-black text-primary mb-1">1 000+</div>
              <div className="text-sm text-muted-foreground font-medium">Активных пользователей</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-success/10 to-transparent">
              <div className="text-4xl md:text-5xl font-black text-success mb-1">5 000+</div>
              <div className="text-sm text-muted-foreground font-medium">Подтверждённых нарушений</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-warning/10 to-transparent">
              <div className="text-4xl md:text-5xl font-black text-warning mb-1">₽500K+</div>
              <div className="text-sm text-muted-foreground font-medium">Выплачено вознаграждений</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Сделайте город безопаснее
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            Присоединяйтесь к сообществу активных граждан, которые делают улицы комфортнее для всех
          </p>

          <Link href="/auth" className="inline-flex">
            <Button size="lg" variant="secondary" className="text-lg px-8 shadow-xl hover:scale-105 transition-transform">
              <Users className="w-5 h-5 mr-2" />
              Присоединиться бесплатно
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

  const progressToWithdraw = Math.min(100, (balance / 500) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-24">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Добро пожаловать</p>
            <h1 className="text-2xl font-bold mt-0.5">
              {userLabel ? userLabel : 'Привет!'}
            </h1>
          </div>
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-lg">
              {userLabel ? userLabel.charAt(0).toUpperCase() : '?'}
            </div>
          </Link>
        </div>

        {/* Primary CTA */}
        <Link href="/record" className="block group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/90 p-5 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Готовы зафиксировать?</p>
                <p className="text-xl font-bold mt-1">Снять нарушение</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
            </div>
          </div>
        </Link>

        {/* Balance Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Ваш баланс</p>
              <p className="text-3xl font-black tabular-nums mt-1">{balance.toLocaleString('ru-RU')} ₽</p>
            </div>
            <Link href="/wallet">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center hover:bg-surface transition-colors">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </div>
          
          {/* Progress to withdraw */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">До вывода (мин. 500 ₽)</span>
              <span className="font-semibold text-foreground">{Math.round(progressToWithdraw)}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-success to-success/80 transition-all duration-500"
                style={{ width: `${progressToWithdraw}%` }}
              />
            </div>
          </div>

          {/* Pending rewards */}
          {pendingSum > 0 && (
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 text-warning">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">+{pendingSum.toLocaleString('ru-RU')} ₽ ожидает подтверждения</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/history?filter=fineissued" className="block group">
            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{reports.filter(r => r.status === 'fineissued').length}</p>
                  <p className="text-xs text-muted-foreground">Выплачено</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/history?filter=underreview" className="block group">
            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{reports.filter(r => r.status === 'underreview').length}</p>
                  <p className="text-xs text-muted-foreground">На проверке</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Reports */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Последние отчёты</h2>
            <Link href="/history" className="text-sm text-primary font-medium hover:underline">
              Все →
            </Link>
          </div>
          <div className="p-3">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Загрузка...</span>
              </div>
            ) : recentReports.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Пока нет отчётов</p>
                <Link href="/record">
                  <Button size="sm">
                    Снять первое нарушение
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentReports.map((r) => (
                  <Link key={r.id} href={`/case?id=${r.id}`} className="block group">
                    <div className="flex items-center gap-4 rounded-xl p-3 hover:bg-surface transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0 group-hover:bg-surface transition-colors">
                        <Camera className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm truncate">Отчёт #{r.id.slice(-6)}</span>
                          {typeof r.rewardAmount === 'number' && (
                            <span className="text-xs font-bold tabular-nums text-success">+{r.rewardAmount} ₽</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <Badge variant={getStatusVariant(r.status) as any} className="text-[10px] px-2 py-0.5">
                            {getStatusText(r.status)}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center">
              <Zap className="w-4 h-4 text-warning" />
            </div>
            <h2 className="font-semibold">Советы для успеха</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Покажите контекст</p>
                <p className="text-xs text-muted-foreground mt-0.5">Нарушение + тротуар/дорога в одном кадре</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">Хороший свет</p>
                <p className="text-xs text-muted-foreground mt-0.5">Снимайте при достаточном освещении</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">Один отчёт — одно нарушение</p>
                <p className="text-xs text-muted-foreground mt-0.5">Так проверка пройдёт быстрее</p>
              </div>
            </div>
            <Link href="/tips" className="block">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Все советы
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Referral Banner */}
        <Link href="/referrals" className="block group">
          <div className="rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 p-5 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Пригласи друга</p>
                <p className="text-sm text-muted-foreground">Получи бонус за каждого приглашённого</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </Link>

        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
