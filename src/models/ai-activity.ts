import { z } from 'zod'
import {
  ActivityTypeSchema,
  UrgencyLevelSchema,
  PrioritySchema,
  ChangeTypeSchema,
} from './enums'

/** A single entry in the AI activity feed */
export const AiActivitySchema = z.object({
  id: z.string(),
  type: ActivityTypeSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  patient: z.string().min(1, 'Patient name is required'),
  patientId: z.string().optional(),
  timestamp: z.string(),
})
export type AiActivity = z.infer<typeof AiActivitySchema>

/** Urgent symptom detected by AI triage */
export const UrgentSymptomSchema = z.object({
  id: z.string(),
  symptom: z.string().min(1, 'Symptom is required'),
  patient: z.string().min(1, 'Patient name is required'),
  patientId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  detectedAt: z.string(),
  urgency: UrgencyLevelSchema,
  suggestedAction: z.string().min(1, 'Suggested action is required'),
})
export type UrgentSymptom = z.infer<typeof UrgentSymptomSchema>

/** AI-generated reply suggestion */
export const AiSuggestionSchema = z.object({
  id: z.string(),
  context: z.string().min(1, 'Context is required'),
  contextPatient: z.string().optional(),
  reply: z.string().min(1, 'Reply text is required'),
  category: z.string().min(1, 'Category is required'),
  priority: PrioritySchema,
  confidence: z.number().min(0).max(1),
})
export type AiSuggestion = z.infer<typeof AiSuggestionSchema>

/** AI-generated conversation summary */
export const AiSummarySchema = z.object({
  id: z.string(),
  patient: z.string().min(1, 'Patient name is required'),
  patientId: z.string().optional(),
  periodStart: z.string(),
  periodEnd: z.string(),
  keyPoints: z.array(z.string()).min(1, 'At least one key point is required'),
  recommendation: z.string().min(1, 'Recommendation is required'),
  generatedAt: z.string(),
})
export type AiSummary = z.infer<typeof AiSummarySchema>

/** Dashboard metric card */
export const AiMetricSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.string().min(1, 'Value is required'),
  change: z.string().min(1, 'Change description is required'),
  changeType: ChangeTypeSchema,
  iconName: z.string().min(1, 'Icon name is required'),
})
export type AiMetric = z.infer<typeof AiMetricSchema>
