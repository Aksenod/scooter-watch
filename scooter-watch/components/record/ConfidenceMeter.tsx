import { cn } from '@/lib/utils'

type ConfidenceMeterProps = {
  confidence: number
  className?: string
}

export function ConfidenceMeter({ confidence, className }: ConfidenceMeterProps) {
  const safe = Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0
  const percent = Math.round(safe * 100)

  const tone = percent >= 85 ? 'success' : percent >= 70 ? 'warning' : 'destructive'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn(
            'h-2 rounded-full',
            tone === 'success' && 'bg-success',
            tone === 'warning' && 'bg-warning',
            tone === 'destructive' && 'bg-destructive'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-11 text-right text-sm font-medium tabular-nums">{percent}%</span>
    </div>
  )
}
