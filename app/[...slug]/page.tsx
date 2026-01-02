'use client'

import Link from 'next/link'
import { Button, Card, CardContent } from '@/shared/ui'
import { BottomNav } from '@/shared/components/layout'

export default function CatchAllStubPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-bold mb-2">Функционал в разработке</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Эта страница пока недоступна. Мы скоро добавим её в приложение.
            </p>
            <Link href="/">
              <Button className="w-full">На главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
