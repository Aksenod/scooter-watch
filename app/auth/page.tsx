'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'
import { ArrowLeft, Shield } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<'consent' | 'phone'>('consent')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConsent = () => {
    setStep('phone')
  }

  const handleLogin = async () => {
    setError(null)
    if (!phone || phone.trim().length < 10) {
      setError('Введите корректный номер телефона')
      return
    }

    setLoading(true)
    try {
      // Упрощённая авторизация без OTP для GitHub Pages
      // Нормализация номера телефона
      const normalizedPhone = phone.replace(/\D/g, '')

      // Генерируем простой ID из номера телефона
      const userId = `user_${normalizedPhone}`

      // Создаём объект пользователя
      const user = {
        id: userId,
        phone: normalizedPhone,
        name: `User ${normalizedPhone.slice(-4)}`,
      }

      // Сохраняем в localStorage
      localStorage.setItem('auth_token', userId)
      localStorage.setItem('auth_user', JSON.stringify(user))

      // Редирект на страницу записи
      router.push('/record')
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вход в приложение</CardTitle>
            <CardDescription>
              Введите номер телефона для входа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              {loading ? 'Вход...' : 'Войти'}
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
