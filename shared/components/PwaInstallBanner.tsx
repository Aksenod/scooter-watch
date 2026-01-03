'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/shared/ui'
import { MoreVertical, Share, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const STORAGE_KEYS = {
  AFTER_LOGIN: 'sw_pwa_install_after_login',
  DISMISSED_UNTIL: 'sw_pwa_install_dismissed_until',
  NEVER: 'sw_pwa_install_never',
} as const

function isStandalone() {
  if (typeof window === 'undefined') return false

  const standaloneMedia = window.matchMedia?.('(display-mode: standalone)').matches
  const iOSStandalone = (navigator as any)?.standalone
  return Boolean(standaloneMedia || iOSStandalone)
}

function isIOS() {
  if (typeof window === 'undefined') return false

  const ua = window.navigator.userAgent || ''
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua)
  const isIpadOS = window.navigator.platform === 'MacIntel' && (window.navigator as any).maxTouchPoints > 1
  return isIOSDevice || isIpadOS
}

function isMobile() {
  if (typeof window === 'undefined') return false

  const ua = window.navigator.userAgent || ''
  const isLikelyMobileUA = /Android|iPhone|iPad|iPod/i.test(ua)
  const isSmallScreen = window.matchMedia?.('(max-width: 768px)').matches
  return Boolean(isLikelyMobileUA || isSmallScreen)
}

export function PwaInstallBanner() {
  const [visible, setVisible] = useState(false)
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [showAndroidGuide, setShowAndroidGuide] = useState(false)

  const platform = useMemo(() => {
    return {
      isIOS: isIOS(),
      isMobile: isMobile(),
      isStandalone: isStandalone(),
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!platform.isMobile) return
    if (platform.isStandalone) return

    const shouldShowAfterLogin = localStorage.getItem(STORAGE_KEYS.AFTER_LOGIN) === '1'
    if (!shouldShowAfterLogin) return

    const never = localStorage.getItem(STORAGE_KEYS.NEVER) === '1'
    if (never) return

    const dismissedUntilRaw = localStorage.getItem(STORAGE_KEYS.DISMISSED_UNTIL)
    const dismissedUntil = dismissedUntilRaw ? Number(dismissedUntilRaw) : 0
    if (dismissedUntil && Date.now() < dismissedUntil) return

    const t = window.setTimeout(() => {
      localStorage.removeItem(STORAGE_KEYS.AFTER_LOGIN)
      setVisible(true)
    }, 900)
    return () => window.clearTimeout(t)
  }, [platform.isMobile, platform.isStandalone])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (e: Event) => {
      const be = e as BeforeInstallPromptEvent
      be.preventDefault()
      setPromptEvent(be)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const markDismissed = useCallback((days: number) => {
    if (typeof window === 'undefined') return

    const until = Date.now() + days * 24 * 60 * 60 * 1000
    localStorage.setItem(STORAGE_KEYS.DISMISSED_UNTIL, String(until))
    localStorage.removeItem(STORAGE_KEYS.AFTER_LOGIN)
  }, [])

  const closeAll = useCallback((dismissDays: number) => {
    setVisible(false)
    setShowIOSGuide(false)
    setShowAndroidGuide(false)
    if (dismissDays > 0) markDismissed(dismissDays)
  }, [markDismissed])

  const onAddClick = useCallback(async () => {
    if (typeof window === 'undefined') return

    localStorage.removeItem(STORAGE_KEYS.AFTER_LOGIN)

    if (platform.isIOS) {
      setShowIOSGuide(true)
      return
    }

    if (promptEvent) {
      try {
        await promptEvent.prompt()
        const choice = await promptEvent.userChoice
        setPromptEvent(null)
        setVisible(false)

        if (choice.outcome === 'accepted') {
          localStorage.setItem(STORAGE_KEYS.NEVER, '1')
          return
        }

        markDismissed(7)
      } catch {
        markDismissed(7)
      }
      return
    }

    setShowAndroidGuide(true)
  }, [markDismissed, platform.isIOS, promptEvent])

  if (!visible) {
    return null
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Открывайте в один тап</p>
            <p className="text-xs text-muted-foreground mt-1">
              Добавьте ScooterWatch на главный экран — будет быстрее, как приложение.
            </p>
          </div>

          <button
            type="button"
            onClick={() => closeAll(7)}
            aria-label="Закрыть"
            className="shrink-0 rounded-lg p-2 hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button onClick={onAddClick} className="flex-1">
            Добавить на экран
          </Button>
          <Button variant="outline" onClick={() => closeAll(7)}>
            Позже
          </Button>
        </div>
      </div>

      {showIOSGuide ? (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold">Добавьте на главный экран</p>
                <p className="text-sm text-muted-foreground mt-1">В Safari это делается так:</p>
              </div>
              <button
                type="button"
                onClick={() => closeAll(7)}
                aria-label="Закрыть"
                className="shrink-0 rounded-lg p-2 hover:bg-surface-2 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Нажмите «Поделиться»</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Иконка квадрата со стрелкой вверх</p>
                </div>
                <Share className="w-4 h-4 text-muted-foreground mt-1" />
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Выберите «На экран “Домой”»</p>
                  <p className="text-xs text-muted-foreground mt-0.5">И подтвердите добавление</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button onClick={() => closeAll(7)} className="w-full">
                Понятно
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {showAndroidGuide ? (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold">Установите как приложение</p>
                <p className="text-sm text-muted-foreground mt-1">Если кнопка установки не появилась:</p>
              </div>
              <button
                type="button"
                onClick={() => closeAll(7)}
                aria-label="Закрыть"
                className="shrink-0 rounded-lg p-2 hover:bg-surface-2 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Откройте меню браузера</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Три точки в правом верхнем углу</p>
                </div>
                <MoreVertical className="w-4 h-4 text-muted-foreground mt-1" />
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Выберите «Установить приложение»</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Или «Добавить на главный экран»</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button onClick={() => closeAll(7)} className="w-full">
                Понятно
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
