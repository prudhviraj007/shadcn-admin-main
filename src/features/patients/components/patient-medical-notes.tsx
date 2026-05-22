import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { noteTypes, noteTypeColors } from '../data/data'
import { type MedicalNote, type NoteType } from '../data/schema'
import { PatientNotesDialog } from './patient-notes-dialog'

type PatientMedicalNotesProps = {
  notes: MedicalNote[]
  patientId: string
}

export function PatientMedicalNotes({
  notes,
  patientId,
}: PatientMedicalNotesProps) {
  const [showAddNote, setShowAddNote] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <FileText size={18} />
              Medical Notes ({notes.length})
            </CardTitle>
            <Button size='sm' onClick={() => setShowAddNote(true)}>
              <Plus size={16} className='me-1' />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className='text-sm text-muted-foreground py-4 text-center'>
              No medical notes recorded yet.
            </p>
          ) : (
            <ScrollArea className='max-h-96'>
              <div className='space-y-3'>
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className='rounded-lg border p-4 transition-colors hover:bg-muted/50'
                  >
                    <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-sm'>
                          {note.title}
                        </span>
                        <Badge
                          variant='outline'
                          className={cn(
                            'text-xs',
                            noteTypeColors[note.type as NoteType]
                          )}
                        >
                          {noteTypes.find((nt) => nt.value === note.type)
                            ?.label ?? note.type}
                        </Badge>
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {note.createdAt}
                      </span>
                    </div>
                    <p className='mb-2 text-sm text-muted-foreground'>
                      {note.content}
                    </p>
                    <div className='text-xs text-muted-foreground'>
                      By {note.createdBy}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <PatientNotesDialog
        open={showAddNote}
        onOpenChange={setShowAddNote}
        patientId={patientId}
      />
    </>
  )
}
