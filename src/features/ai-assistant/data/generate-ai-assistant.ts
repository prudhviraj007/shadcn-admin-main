import { faker } from '@faker-js/faker'
import {
  type AiMetric,
  type AiActivity,
  type UrgentSymptom,
  type AiSuggestion,
  type QuickAction,
  type AiSummary,
  type ChatSession,
  type ChatMessage,
} from '../types'

const urgencyLevels = ['critical', 'moderate', 'monitor'] as const
const activityTypes = ['alert', 'summary', 'suggestion', 'draft', 'review'] as const
const suggestionCategories = ['medication', 'symptom', 'follow-up', 'scheduling']

const activityTitles: Record<string, string[]> = {
  alert: ['Urgent symptom detected', 'Medication interaction flagged', 'Abnormal lab result', 'Critical vital sign alert'],
  summary: ['AI summary generated', 'Overnight report ready', 'Weekly patient roundup', 'Department summary'],
  suggestion: ['Reply suggestion accepted', 'AI triage recommendation', 'Treatment suggestion', 'Follow-up reminder'],
  draft: ['AI draft completed', 'Auto-generated response', 'Discharge summary draft', 'Referral letter draft'],
  review: ['Staff reviewed AI draft', 'Physician signed off', 'Nurse approved suggestion', 'Care plan updated'],
}

const symptomNames = [
  'Chest tightness & SOB',
  'Severe headache & vision changes',
  'Post-op wound redness',
  'Unexplained weight gain',
  'New medication rash',
  'Persistent cough & fever',
  'Abdominal pain & nausea',
  'Dizziness & fainting spells',
  'Joint swelling & stiffness',
  'Numbness in extremities',
]

const suggestedActions: Record<string, string[]> = {
  critical: [
    'Immediate triage — dispatch EMS. Flag to attending cardiologist.',
    'Advise ED evaluation. Notify physician stat.',
    'Urgent consult required. Activate rapid response team.',
  ],
  moderate: [
    'Schedule same-day evaluation. Consider starting empiric treatment.',
    'Order diagnostic workup. Review within 4 hours.',
    'Arrange specialist referral. Monitor symptoms closely.',
  ],
  monitor: [
    'Observe for progression. Schedule follow-up in 48 hours.',
    'Start symptomatic treatment. Educate patient on warning signs.',
    'Consider change in medication. Reassess in 1 week.',
  ],
}

const quickActionDefs: [string, string, string, string][] = [
  ['Generate Summary', 'AI-powered patient visit summary', 'FileText', 'text-violet-600'],
  ['Triage Assistant', 'Urgency assessment & routing', 'HeartPulse', 'text-rose-600'],
  ['Medication Check', 'AI drug interaction analysis', 'Pill', 'text-emerald-600'],
  ['Schedule Optimizer', 'Smart appointment suggestions', 'Calendar', 'text-blue-600'],
  ['Lab Interpreter', 'AI lab result analysis', 'FlaskConical', 'text-amber-600'],
  ['Discharge Writer', 'Auto-generated discharge notes', 'FileOutput', 'text-cyan-600'],
]

export function generateAiMetric(seed?: number): AiMetric {
  if (seed !== undefined) faker.seed(seed)

  const metrics: AiMetric[] = [
    { title: 'Active Sessions', value: faker.number.int({ min: 5, max: 25 }).toString(), change: `+${faker.number.int({ min: 1, max: 8 })} in last hour`, changeType: 'positive', iconName: 'BotMessageSquare' },
    { title: 'Urgent Flags', value: faker.number.int({ min: 1, max: 10 }).toString(), change: `+${faker.number.int({ min: 1, max: 5 })} new today`, changeType: 'negative', iconName: 'AlertTriangle' },
    { title: 'Suggestions Today', value: faker.number.int({ min: 40, max: 200 }).toString(), change: `+${faker.number.float({ min: 5, max: 25, fractionDigits: 1 })}% vs yesterday`, changeType: 'positive', iconName: 'Lightbulb' },
    { title: 'Avg Response Time', value: `${faker.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 })}m`, change: `-${faker.number.int({ min: 5, max: 45 })}s vs last week`, changeType: 'positive', iconName: 'Timer' },
  ]

  return faker.helpers.arrayElement(metrics)
}

export function generateAiMetrics(count?: number): AiMetric[] {
  const allMetrics = [
    { title: 'Active Sessions', iconName: 'BotMessageSquare' },
    { title: 'Urgent Flags', iconName: 'AlertTriangle' },
    { title: 'Suggestions Today', iconName: 'Lightbulb' },
    { title: 'Avg Response Time', iconName: 'Timer' },
  ]

  const n = count ?? allMetrics.length
  return allMetrics.slice(0, n).map((m, i) => {
    faker.seed(i)
    return {
      ...m,
      value: m.title === 'Avg Response Time'
        ? `${faker.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 })}m`
        : faker.number.int({ min: 5, max: 250 }).toString(),
      change: `+${faker.number.float({ min: 2, max: 30, fractionDigits: 1 })}%`,
      changeType: faker.helpers.arrayElement(['positive', 'negative', 'neutral'] as const),
    }
  })
}

export function generateAiActivity(seed?: number): AiActivity {
  if (seed !== undefined) faker.seed(seed)

  const type = faker.helpers.arrayElement(activityTypes)
  const title = faker.helpers.arrayElement(activityTitles[type])

  return {
    id: `act-${faker.string.numeric(3)}`,
    type,
    title,
    description: faker.lorem.sentence({ min: 8, max: 20 }),
    patient: `${faker.person.firstName()} ${faker.person.lastName()}`,
    timestamp: faker.helpers.arrayElement([
      `${faker.number.int({ min: 1, max: 59 })}m ago`,
      `${faker.number.int({ min: 1, max: 23 })}h ago`,
      `${faker.number.int({ min: 1, max: 6 })}d ago`,
    ]),
  }
}

export function generateAiActivities(count: number, startSeed?: number): AiActivity[] {
  return Array.from({ length: count }, (_, i) => generateAiActivity(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateUrgentSymptom(seed?: number): UrgentSymptom {
  if (seed !== undefined) faker.seed(seed)

  const urgency = faker.helpers.arrayElement(urgencyLevels)

  return {
    id: `sym-${faker.string.numeric(3)}`,
    symptom: faker.helpers.arrayElement(symptomNames),
    patient: `${faker.person.firstName()} ${faker.person.lastName()}`,
    description: faker.lorem.sentence({ min: 10, max: 22 }),
    detectedAt: faker.helpers.arrayElement(['Just now', '2 mins ago', '8 mins ago', '18 mins ago', '35 mins ago', '1h ago']),
    urgency,
    suggestedAction: faker.helpers.arrayElement(suggestedActions[urgency]),
  }
}

export function generateUrgentSymptoms(count: number, startSeed?: number): UrgentSymptom[] {
  return Array.from({ length: count }, (_, i) => generateUrgentSymptom(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateAiSuggestion(seed?: number): AiSuggestion {
  if (seed !== undefined) faker.seed(seed)

  return {
    id: `sug-${faker.string.numeric(3)}`,
    context: `${faker.person.fullName()} — ${faker.lorem.words({ min: 3, max: 6 })}`,
    reply: faker.lorem.sentence({ min: 10, max: 25 }),
    category: faker.helpers.arrayElement(suggestionCategories),
    confidence: faker.number.int({ min: 75, max: 100 }),
  }
}

export function generateAiSuggestions(count: number, startSeed?: number): AiSuggestion[] {
  return Array.from({ length: count }, (_, i) => generateAiSuggestion(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateQuickActions(): QuickAction[] {
  return quickActionDefs.map(([title, description, iconName, color], i) => ({
    id: `qa-${i + 1}`,
    title,
    description,
    iconName,
    color,
  }))
}

export function generateAiSummary(seed?: number): AiSummary {
  if (seed !== undefined) faker.seed(seed)

  const periodEnd = faker.date.recent({ days: 1 })
  const periodStart = new Date(periodEnd)
  periodStart.setDate(periodStart.getDate() - faker.number.int({ min: 1, max: 7 }))

  return {
    id: `sum-${faker.string.numeric(3)}`,
    patient: `${faker.person.firstName()} ${faker.person.lastName()}`,
    periodStart: periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    periodEnd: periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    keyPoints: Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () => faker.lorem.sentence({ min: 6, max: 12 })),
    recommendation: faker.lorem.sentence({ min: 10, max: 20 }),
    generatedAt: periodEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

export function generateAiSummaries(count: number, startSeed?: number): AiSummary[] {
  return Array.from({ length: count }, (_, i) => generateAiSummary(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateChatMessage(seed?: number): ChatMessage {
  if (seed !== undefined) faker.seed(seed)

  const author = faker.helpers.arrayElement(['patient', 'staff', 'ai'] as const)

  return {
    id: `m${faker.string.numeric(6)}`,
    author,
    text: author === 'ai'
      ? `Draft reply: ${faker.lorem.sentence({ min: 10, max: 25 })}`
      : faker.lorem.sentence({ min: 5, max: 18 }),
    time: faker.date.recent({ days: 1 }).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

export function generateChatSession(seed?: number): ChatSession {
  if (seed !== undefined) faker.seed(seed)

  const messageCount = faker.number.int({ min: 2, max: 5 })
  const messages = Array.from({ length: messageCount }, (_, i) => generateChatMessage(seed !== undefined ? seed + i + 1 : undefined))

  return {
    id: `session-${faker.string.numeric(3)}`,
    patient: `${faker.person.firstName()} ${faker.person.lastName()}`,
    avatar: faker.image.avatarGitHub(),
    subtitle: faker.helpers.arrayElement([
      'Hypertension follow-up', 'Medication question', 'Lab results',
      'Appointment scheduling', 'Post-op recovery',
    ]),
    messages,
  }
}

export function generateChatSessions(count: number, startSeed?: number): ChatSession[] {
  return Array.from({ length: count }, (_, i) => generateChatSession(startSeed !== undefined ? startSeed + i : undefined))
}
