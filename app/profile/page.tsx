'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/ui'
import { ArrowLeft, Bell, Gift, LogOut, RotateCcw, User as UserIcon } from 'lucide-react'

type AuthUser = {
  id: string
  phone: string
  name?: string
  notificationsEnabled?: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [name, setName] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
      return
    }

    const raw = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null
    if (!raw) {
      router.push('/auth')
      return
    }

    try {
      const parsed = JSON.parse(raw) as AuthUser
      setUser(parsed)
      setName(parsed.name ?? '')
      setNotificationsEnabled(parsed.notificationsEnabled ?? true)
      setError(null)
    } catch {
      setError('Не удалось прочитать данные профиля')
    } finally {
      setLoading(false)
    }
  }, [router])

  const demoKeySuffix = useMemo(() => {
    if (typeof window === 'undefined') return 'anon'
    return window.localStorage.getItem('auth_token') || 'anon'
  }, [])

  const onSave = () => {
    setMessage(null)
    setError(null)
    if (!user) return

    const updated: AuthUser = {
      ...user,
      name: name.trim(),
      notificationsEnabled,
    }

    localStorage.setItem('auth_user', JSON.stringify(updated))
    setUser(updated)
    setMessage('Сохранено')
  }

  const onLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    router.push('/')
  }

  const onResetDemo = () => {
    setMessage(null)
    setError(null)

    try {
      const keys = [
        `scooter_watch_demo_reports_${demoKeySuffix}`,
        `scooter_watch_demo_wallet_${demoKeySuffix}`,
        `scooter_watch_demo_payouts_${demoKeySuffix}`,
        `scooter_watch_demo_support_${demoKeySuffix}`,
        `scooter_watch_demo_referrals_${demoKeySuffix}`,
      ]
      keys.forEach((k) => localStorage.removeItem(k))
      localStorage.removeItem('scooter_watch_pending_referrer')
      setMessage('Демо-данные сброшены')
    } catch {
      setError('Не удалось сбросить демо-данные')
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
        <div className="max-w-md mx-auto p-4">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Профиль не найден</h3>
            <p className="text-sm text-muted-foreground mb-5">Войдите, чтобы продолжить</p>
            <Link href="/auth">
              <Button className="shadow-lg shadow-primary/20">Войти</Button>
            </Link>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">Настройки</p>
            <h1 className="text-xl font-bold">О приложении / Аккаунт</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-lg">
            {(name || user.phone || '?').charAt(0).toUpperCase()}
          </div>
        </div>

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Данные</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <Input value={user.phone} readOnly />
              <p className="text-xs text-muted-foreground mt-2">Телефон меняется через вход</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface/50 rounded-xl">
              <div>
                <p className="font-medium">Уведомления</p>
                <p className="text-xs text-muted-foreground">Обновления статусов и выплат</p>
              </div>
              <div className="flex items-center gap-2">
                <Bell className={notificationsEnabled ? 'w-4 h-4 text-primary' : 'w-4 h-4 text-muted-foreground'} />
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              </div>
            </div>

            <Button onClick={onSave} className="w-full shadow-lg shadow-primary/20">Сохранить</Button>

            {message ? (
              <div className="rounded-xl bg-success/10 border border-success/20 p-3">
                <p className="text-sm text-success">{message}</p>
              </div>
            ) : null}
            {error ? (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/referrals">
              <Button variant="outline" className="w-full justify-start">
                <Gift className="w-4 h-4 mr-2" />
                Реферальная программа
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" onClick={onResetDemo}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Сбросить демо-данные
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
