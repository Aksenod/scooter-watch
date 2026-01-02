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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка кошелька...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Кошелек</h1>

        {/* Balance Card */}
        <Card className="mb-6 bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <WalletIcon className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-primary-foreground/70">Баланс</p>
                  <p className="text-3xl font-bold">
                    {wallet ? `${wallet.balance} ₽` : '0 ₽'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/70 text-sm">Доступно к выводу</p>
                <p className="text-xl font-semibold">
                  {wallet ? `${wallet.balance} ₽` : '0 ₽'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleWithdraw}
              className="w-full bg-background text-foreground hover:bg-surface"
              disabled={!wallet || wallet.balance < 500}
            >
              Вывести средства
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {message ? (
              <p className="text-xs text-primary-foreground/80 mt-2 text-center">{message}</p>
            ) : wallet && wallet.balance < 500 ? (
              <p className="text-xs text-primary-foreground/80 mt-2 text-center">
                Минимальная сумма для вывода: 500 ₽
              </p>
            ) : null}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {pendingRewards.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0)} ₽
              </p>
              <p className="text-sm text-muted-foreground">Выплачено</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {pendingRewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)} ₽
              </p>
              <p className="text-sm text-muted-foreground">Ожидает</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Rewards */}
        {pendingRewards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>История вознаграждений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium">Отчет #{reward.reportId.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reward.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">+{reward.amount} ₽</p>
                      <Badge variant={getRewardStatusVariant(reward.status) as any}>
                        {getRewardStatusText(reward.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {payoutRequests.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>История выводов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payoutRequests.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium">Вывод #{p.id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">-{p.amount} ₽</p>
                      <Badge variant={getPayoutStatusVariant(p.status) as any}>
                        {getPayoutStatusText(p.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Нужна помощь?</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/support">
              <Button variant="outline" className="w-full">Поддержка и обратная связь</Button>
            </Link>
            <div className="mt-3">
              <Link href="/profile">
                <Button variant="outline" className="w-full">Профиль и настройки</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {pendingRewards.length === 0 && payoutRequests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Нет вознаграждений</h3>
              <p className="text-muted-foreground mb-4">
                Создавайте отчеты и получайте вознаграждения за подтвержденные нарушения
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
