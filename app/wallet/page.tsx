'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet as WalletIcon, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'

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

export default function WalletPage() {
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [pendingRewards, setPendingRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

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
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!wallet || wallet.balance < 500) {
      alert('Минимальная сумма для вывода: 500 ₽')
      return
    }

    // Mock withdrawal - в реальном приложении интегрируем с YooKassa
    alert(`Запрос на вывод ${wallet.balance} ₽ отправлен!`)
  }

  const getRewardStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка кошелька...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Кошелек</h1>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <WalletIcon className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-blue-100">Баланс</p>
                  <p className="text-3xl font-bold">
                    {wallet ? `${wallet.balance} ₽` : '0 ₽'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Доступно к выводу</p>
                <p className="text-xl font-semibold">
                  {wallet ? `${wallet.balance} ₽` : '0 ₽'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleWithdraw}
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
              disabled={!wallet || wallet.balance < 500}
            >
              Вывести средства
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {wallet && wallet.balance < 500 && (
              <p className="text-xs text-blue-100 mt-2 text-center">
                Минимальная сумма для вывода: 500 ₽
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {pendingRewards.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0)} ₽
              </p>
              <p className="text-sm text-gray-600">Выплачено</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingRewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)} ₽
              </p>
              <p className="text-sm text-gray-600">Ожидает</p>
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
                  <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Отчет #{reward.reportId.slice(-6)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reward.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+{reward.amount} ₽</p>
                      <Badge className={getRewardStatusColor(reward.status)}>
                        {getRewardStatusText(reward.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {pendingRewards.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Нет вознаграждений</h3>
              <p className="text-gray-600 mb-4">
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
