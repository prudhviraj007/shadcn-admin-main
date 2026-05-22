import { faker } from '@faker-js/faker'
import type {
  ChatMessage,
  UrgentSymptom,
  AiSuggestion,
  AiSummary,
} from '@/features/ai-assistant/types'

function seededFaker(seed?: number) {
  if (seed !== undefined) faker.seed(seed)
  return faker
}

export function mockChatResponse(_userMessage: string, seed?: number): string {
  const f = seededFaker(seed)
  const responses = [
    `Based on the patient's history, I recommend scheduling a follow-up appointment within the next two weeks to monitor their ${f.helpers.arrayElement(['blood pressure', 'glucose levels', 'medication response', 'symptom progression'])}.`,
    `I've reviewed the latest lab results. The $\{f.helpers.arrayElement(['LDL cholesterol', 'HbA1c', 'thyroid panel', 'CBC'])} levels indicate ${f.helpers.arrayElement(['significant improvement', 'a need for medication adjustment', 'consistent with prior trends', 'minor fluctuations that are within normal range'])}.`,
    `The patient's symptoms align with $\{f.helpers.arrayElement(['a mild upper respiratory infection', 'seasonal allergies', 'stress-related hypertension', 'dietary intolerance'])}. I'd suggest $\{f.helpers.arrayElement(['rest and hydration', 'an over-the-counter antihistamine', 'monitoring blood pressure daily', 'keeping a food diary'])}.`,
    `Looking at the conversation history, the patient seems concerned about $\{f.helpers.arrayElement(['medication side effects', 'the cost of treatment', 'recovery timeline', 'follow-up appointment availability'])}. A reassuring message with specific next steps would help.`,
    `Draft reply: Thank you for your message. Based on your symptoms and history, I recommend $\{f.helpers.arrayElement(['scheduling an in-person visit', 'continuing your current medication as prescribed', 'trying the suggested lifestyle modifications', 'monitoring your symptoms for 48 hours'])}. Please contact us if symptoms worsen.`,
  ]
  return f.helpers.arrayElement(responses)
}

export function mockAppointmentSuggestions(_input: string, seed?: number): string[] {
  const f = seededFaker(seed)
  const count = f.number.int({ min: 2, max: 4 })
  const suggestions: string[] = []

  for (let i = 0; i < count; i++) {
    suggestions.push(
      f.helpers.arrayElement([
        `${f.date.soon({ days: 14 }).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at ${f.date.soon({ days: 1 }).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} with ${f.person.fullName()} (${f.helpers.arrayElement(['Primary Care', 'Cardiology', 'Endocrinology', 'Dermatology'])})`,
        `Telehealth — ${f.date.soon({ days: 7 }).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at ${f.date.soon({ days: 1 }).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
        `Urgent care walk-in — recommend visiting between ${f.helpers.arrayElement(['8-10 AM', '1-3 PM', '4-6 PM'])} for shortest wait time`,
        `Follow-up in ${f.number.int({ min: 2, max: 6 })} weeks — ${f.date.future({ years: 0.1 }).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
      ])
    )
  }

  return [...new Set(suggestions)]
}

export function mockConversationSummary(_messages: ChatMessage[], seed?: number): AiSummary {
  const f = seededFaker(seed)
  const pointCount = f.number.int({ min: 3, max: 5 })
  const keyPoints = Array.from({ length: pointCount }, () =>
    f.helpers.arrayElement([
      'Patient reported ongoing symptoms consistent with prior diagnosis',
      'Medication adherence has been consistent over the review period',
      'No new allergies or adverse reactions reported',
      'Lifestyle modifications discussed and well-received by patient',
      'Follow-up labs recommended for next visit',
      'Patient expressed concerns about treatment side effects',
      'Vitals within acceptable range during last check',
      'Referral to specialist discussed and initiated',
      'Patient education materials provided for self-management',
      'Telehealth follow-up scheduled for next month',
    ])
  )

  return {
    id: `sum-${f.string.numeric(4)}`,
    patient: f.person.fullName(),
    periodStart: f.date.recent({ days: 30 }).toLocaleDateString(),
    periodEnd: new Date().toLocaleDateString(),
    keyPoints,
    recommendation: f.helpers.arrayElement([
      'Continue current treatment plan. Schedule follow-up in 4 weeks.',
      'Consider medication adjustment based on latest lab results.',
      'Refer to specialist for further evaluation of reported symptoms.',
      'Maintain current management. No changes needed at this time.',
      'Schedule in-person visit to discuss treatment alternatives.',
    ]),
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

export function mockUrgentSymptoms(text: string, seed?: number): UrgentSymptom[] {
  const f = seededFaker(seed)
  const keywords = [
    { symptom: 'Chest Pain', urgency: 'critical' as const, action: 'Immediate cardiology evaluation needed' },
    { symptom: 'Severe Headache', urgency: 'critical' as const, action: 'Neurological assessment recommended within 2 hours' },
    { symptom: 'Shortness of Breath', urgency: 'critical' as const, action: 'Respiratory evaluation and pulse oximetry monitoring' },
    { symptom: 'High Fever', urgency: 'moderate' as const, action: 'Temperature monitoring and antipyretic administration' },
    { symptom: 'Bleeding', urgency: 'critical' as const, action: 'Immediate hemostatic assessment required' },
    { symptom: 'Allergic Reaction', urgency: 'critical' as const, action: 'Epinephrine administration and emergency monitoring' },
    { symptom: 'Nausea', urgency: 'moderate' as const, action: 'Anti-emetic medication and hydration protocol' },
    { symptom: 'Dizziness', urgency: 'moderate' as const, action: 'Fall risk assessment and blood pressure monitoring' },
    { symptom: 'Fatigue', urgency: 'monitor' as const, action: 'Schedule lab work to evaluate possible anemia or thyroid issues' },
    { symptom: 'Mild Rash', urgency: 'monitor' as const, action: 'Topical treatment and observation for 24-48 hours' },
  ]

  const detected = keywords.filter((k) =>
    text.toLowerCase().includes(k.symptom.toLowerCase())
  )

  if (detected.length === 0) {
    const random = f.helpers.arrayElement(keywords)
    const patientNames = [
      'Olivia Martin', 'Jackson Lee', 'Isabella Nguyen',
      'William Kim', 'Sofia Davis', 'Ethan Williams',
    ]
    return [
      {
        id: `sym-${f.string.numeric(4)}`,
        symptom: random.symptom,
        patient: f.helpers.arrayElement(patientNames),
        description: `Keyword pattern detected in recent message. Patient mentioned "${random.symptom.toLowerCase()}" in context of ongoing symptoms.`,
        detectedAt: f.date.recent({ days: 1 }).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        urgency: random.urgency,
        suggestedAction: random.action,
      },
    ]
  }

  return detected.slice(0, 3).map((k) => ({
    id: `sym-${f.string.numeric(4)}`,
    symptom: k.symptom,
    patient: f.person.fullName(),
    description: `Detected keyword "${k.symptom.toLowerCase()}" in patient message. Requires ${k.urgency} urgency review.`,
    detectedAt: f.date.recent({ days: 1 }).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    urgency: k.urgency,
    suggestedAction: k.action,
  }))
}

export function mockSuggestions(seed?: number): AiSuggestion[] {
  const f = seededFaker(seed)
  const count = f.number.int({ min: 3, max: 5 })
  return Array.from({ length: count }, () => ({
    id: `sug-${f.string.numeric(4)}`,
    context: f.helpers.arrayElement([
      'Patient inquiring about medication side effects',
      'Follow-up on recent lab results',
      'Appointment rescheduling request',
      'Prescription refill request',
      'Symptom update — new developments',
    ]),
    reply: f.helpers.arrayElement([
      'Thank you for reaching out. Based on your records, the medication you are taking may cause mild dizziness. I recommend taking it before bed and staying hydrated. If symptoms persist, please schedule a follow-up.',
      'Your recent lab results show improvement in key markers. Continue with the current treatment plan, and we will review again at your next appointment.',
      'I have checked the available slots. You can reschedule to next Tuesday at 10:00 AM or Thursday at 2:00 PM. Please let us know your preference.',
      'Your prescription refill request has been reviewed and approved. You can pick it up at your preferred pharmacy within 24 hours.',
      'Thank you for the update. Based on the symptoms described, I recommend monitoring for the next 48 hours. If there is no improvement, please schedule an in-person visit.',
    ]),
    category: f.helpers.arrayElement(['medication', 'symptom', 'follow-up', 'scheduling']),
    confidence: f.number.int({ min: 72, max: 98 }),
  }))
}
