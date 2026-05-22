import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { statusColors, statusLabels } from '../data/data'
import { type ConversationStatus } from '../types/conversation'

type StatusBadgeProps = {
  status: ConversationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant='outline' className={cn(statusColors[status], className)}>
      {statusLabels[status]}
    </Badge>
  )
}
