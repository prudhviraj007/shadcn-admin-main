import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { patientTags } from '../data/data'
import { usePatientMutations } from '../hooks/use-patients-queries'
import { type Patient } from '../data/schema'

type PatientsTagsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Patient
}

export function PatientsTagsDialog({
  open,
  onOpenChange,
  currentRow,
}: PatientsTagsDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentRow.tags ?? []
  )
  const { updateEntity } = usePatientMutations()
  const [isSaving, setIsSaving] = useState(false)

  const toggleTag = (tagValue: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagValue)
        ? prev.filter((t) => t !== tagValue)
        : [...prev, tagValue]
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateEntity.mutateAsync({
        ...currentRow,
        tags: selectedTags,
      })
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Assign tags to {currentRow.firstName} {currentRow.lastName} for
            better patient categorization.
          </DialogDescription>
        </DialogHeader>

        {selectedTags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {selectedTags.map((tagValue) => {
              const tag = patientTags.find((t) => t.value === tagValue)
              if (!tag) return null
              return (
                <Badge
                  key={tagValue}
                  variant='outline'
                  className={tag.color}
                >
                  {tag.label}
                  <button
                    onClick={() => toggleTag(tagValue)}
                    className='ms-1 rounded-full outline-none hover:opacity-70'
                  >
                    <X size={12} />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}

        <ScrollArea className='h-48'>
          <div className='flex flex-wrap gap-2'>
            {patientTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.value)
              return (
                <Badge
                  key={tag.value}
                  variant='outline'
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? tag.color + ' ring-2 ring-primary'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => toggleTag(tag.value)}
                >
                  {tag.label}
                </Badge>
              )
            })}
          </div>
        </ScrollArea>

        <DialogFooter className='gap-y-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className='gap-2'>
            {isSaving ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Saving...
              </>
            ) : (
              'Save Tags'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
