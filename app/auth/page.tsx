'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Shield } from 'lucide-react'

export default function AuthPage() {
  const [step, setStep] = useState<'consent' | 'otp'>('consent')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConsent = () => {
    setStep('otp')
  }

  const handleOtpRequest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      
      if (response.ok) {
        // OTP отправлен
        alert('OTP код отправлен! Для демо используйте: 1234')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      
      if (response.ok) {
        const data = await response.json()
        // Сохраняем токен и редиректим
        localStorage.setItem('token', data.token)
        window.location.href = '/record'
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'consent') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Добро пожаловать!</CardTitle>
              <CardDescription>
                ScooterWatch - платформа для фиксации нарушений самокатчиков
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вход по OTP</CardTitle>
            <CardDescription>
              Введите номер телефона для получения кода
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
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleOtpRequest} 
              disabled={!phone || loading}
              className="w-full"
            >
              {loading ? 'Отправка...' : 'Отправить код'}
            </Button>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                OTP код
              </label>
              <Input
                type="text"
                placeholder="1234"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Демо код: 1234
              </p>
            </div>
            
            <Button 
              onClick={handleOtpVerify} 
              disabled={!phone || loading}
              className="w-full"
            >
              {loading ? 'Проверка...' : 'Войти'}
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
