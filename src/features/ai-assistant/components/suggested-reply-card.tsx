import { Sparkles, ThumbsUp, Copy, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { aiSuggestions as fallbackSuggestions } from '../data/ai-assistant'
import { type AiSuggestion } from '../types'

const categoryColors: Record<string, string> = {
  medication: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  symptom: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  'follow-up': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  scheduling: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
}

type SuggestedReplyCardProps = {
  suggestions?: AiSuggestion[]
  isLoading?: boolean
}

export function SuggestedReplyCard({ suggestions, isLoading }: SuggestedReplyCardProps) {
  const items = suggestions ?? fallbackSuggestions
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='flex flex-row items-center gap-2 border-b py-3'>
        <Sparkles className='size-4 text-primary' />
        <CardTitle className='text-sm font-medium'>AI Suggested Replies</CardTitle>
        <Badge variant='outline' className='ml-auto text-[10px]'>{items.length} suggestions</Badge>
      </CardHeader>
      <CardContent className='flex-1 p-0'>
        <ScrollArea className='h-full'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='size-5 animate-spin text-muted-foreground' />
            </div>
          ) : (
          <div className='space-y-2 p-4'>
            {items.map((suggestion) => (
              <div key={suggestion.id} className='rounded-lg border bg-card p-3 transition hover:shadow-sm'>
                <div className='flex items-center justify-between gap-2'>
                  <Badge variant='outline' className={`text-[10px] ${categoryColors[suggestion.category] || ''}`}>
                    {suggestion.category}
                  </Badge>
                  <span className='text-[10px] text-muted-foreground'>{suggestion.confidence}% confidence</span>
                </div>
                <p className='mt-1.5 text-xs text-muted-foreground'>{suggestion.context}</p>
                <p className='mt-1 text-sm leading-relaxed'>{suggestion.reply}</p>
                <div className='mt-2 flex items-center gap-1'>
                  <Button variant='ghost' size='sm' className='h-7 gap-1 text-[10px] px-2'>
                    <ThumbsUp className='size-3' />
                    Accept
                  </Button>
                  <Button variant='ghost' size='sm' className='h-7 gap-1 text-[10px] px-2'>
                    <Copy className='size-3' />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
