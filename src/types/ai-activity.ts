import {
  type ActivityType,
  type UrgencyLevel,
  type Priority,
} from './enums'

export type AiActivity = {
  id: string
  type: ActivityType
  title: string
  description: string
  patient: string
  patientId?: string
  timestamp: string
}

export type UrgentSymptom = {
  id: string
  symptom: string
  patient: string
  patientId?: string
  description: string
  detectedAt: string
  urgency: UrgencyLevel
  suggestedAction: string
}

export type AiSuggestion = {
  id: string
  context: string
  contextPatient?: string
  reply: string
  category: string
  priority: Priority
  confidence: number
}

export type AiSummary = {
  id: string
  patient: string
  patientId?: string
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
