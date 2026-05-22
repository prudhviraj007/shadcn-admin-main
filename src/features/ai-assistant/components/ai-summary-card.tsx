import { Bot, FileText, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { aiSummaries as fallbackSummaries } from '../data/ai-assistant'
import { type AiSummary } from '../types'

type AiSummaryCardProps = {
  summaries?: AiSummary[]
  isLoading?: boolean
}

export function AiSummaryCard({ summaries, isLoading }: AiSummaryCardProps) {
  const items = summaries ?? fallbackSummaries
  return (
    <Card>
      <CardHeader className='flex flex-row items-center gap-2 border-b py-3'>
        <FileText className='size-4 text-primary' />
        <CardTitle className='text-sm font-medium'>AI Generated Summaries</CardTitle>
        <Badge variant='outline' className='ml-auto text-[10px]'>Auto-generated</Badge>
      </CardHeader>
      <CardContent className='space-y-3 p-4'>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='size-5 animate-spin text-muted-foreground' />
          </div>
        ) : (
          items.map((summary) => (
          <div key={summary.id} className='rounded-lg border bg-card p-3 transition hover:shadow-sm'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Bot className='size-3.5 text-primary' />
                <span className='text-sm font-medium'>{summary.patient}</span>
              </div>
              <span className='text-[10px] text-muted-foreground'>{summary.periodStart} – {summary.periodEnd}</span>
            </div>
            <Separator className='my-2' />
            <ul className='space-y-1'>
              {summary.keyPoints.map((point, i) => (
                <li key={i} className='flex items-start gap-1.5 text-xs text-muted-foreground'>
                  <span className='mt-0.5 block size-1 shrink-0 rounded-full bg-primary' />
                  {point}
                </li>
              ))}
            </ul>
            <div className='mt-2 rounded-md bg-primary/5 px-2 py-1.5 text-xs'>
              <span className='font-medium text-primary'>AI recommendation: </span>
              {summary.recommendation}
            </div>
            <p className='mt-1.5 text-[10px] text-muted-foreground'>Generated at {summary.generatedAt}</p>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
