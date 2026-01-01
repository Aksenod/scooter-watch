'use client'

import { type ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, CheckCircle, Image as ImageIcon } from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'
import { CameraFab } from '@/components/record/CameraFab'
import { ConfidenceBadge } from '@/components/record/ConfidenceBadge'
import { ConfidenceMeter } from '@/components/record/ConfidenceMeter'
import { RewardProgress } from '@/components/record/RewardProgress'
import { StatusCard } from '@/components/record/StatusCard'

export default function RecordPage() {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openCamera = () => {
    fileInputRef.current?.click()
  }

  const onSelectPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    setAiResult(null)
    setPhotoFile(file)
    setPhotoPreviewUrl(URL.createObjectURL(file))
  }

  const uploadPhoto = async () => {
    if (!photoFile) return

    setIsUploading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Сначала войдите по номеру телефона')
        window.location.href = '/auth'
        return
      }

      // Mock upload - в реальном приложении загружаем в Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 800))

      const mockPhotoUrl = `https://mock-storage.com/photo_${Date.now()}.jpg`
      
      // Создаем отчет
      const reportResponse = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          photoUrl: mockPhotoUrl,
          latitude: 55.7558,
          longitude: 37.6173
        }),
      })

      if (reportResponse.ok) {
        const reportData = await reportResponse.json()
        
        // Запускаем AI классификацию
        setIsClassifying(true)
        const classifyResponse = await fetch('/api/reports/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ 
            reportId: reportData.reportId,
            photoUrl: mockPhotoUrl
          }),
        })

        if (classifyResponse.ok) {
          const aiData = await classifyResponse.json()
          setAiResult(aiData)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsUploading(false)
      setIsClassifying(false)
    }
  }

  const submitReport = async () => {
    // В реальном приложении обновляем статус отчета
    alert('Отчет успешно отправлен!')
    window.location.href = '/history'
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Фото нарушения</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Сделайте фото и отправьте его на AI-анализ
          </p>
        </div>

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

        {aiResult ? (
          <div className="mb-6">
            <StatusCard
              title="🚫 Парковка на тротуаре"
              statusLabel="На модерации"
              statusTone="warning"
              rewardLabel="₽200"
              timeLabel="2 дня назад"
            />
          </div>
        ) : null}

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
      </div>

      <BottomNav />
    </div>
  )
}
