import { createFileRoute } from '@tanstack/react-router'
import { AiAssistantDashboard } from '@/features/ai-assistant'

export const Route = createFileRoute('/_authenticated/ai-assistant/')({
  component: AiAssistantDashboard,
})
