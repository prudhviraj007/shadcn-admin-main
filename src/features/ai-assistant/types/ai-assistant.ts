export type MessageAuthor = 'patient' | 'staff' | 'ai'

export type ChatMessage = {
  id: string
  author: MessageAuthor
  text: string
  time: string
}

export type ChatSession = {
  id: string
  patient: string
  avatar: string
  subtitle: string
  messages: ChatMessage[]
}

export type UrgencyLevel = 'critical' | 'moderate' | 'monitor'

export type UrgentSymptom = {
  id: string
  symptom: string
  patient: string
  description: string
  detectedAt: string
  urgency: UrgencyLevel
  suggestedAction: string
}

export type AiSuggestion = {
  id: string
  context: string
  reply: string
  category: string
  confidence: number
}

export type ActivityType = 'alert' | 'summary' | 'suggestion' | 'draft' | 'review'

export type AiActivity = {
  id: string
  type: ActivityType
  title: string
  description: string
  patient: string
  timestamp: string
}

export type QuickAction = {
  id: string
  title: string
  description: string
  iconName: string
  color: string
}

export type AiSummary = {
  id: string
  patient: string
  periodStart: string
  periodEnd: string
  keyPoints: string[]
  recommendation: string
  generatedAt: string
}

export type AiMetric = {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  iconName: string
}
