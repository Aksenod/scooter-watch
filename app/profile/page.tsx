'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/ui'

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
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4">Загрузка профиля...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="mb-4">Профиль не найден</p>
              <Link href="/auth">
                <Button>Войти</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">О приложении / Аккаунт</h1>
          <Link href="/">
            <Button variant="outline" size="sm">На главную</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Данные</CardTitle>
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

            <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div>
                <p className="font-medium">Уведомления</p>
                <p className="text-xs text-muted-foreground">Обновления статусов и выплат</p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
            </div>

            <Button onClick={onSave} className="w-full">Сохранить</Button>

            {message ? <p className="text-sm text-success">{message}</p> : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/referrals">
              <Button variant="outline" className="w-full">Реферальная программа</Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={onResetDemo}>
              Сбросить демо-данные
            </Button>
            <Button variant="destructive" className="w-full" onClick={onLogout}>
              Выйти
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
