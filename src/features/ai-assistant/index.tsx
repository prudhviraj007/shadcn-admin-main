export { AiSettingsPage } from './components/ai-settings-page'
export { useAiSettingsStore } from './store'
export { useAiSettings } from './hooks'
export { mockAiAssistantSettings, supportedLanguageOptions } from './mock-data'
export { getAiAssistantSettings } from './services'
export type {
  AiAssistantSettings,
  ClinicFaq,
  ClinicTimingSettings,
  ChatMessage,
  ChatSession,
  UrgencyLevel,
  UrgentSymptom,
  AiSuggestion,
  ActivityType,
  AiActivity,
  QuickAction,
  AiSummary,
  AiMetric,
} from './types'

import { useEffect, useState } from 'react'
import { BotMessageSquare, Lightbulb, Timer, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { metrics } from './data/ai-assistant'
import { getConversationSummary, detectUrgentSymptoms, getAiSuggestions } from '@/lib/ai'
import type { AiSummary, UrgentSymptom, AiSuggestion } from './types'
import { AiChatPanel } from './components/ai-chat-panel'
import { AiSummaryCard } from './components/ai-summary-card'
import { SymptomCards } from './components/symptom-cards'
import { SuggestedReplyCard } from './components/suggested-reply-card'
import { AiTimeline } from './components/ai-timeline'
import { QuickActionCards } from './components/quick-action-cards'

const metricIcons: Record<string, React.ElementType> = {
  BotMessageSquare,
  AlertTriangle,
  Lightbulb,
  Timer,
}

export function AiAssistantDashboard() {
  const [summaries, setSummaries] = useState<AiSummary[]>([])
  const [symptoms, setSymptoms] = useState<UrgentSymptom[]>([])
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [summariesResult, suggestionsResult, symptomText] = await Promise.all([
          getConversationSummary([]),
          getAiSuggestions(),
          Promise.resolve('Patient mentioned chest pain and shortness of breath after physical activity. Also reports intermittent dizziness.'),
        ])
        setSummaries([summariesResult])
        setSuggestions(suggestionsResult)
        const symptomsResult = await detectUrgentSymptoms(symptomText)
        setSymptoms(symptomsResult)
      } catch {
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <NotificationBell />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>AI Assistant</h1>
            <p className='text-sm text-muted-foreground'>
              AI-powered clinical decision support, symptom triage, and patient communication assistance.
            </p>
          </div>
        </div>

        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {metrics.map((m) => {
            const Icon = metricIcons[m.iconName]
            return (
              <Card key={m.title}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>{m.title}</CardTitle>
                  {Icon && <Icon className='size-4 text-muted-foreground' />}
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{m.value}</div>
                  <p className={`text-xs ${m.changeType === 'positive' ? 'text-emerald-600' : m.changeType === 'negative' ? 'text-rose-600' : 'text-muted-foreground'}`}>
                    {m.change}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className='grid gap-4 xl:grid-cols-7'>
          <div className='xl:col-span-4 max-xl:order-1'>
            <AiChatPanel />
          </div>
          <div className='xl:col-span-3 max-xl:order-2'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1'>
              <QuickActionCards />
              <AiSummaryCard summaries={summaries} isLoading={isLoading && summaries.length === 0} />
            </div>
          </div>
        </section>

        <section className='grid gap-4 lg:grid-cols-2'>
          <SuggestedReplyCard suggestions={suggestions} isLoading={isLoading && suggestions.length === 0} />
          <SymptomCards symptoms={symptoms} isLoading={isLoading && symptoms.length === 0} />
        </section>

        <section className='grid gap-4 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <AiTimeline />
          </div>
          <div className='rounded-lg border bg-card p-6'>
            <div className='flex flex-col items-center text-center'>
              <span className='text-5xl font-bold text-primary'>94%</span>
              <span className='mt-1 text-sm text-muted-foreground'>AI Suggestion Acceptance Rate</span>
              <div className='mt-4 grid w-full grid-cols-3 gap-2'>
                <div className='rounded-md bg-muted/50 p-2'>
                  <p className='text-sm font-semibold'>1,248</p>
                  <p className='text-[10px] text-muted-foreground'>Total</p>
                </div>
                <div className='rounded-md bg-emerald-50 p-2 dark:bg-emerald-950'>
                  <p className='text-sm font-semibold text-emerald-600'>1,173</p>
                  <p className='text-[10px] text-muted-foreground'>Accepted</p>
                </div>
                <div className='rounded-md bg-amber-50 p-2 dark:bg-amber-950'>
                  <p className='text-sm font-semibold text-amber-600'>75</p>
                  <p className='text-[10px] text-muted-foreground'>Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Main>
    </>
  )
}
