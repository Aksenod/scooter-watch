'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/shared/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'
import { ArrowLeft, CheckCircle2, Lightbulb, Shield, Target } from 'lucide-react'

export default function TipsPage() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/record">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">Инструкция</p>
            <h1 className="text-xl font-bold">Как снимать нарушения</h1>
          </div>
        </div>

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Чеклист
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
              <span>Снимайте так, чтобы было видно нарушение и самокат</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
              <span>Держите кадр 5–10 секунд без резких движений</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
              <span>Захватите ориентиры: улица, дом, перекрёсток</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
              <span>Не снимайте лица крупным планом</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
              <span>Если есть номер/бренд — покажите его в кадре</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              Что помогает модерации
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="p-3 rounded-xl bg-surface/50">Хорошее освещение и фокус</div>
            <div className="p-3 rounded-xl bg-surface/50">Виден контекст: тротуар/дорога/переход/парковка</div>
            <div className="p-3 rounded-xl bg-surface/50">Один тип нарушения — один отчёт</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-warning" />
              Чего избегать
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="p-3 rounded-xl bg-surface/50">Сильный зум и тряска</div>
            <div className="p-3 rounded-xl bg-surface/50">Слишком короткое видео/кадр</div>
            <div className="p-3 rounded-xl bg-surface/50">Съёмка в полной темноте</div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
