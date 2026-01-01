import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusTone = 'warning' | 'success' | 'destructive' | 'secondary'

type StatusCardProps = {
  title: string
  statusLabel: string
  statusTone: StatusTone
  rewardLabel?: string
  timeLabel?: string
  className?: string
}

export function StatusCard({
  title,
  statusLabel,
  statusTone,
  rewardLabel,
  timeLabel,
  className,
}: StatusCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={statusTone}>Статус: {statusLabel}</Badge>
              {rewardLabel ? <Badge variant="success">Награда: {rewardLabel}</Badge> : null}
            </div>
            {timeLabel ? (
              <div className="mt-2 text-xs text-muted-foreground">{timeLabel}</div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
