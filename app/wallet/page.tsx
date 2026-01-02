'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/shared/ui'
import { Wallet as WalletIcon, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { BottomNav } from '@/shared/components/layout'

interface WalletData {
  id: string
  balance: number
  updatedAt: string
}

interface Reward {
  id: string
  reportId: string
  amount: number
  status: 'pending' | 'approved' | 'paid'
  createdAt: string
}

interface PayoutRequest {
  id: string
  amount: number
  status: 'created' | 'processing' | 'paid' | 'rejected'
  createdAt: string
  updatedAt: string
}

export default function WalletPage() {
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [pendingRewards, setPendingRewards] = useState<Reward[]>([])
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Проверка авторизации
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
    } else {
      setIsAuthenticated(true)
      fetchWallet()
    }
  }, [router])

  const fetchWallet = async () => {
    try {
      const { apiService } = await import('@/lib/services/api')
      const data = await apiService.getWallet()
      setWallet(data.wallet)
      setPendingRewards(data.pendingRewards || [])
      setPayoutRequests((data as any).payoutRequests || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    setMessage(null)
    if (!wallet || wallet.balance < 500) {
      setMessage('Минимальная сумма для вывода: 500 ₽')
      return
    }

    try {
      const { apiService } = await import('@/lib/services/api')
      const res = await apiService.withdraw(wallet.balance)
      if (res?.success === false) {
        setMessage(res?.message || 'Не удалось создать запрос на вывод')
      } else {
        setMessage(res?.message || `Запрос на вывод ${wallet.balance} ₽ отправлен!`)
      }
      await fetchWallet()
    } catch (error) {
      console.error('Error:', error)
      setMessage('Не удалось создать запрос на вывод')
    }
  }

  const getRewardStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'approved':
        return 'secondary'
      case 'paid':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getRewardStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает'
      case 'approved':
        return 'Подтверждено'
      case 'paid':
        return 'Выплачено'
      default:
        return status
    }
  }

  const getPayoutStatusVariant = (status: string) => {
    switch (status) {
      case 'created':
        return 'warning'
      case 'processing':
        return 'secondary'
      case 'paid':
        return 'success'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getPayoutStatusText = (status: string) => {
    switch (status) {
      case 'created':
        return 'Создана'
      case 'processing':
        return 'В обработке'
      case 'paid':
        return 'Выплачено'
      case 'rejected':
        return 'Отклонено'
      default:
        return status
    }
  }

  const progressToWithdraw = wallet ? Math.min(100, (wallet.balance / 500) * 100) : 0
  const totalPaid = pendingRewards.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0)
  const totalPending = pendingRewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground font-medium">Ваши финансы</p>
          <h1 className="text-2xl font-bold mt-1">Кошелёк</h1>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-primary-foreground/70 text-sm font-medium">Доступно</p>
                <p className="text-4xl font-black tabular-nums mt-1">
                  {wallet ? wallet.balance.toLocaleString('ru-RU') : '0'} ₽
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <WalletIcon className="w-6 h-6" />
              </div>
            </div>
            
            {/* Progress to withdraw */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-primary-foreground/70">До вывода (мин. 500 ₽)</span>
                <span className="font-semibold">{Math.round(progressToWithdraw)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${progressToWithdraw}%` }}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleWithdraw}
              className="w-full bg-white text-primary hover:bg-white/90 shadow-lg"
              disabled={!wallet || wallet.balance < 500}
            >
              Вывести средства
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {message && (
              <p className="text-xs text-primary-foreground/80 mt-3 text-center bg-white/10 rounded-lg py-2 px-3">{message}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">{totalPaid} ₽</p>
                <p className="text-xs text-muted-foreground">Выплачено</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">{totalPending} ₽</p>
                <p className="text-xs text-muted-foreground">Ожидает</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout History */}
        {payoutRequests.length > 0 && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold">История выводов</h2>
            </div>
            <div className="p-3 space-y-2">
              {payoutRequests.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground -rotate-45" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Вывод #{p.id.slice(-6)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm tabular-nums">-{p.amount} ₽</p>
                    <Badge variant={getPayoutStatusVariant(p.status) as any} className="text-[10px] px-2 py-0.5">
                      {getPayoutStatusText(p.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-3">Нужна помощь?</h2>
          <div className="space-y-2">
            <Link href="/support?from=wallet&intent=payout" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Вопрос по выплатам
              </Button>
            </Link>
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full justify-start">
                <WalletIcon className="w-4 h-4 mr-2" />
                О приложении и аккаунт
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {pendingRewards.length === 0 && payoutRequests.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
              <WalletIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Пока нет операций</h3>
            <p className="text-sm text-muted-foreground">
              Создавайте отчёты и получайте вознаграждения за подтверждённые нарушения
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
