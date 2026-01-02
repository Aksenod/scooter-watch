'use client'

import { type ChangeEvent, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui'
import { Upload, CheckCircle, Image as ImageIcon } from 'lucide-react'
import { BottomNav } from '@/shared/components/layout'
import {
  CameraFab,
  ConfidenceBadge,
  ConfidenceMeter,
  RewardProgress,
  StatusCard,
} from '@/features/recording'

export default function RecordPage() {
  const router = useRouter()
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Проверка авторизации при загрузке страницы
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.push('/auth')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const openCamera = () => {
    fileInputRef.current?.click()
  }

  const onSelectPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    setError(null)
    setAiResult(null)
    setPhotoFile(file)
    setPhotoPreviewUrl(URL.createObjectURL(file))
  }

  const uploadPhoto = async () => {
    if (!photoFile) return

    setIsUploading(true)
    try {

      const { apiService } = await import('@/lib/services/api')

      // Mock upload - в реальном приложении загружаем в Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 800))

      const mockPhotoUrl = `https://mock-storage.com/photo_${Date.now()}.jpg`

      // Запускаем AI классификацию
      setIsClassifying(true)
      const reader = new FileReader()

      const imageData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(photoFile)
      })

      const aiData = await apiService.classifyReport(imageData)

      // Создаем отчет с результатами AI
      await apiService.createReport({
        violationType: aiData.violationType,
        confidence: aiData.confidence,
        coordinates: '55.7558,37.6173',
        evidenceUrl: mockPhotoUrl
      })

      setAiResult(aiData)
    } catch (error) {
      console.error('Error:', error)
      setError('Ошибка загрузки. Проверьте подключение к API.')
    } finally {
      setIsUploading(false)
      setIsClassifying(false)
    }
  }

  const submitReport = async () => {
    router.push('/history')
  }

  // Показываем загрузку пока проверяем авторизацию
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Фото нарушения</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Сделайте фото и отправьте его на AI-анализ
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Советы по съёмке</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>Старайся захватить нарушение и контекст (тротуар/дорога)</div>
            <div>Держи кадр ровно и без зума</div>
            <div>Не снимай лица крупным планом</div>
            <Link href="/tips" className="block pt-2">
              <Button variant="outline" className="w-full">Подробнее</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <RewardProgress current={420} target={1000} />
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onSelectPhoto}
        />

        {/* Photo Preview */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div
              className="relative rounded-lg overflow-hidden flex items-center justify-center bg-surface"
              style={{ aspectRatio: '16/9' }}
            >
              {photoPreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreviewUrl} alt="Фото нарушения" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                  <div className="text-sm">Сделайте фото нарушения</div>
                </div>
              )}

              {aiResult?.confidence != null ? (
                <div className="absolute right-3 top-3">
                  <ConfidenceBadge confidence={aiResult.confidence} />
                </div>
              ) : null}
            </div>

            <div className="flex justify-center mt-4">
              <CameraFab onClick={openCamera} disabled={isUploading || isClassifying} />
            </div>
          </CardContent>
        </Card>

        {/* AI Result */}
        {aiResult && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-success" />
                AI Анализ завершен
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Тип нарушения:</p>
                  <p className="font-semibold capitalize">{aiResult.violationType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Уверенность AI:</p>
                  <ConfidenceMeter confidence={aiResult.confidence} />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button onClick={submitReport} className="flex-1">
                  Отправить отчет
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Записать заново
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <Card className="mb-6">
            <CardContent className="p-4 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-primary animate-bounce" />
              <p>Загрузка фото...</p>
            </CardContent>
          </Card>
        )}

        {/* AI Classification Progress */}
        {isClassifying && (
          <Card className="mb-6">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p>AI анализирует фото...</p>
            </CardContent>
          </Card>
        )}

        {/* Selected Photo Actions */}
        {photoFile && !aiResult && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Button onClick={uploadPhoto} className="w-full" disabled={isUploading}>
                {isUploading ? 'Загрузка...' : 'Загрузить и анализировать'}
              </Button>
            </CardContent>
          </Card>
        )}

        {error ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <BottomNav />
    </div>
  )
}
