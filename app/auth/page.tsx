'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'
import { ArrowLeft, Shield } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<'consent' | 'phone' | 'otp'>('consent')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refInfo, setRefInfo] = useState<string | null>(null)

  const isStaticHosting = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    return typeof window !== 'undefined' && (window.location.hostname.includes('github.io') || !apiUrl)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (!ref) return
    localStorage.setItem('scooter_watch_pending_referrer', ref)
    setRefInfo(ref)
  }, [])

  const handleConsent = () => {
    setStep('phone')
  }

  const handleVerify = async () => {
    setError(null)
    if (!code || code.trim().length < 4) {
      setError('Введите код')
      return
    }

    const normalizedPhone = phone.replace(/\D/g, '')
    const normalizedName = name.trim()

    setLoading(true)
    try {
      const { apiService } = await import('@/lib/services/api')
      const data = await apiService.verifyOTP(normalizedPhone, code.trim(), normalizedName)

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))

      try {
        await apiService.applyPendingReferral()
      } catch {
        // ignore
      }

      localStorage.setItem('sw_pwa_install_after_login', '1')

      router.push('/')
    } catch (e) {
      console.error('Error:', e)
      setError('Ошибка входа. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setError(null)
    if (!phone || phone.trim().length < 10) {
      setError('Введите корректный номер телефона')
      return
    }

    const normalizedName = name.trim()

    setLoading(true)
    try {
      // Упрощённая авторизация без OTP для GitHub Pages
      // Нормализация номера телефона
      const normalizedPhone = phone.replace(/\D/g, '')

      if (!isStaticHosting()) {
        const { apiService } = await import('@/lib/services/api')
        await apiService.requestOTP(normalizedPhone)
        setStep('otp')
        return
      }

      // Генерируем простой ID из номера телефона
      const userId = `user_${normalizedPhone}`

      // Создаём объект пользователя
      const user = {
        id: userId,
        phone: normalizedPhone,
        name: normalizedName || `User ${normalizedPhone.slice(-4)}`,
      }

      // Сохраняем в localStorage
      localStorage.setItem('auth_token', userId)
      localStorage.setItem('auth_user', JSON.stringify(user))

      try {
        const { apiService } = await import('@/lib/services/api')
        await apiService.applyPendingReferral()
      } catch {
        // ignore
      }

      localStorage.setItem('sw_pwa_install_after_login', '1')

      // Редирект на страницу записи
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      setError('Ошибка входа. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'consent') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-foreground" />
              </div>
              <CardTitle className="text-2xl">Добро пожаловать!</CardTitle>
              <CardDescription>
                ScooterWatch - платформа для фиксации нарушений самокатчиков
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Продолжая, вы соглашаетесь:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>С обработкой персональных данных</li>
                  <li>С правилами платформы</li>
                  <li>С условиями использования</li>
                </ul>
              </div>
              
              <Button onClick={handleConsent} className="w-full">
                Продолжить
              </Button>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Подтвердите вход</CardTitle>
              <CardDescription>
                Введите код из SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Код
                </label>
                <Input
                  inputMode="numeric"
                  placeholder="1234"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    if (error) setError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && code && !loading) {
                      handleVerify()
                    }
                  }}
                />
                {error ? (
                  <p className="text-xs text-destructive mt-2">{error}</p>
                ) : null}
              </div>

              <Button
                onClick={handleVerify}
                disabled={!code || loading}
                className="w-full"
              >
                {loading ? 'Проверка...' : 'Подтвердить'}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('phone')
                  setCode('')
                  setError(null)
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вход в приложение</CardTitle>
            <CardDescription>
              Введите имя и номер телефона
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {refInfo ? (
              <div className="text-xs text-muted-foreground bg-surface rounded-md p-3">
                Реферальное приглашение сохранено. После входа бонус будет начислен пригласившему.
              </div>
            ) : null}
            <div>
              <label className="block text-sm font-medium mb-2">
                Имя
              </label>
              <Input
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Номер телефона
              </label>
              <Input
                type="tel"
                placeholder="+79991234567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (error) setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && phone && !loading) {
                    handleLogin()
                  }
                }}
              />
              {error ? (
                <p className="text-xs text-destructive mt-2">{error}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">
                  Демо версия: вход без SMS кода
                </p>
              )}
            </div>

            <Button
              onClick={handleLogin}
              disabled={!phone || loading}
              className="w-full"
            >
              {loading ? 'Продолжить...' : 'Продолжить'}
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
