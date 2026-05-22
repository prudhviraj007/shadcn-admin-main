import { getFaker } from './faker'
import type {
  AiActivity,
  UrgentSymptom,
  AiSuggestion,
  AiSummary,
  AiMetric,
} from '@/models'

const activityTitles: Record<string, string[]> = {
  alert: ['Urgent symptom detected', 'Medication interaction flagged', 'Abnormal lab result', 'Critical vital sign alert'],
  summary: ['AI summary generated', 'Overnight report ready', 'Weekly patient roundup', 'Department summary'],
  suggestion: ['Reply suggestion accepted', 'AI triage recommendation', 'Treatment suggestion', 'Follow-up reminder'],
  draft: ['AI draft completed', 'Auto-generated response', 'Discharge summary draft', 'Referral letter draft'],
  review: ['Staff reviewed AI draft', 'Physician signed off', 'Nurse approved suggestion', 'Care plan updated'],
}

const symptomNames = [
  'Chest tightness & shortness of breath',
  'Severe headache & vision changes',
  'Post-op wound redness & drainage',
  'Unexplained weight gain',
  'New medication rash',
  'Persistent cough & fever',
  'Abdominal pain & nausea',
  'Dizziness & fainting spells',
  'Joint swelling & stiffness',
  'Numbness in extremities',
]

const criticalActions = [
  'Immediate triage — dispatch EMS. Notify attending cardiologist.',
  'Advise ED evaluation. Notify physician stat.',
  'Urgent consult required. Activate rapid response team.',
]

const moderateActions = [
  'Schedule same-day evaluation. Consider starting empiric treatment.',
  'Order diagnostic workup. Review within 4 hours.',
  'Arrange specialist referral. Monitor symptoms closely.',
]

const monitorActions = [
  'Observe for progression. Schedule follow-up in 48 hours.',
  'Start symptomatic treatment. Educate patient on warning signs.',
  'Consider change in medication. Reassess in 1 week.',
]

const relativeTimes = ['Just now', '2 mins ago', '8 mins ago', '18 mins ago', '35 mins ago', '1h ago'] as const
const suggestionCategories = ['medication', 'symptom', 'follow-up', 'scheduling', 'lab', 'referral'] as const

export function generateAiActivity(seed?: number): AiActivity {
  const f = getFaker(seed)
  const type = f.helpers.arrayElement(['alert', 'summary', 'suggestion', 'draft', 'review'] as const)
  const title = f.helpers.arrayElement(activityTitles[type])

  return {
    id: `act-${f.string.numeric(3)}`,
    type,
    title,
    description: f.lorem.sentence({ min: 8, max: 20 }),
    patient: `${f.person.firstName()} ${f.person.lastName()}`,
    patientId: `PAT-${f.string.numeric(4)}`,
    timestamp: f.helpers.arrayElement(relativeTimes),
  }
}

export function generateAiActivities(count: number, startSeed?: number): AiActivity[] {
  return Array.from({ length: count }, (_, i) => generateAiActivity(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateUrgentSymptom(seed?: number): UrgentSymptom {
  const f = getFaker(seed)
  const urgency = f.helpers.arrayElement(['critical', 'high', 'moderate', 'low', 'monitor'] as const)

  const actionMap: Record<string, string[]> = {
    critical: criticalActions,
    high: criticalActions,
    moderate: moderateActions,
    low: moderateActions,
    monitor: monitorActions,
  }

  return {
    id: `sym-${f.string.numeric(3)}`,
    symptom: f.helpers.arrayElement(symptomNames),
    patient: `${f.person.firstName()} ${f.person.lastName()}`,
    patientId: `PAT-${f.string.numeric(4)}`,
    description: f.lorem.sentence({ min: 10, max: 22 }),
    detectedAt: f.helpers.arrayElement(relativeTimes),
    urgency,
    suggestedAction: f.helpers.arrayElement(actionMap[urgency]),
  }
}

export function generateUrgentSymptoms(count: number, startSeed?: number): UrgentSymptom[] {
  return Array.from({ length: count }, (_, i) => generateUrgentSymptom(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateAiSuggestion(seed?: number): AiSuggestion {
  const f = getFaker(seed)
  const patientName = f.person.fullName()

  return {
    id: `sug-${f.string.numeric(3)}`,
    context: `${patientName} — ${f.lorem.words({ min: 3, max: 6 })}`,
    contextPatient: patientName,
    reply: f.lorem.sentence({ min: 10, max: 25 }),
    category: f.helpers.arrayElement(suggestionCategories),
    priority: f.helpers.arrayElement(['urgent', 'high', 'normal', 'low'] as const),
    confidence: f.number.float({ min: 0.72, max: 0.99, fractionDigits: 2 }),
  }
}

export function generateAiSuggestions(count: number, startSeed?: number): AiSuggestion[] {
  return Array.from({ length: count }, (_, i) => generateAiSuggestion(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateAiSummary(seed?: number): AiSummary {
  const f = getFaker(seed)
  const periodEnd = f.date.recent({ days: 1 })
  const periodStart = new Date(periodEnd)
  periodStart.setDate(periodStart.getDate() - f.number.int({ min: 1, max: 7 }))
  const patientName = `${f.person.firstName()} ${f.person.lastName()}`

  return {
    id: `sum-${f.string.numeric(3)}`,
    patient: patientName,
    patientId: `PAT-${f.string.numeric(4)}`,
    periodStart: periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    periodEnd: periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    keyPoints: Array.from(
      { length: f.number.int({ min: 3, max: 5 }) },
      () => f.lorem.sentence({ min: 6, max: 12 })
    ),
    recommendation: f.lorem.sentence({ min: 10, max: 20 }),
    generatedAt: periodEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

export function generateAiSummaries(count: number, startSeed?: number): AiSummary[] {
  return Array.from({ length: count }, (_, i) => generateAiSummary(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateAiMetrics(): AiMetric[] {
  const f = getFaker()
  return [
    {
      title: 'Active Sessions',
      value: f.number.int({ min: 5, max: 25 }).toString(),
      change: `+${f.number.int({ min: 1, max: 8 })} in last hour`,
      changeType: 'positive',
      iconName: 'BotMessageSquare',
    },
    {
      title: 'Urgent Flags',
      value: f.number.int({ min: 1, max: 10 }).toString(),
      change: `+${f.number.int({ min: 1, max: 5 })} new today`,
      changeType: 'negative',
      iconName: 'AlertTriangle',
    },
    {
      title: 'Suggestions Today',
      value: f.number.int({ min: 40, max: 200 }).toString(),
      change: `+${f.number.float({ min: 5, max: 25, fractionDigits: 1 })}% vs yesterday`,
      changeType: 'positive',
      iconName: 'Lightbulb',
    },
    {
      title: 'Avg Response Time',
      value: `${f.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 })}m`,
      change: `-${f.number.int({ min: 5, max: 45 })}s vs last week`,
      changeType: 'positive',
      iconName: 'Timer',
    },
  ]
}
