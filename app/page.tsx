import Link from 'next/link'
import { Camera, Shield, Coins, Users } from 'lucide-react'
import { Button } from '@/shared/ui'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            ScooterWatch
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            AI-powered платформа для фиксации нарушений самокатчиков
          </p>
          <p className="text-lg text-muted-foreground mb-12">
            Снимайте нарушения → AI классифицирует → Получайте вознаграждение
          </p>
          
          <Link 
            href="/auth"
            className="inline-flex"
          >
            <Button size="lg" className="text-lg">
              <Camera className="w-6 h-6 mr-2" />
              Начать
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Снимите нарушение</h3>
              <p className="text-muted-foreground">
                Запишите видео нарушения на камеру телефона
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI анализ</h3>
              <p className="text-muted-foreground">
                Искусственный интеллект классифицирует тип нарушения
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Получите награду</h3>
              <p className="text-muted-foreground">
                20% от штрафа за подтвержденное нарушение
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Присоединяйтесь к сообществу</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Пользователей</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">5000+</div>
              <div className="text-muted-foreground">Зафиксированных нарушений</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-warning mb-2">₽500K+</div>
              <div className="text-muted-foreground">Выплачено вознаграждений</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Сделайте город безопаснее вместе с нами
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Каждый отчет помогает улучшить городскую мобильность
          </p>
          
          <Link 
            href="/auth"
            className="inline-flex"
          >
            <Button size="lg" variant="secondary" className="text-lg">
              <Users className="w-6 h-6 mr-2" />
              Присоединиться
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
