import { Bot, Loader2, Sparkles } from 'lucide-react'
import { useAppointmentSuggestions } from '@/hooks/use-ai'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function AppointmentAiSuggestions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='gap-2'>
          <Sparkles className='size-4' />
          AI Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Bot className='size-5 text-primary' />
            AI Appointment Suggestions
          </DialogTitle>
          <DialogDescription>
            Smart scheduling recommendations based on clinic availability and patient history.
          </DialogDescription>
        </DialogHeader>
        <SuggestionsList />
      </DialogContent>
    </Dialog>
  )
}

function SuggestionsList() {
  const { data: suggestions, isLoading, error } = useAppointmentSuggestions(
    'General consultation appointment for a returning patient with no urgent symptoms.'
  )

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='size-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return (
      <p className='py-8 text-center text-sm text-muted-foreground'>
        Unable to load suggestions. Try again later.
      </p>
    )
  }

  if (!suggestions?.length) {
    return (
      <p className='py-8 text-center text-sm text-muted-foreground'>
        No suggestions available for the current context.
      </p>
    )
  }

  return (
    <div className='space-y-2'>
      {suggestions.map((suggestion, i) => (
        <div
          key={i}
          className='flex items-start gap-3 rounded-lg border p-3 transition hover:bg-accent/50'
        >
          <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary'>
            {i + 1}
          </div>
          <p className='pt-1 text-sm'>{suggestion}</p>
        </div>
      ))}
    </div>
  )
}
