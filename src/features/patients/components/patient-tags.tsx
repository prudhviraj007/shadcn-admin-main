import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { patientTags } from '../data/data'

type PatientTagsProps = {
  tags: string[]
  className?: string
}

export function PatientTags({ tags, className }: PatientTagsProps) {
  if (!tags?.length) return null

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tagValue) => {
        const tag = patientTags.find((t) => t.value === tagValue)
        if (!tag) return null
        return (
          <Badge key={tagValue} variant='outline' className={cn('text-xs', tag.color)}>
            {tag.label}
          </Badge>
        )
      })}
    </div>
  )
}
