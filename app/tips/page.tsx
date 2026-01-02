'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'

export default function TipsPage() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Как снимать нарушения</h1>
          <Link href="/record">
            <Button variant="outline" size="sm">К записи</Button>
          </Link>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Чеклист</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>1. Снимай так, чтобы было видно нарушение и самокат</div>
            <div>2. Держи кадр 5–10 секунд без резких движений</div>
            <div>3. Старайся захватить ориентиры (улица/дом/перекрёсток)</div>
            <div>4. Не снимай лица крупным планом</div>
            <div>5. Если есть номер самоката/бренд — покажи в кадре</div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Что помогает модерации</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>- Хорошее освещение и фокус</div>
            <div>- Видно контекст: тротуар/дорога/переход/парковка</div>
            <div>- Один тип нарушения на один отчёт</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Чего избегать</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>- Сильный зум и тряска</div>
            <div>- Слишком короткое видео/кадр</div>
            <div>- Съёмка в полной темноте</div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
