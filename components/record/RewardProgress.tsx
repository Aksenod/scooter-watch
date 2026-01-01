import { cn } from '@/lib/utils'

type RewardProgressProps = {
  current: number
  target: number
  className?: string
}

export function RewardProgress({ current, target, className }: RewardProgressProps) {
  const safeTarget = target > 0 ? target : 1
  const safeCurrent = Math.max(0, current)
  const pct = Math.max(0, Math.min(100, Math.round((safeCurrent / safeTarget) * 100)))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-sm text-muted-foreground">
        <span className="font-medium tabular-nums text-foreground">{pct}%</span> до{' '}
        <span className="font-semibold tabular-nums text-foreground">₽{target.toLocaleString('ru-RU')}</span>
      </div>
    </div>
  )
}
