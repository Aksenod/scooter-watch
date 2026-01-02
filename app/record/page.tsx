'use client'

import { type ChangeEvent, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/shared/ui'
import { Upload, CheckCircle, Image as ImageIcon, Sparkles, ArrowRight, Lightbulb, RotateCcw, ChevronDown } from 'lucide-react'
import { BottomNav } from '@/shared/components/layout'
import {
  CameraFab,
  ConfidenceBadge,
  ConfidenceMeter,
} from '@/features/recording'

const VIOLATION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'sidewalk', label: 'Езда по тротуару' },
  { value: 'wrongparking', label: 'Неправильная парковка' },
  { value: 'trafficviolation', label: 'Нарушение ПДД (проезд/перестроение)' },
  { value: 'helmetmissing', label: 'Без шлема' },
  { value: 'double_riding', label: 'Езда вдвоём' },
  { value: 'crosswalk', label: 'Езда по пешеходному переходу' },
  { value: 'red_light', label: 'Проезд на красный' },
  { value: 'phone_use', label: 'Телефон в руках во время движения' },
  { value: 'other', label: 'Другое' },
]

export default function RecordPage() {
  const router = useRouter()
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [uploadedEvidenceUrl, setUploadedEvidenceUrl] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<any>(null)
  const [selectedViolationType, setSelectedViolationType] = useState<string>('sidewalk')
  const [isUploading, setIsUploading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tipsOpen, setTipsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (aiResult?.violationType) {
      const next = String(aiResult.violationType)
      const exists = VIOLATION_OPTIONS.some((o) => o.value === next)
      setSelectedViolationType(exists ? next : 'other')
    }
  }, [aiResult])

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
    setUploadedEvidenceUrl(null)
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
      setUploadedEvidenceUrl(mockPhotoUrl)

      setIsClassifying(true)
      const reader = new FileReader()

      const imageData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(photoFile)
      })

      const aiData = await apiService.classifyReport(imageData)

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
    setError(null)
    if (!aiResult?.confidence || !uploadedEvidenceUrl) {
      setError('Сначала сделайте фото и запустите AI-анализ')
      return
    }

    setIsSubmittingReport(true)
    try {
      const { apiService } = await import('@/lib/services/api')
      await apiService.createReport({
        violationType: selectedViolationType,
        confidence: Number(aiResult.confidence) || 0,
        coordinates: '55.7558,37.6173',
        evidenceUrl: uploadedEvidenceUrl,
      })
      router.push('/history')
    } catch (e) {
      console.error('Create report error:', e)
      setError('Не удалось отправить отчёт. Попробуйте ещё раз.')
    } finally {
      setIsSubmittingReport(false)
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface/30 pb-28">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground font-medium">Новый отчёт</p>
          <h1 className="text-2xl font-bold mt-1">Снять нарушение</h1>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onSelectPhoto}
        />

        {/* Photo Preview */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div
            className="relative flex items-center justify-center bg-surface"
            style={{ aspectRatio: '4/3' }}
          >
            {photoPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreviewUrl} alt="Фото нарушения" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-foreground">Сделайте фото</p>
                <p className="text-sm mt-1">Нажмите кнопку камеры ниже</p>
              </div>
            )}

            {aiResult?.confidence != null && (
              <div className="absolute right-3 top-3">
                <ConfidenceBadge confidence={aiResult.confidence} />
              </div>
            )}

            {(isUploading || isClassifying) && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  {isClassifying ? (
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  ) : (
                    <Upload className="w-6 h-6 text-primary animate-bounce" />
                  )}
                </div>
                <p className="font-medium">{isClassifying ? 'AI анализирует...' : 'Загрузка...'}</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-center gap-3">
              <CameraFab onClick={openCamera} disabled={isUploading || isClassifying} />
              {photoFile && !aiResult && (
                <Button onClick={uploadPhoto} disabled={isUploading} className="shadow-lg shadow-primary/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Анализировать
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setTipsOpen((v) => !v)}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-surface/30 transition-colors"
            aria-expanded={tipsOpen}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-warning" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Советы для успеха</h2>
                <p className="text-xs text-muted-foreground">Как увеличить шанс подтверждения</p>
              </div>
            </div>
            <ChevronDown className={tipsOpen ? 'w-4 h-4 text-muted-foreground transition-transform rotate-180' : 'w-4 h-4 text-muted-foreground transition-transform'} />
          </button>

          {tipsOpen ? (
            <div className="p-4 pt-0">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 mt-0.5">1</span>
                  <span>Захватите нарушение и контекст (тротуар/дорога)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 mt-0.5">2</span>
                  <span>Держите кадр ровно и без зума</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0 mt-0.5">3</span>
                  <span>Не снимайте лица крупным планом</span>
                </div>
              </div>
              <Link href="/tips" className="block mt-3">
                <Button variant="outline" size="sm" className="w-full">
                  Все советы
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </Link>
            </div>
          ) : null}
        </div>

        {/* AI Result */}
        {aiResult && (
          <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">AI анализ завершён</h3>
                <p className="text-sm text-muted-foreground">Готово к отправке</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="rounded-xl bg-card p-3">
                <p className="text-xs text-muted-foreground mb-2">Тип нарушения (можно поправить)</p>
                <select
                  value={selectedViolationType}
                  onChange={(e) => setSelectedViolationType(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  {VIOLATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl bg-card p-3">
                <p className="text-xs text-muted-foreground mb-2">Уверенность AI</p>
                <ConfidenceMeter confidence={aiResult.confidence} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={submitReport} disabled={isSubmittingReport} className="flex-1 shadow-lg shadow-primary/20">
                {isSubmittingReport ? 'Отправка...' : 'Отправить отчёт'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
