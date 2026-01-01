import { Badge } from '@/components/ui/badge'

type ConfidenceBadgeProps = {
  confidence: number
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const safe = Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0
  const percent = Math.round(safe * 100)

  const variant = percent >= 85 ? 'success' : percent >= 70 ? 'warning' : 'destructive'

  return (
    <Badge variant={variant} className="backdrop-blur">
      {percent}%
    </Badge>
  )
}
