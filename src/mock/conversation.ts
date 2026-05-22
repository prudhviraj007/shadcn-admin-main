import { getFaker } from './faker'
import type { Message, Conversation } from '@/models'

const subtitles = [
  'Hypertension follow-up',
  'Cardiology results',
  'Appointment scheduling',
  'Medication question',
  'Lab results inquiry',
  'Post-op recovery',
  'Vaccination status',
  'Referral request',
  'Prescription refill',
  'Telehealth follow-up',
  'Insurance question',
  'Symptom update',
] as const

const relativeTimes = ['Just now', '5m ago', '12m ago', '1h ago', '3h ago', 'Yesterday', '2d ago'] as const

export function generateMessage(seed?: number): Message {
  const f = getFaker(seed)
  const author = f.helpers.arrayElement(['patient', 'staff', 'ai'] as const)

  return {
    id: `m${f.string.numeric(6)}`,
    author,
    text: author === 'ai'
      ? `Draft reply: ${f.lorem.sentence({ min: 8, max: 20 })}`
      : f.lorem.sentence({ min: 5, max: 18 }),
    time: f.date.recent({ days: 7 }).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    readAt: author !== 'patient'
      ? f.helpers.maybe(() => f.date.recent({ days: 7 }).toISOString())
      : undefined,
  }
}

export function generateConversation(seed?: number): Conversation {
  const f = getFaker(seed)
  const firstName = f.person.firstName()
  const lastName = f.person.lastName()
  const messageCount = f.number.int({ min: 2, max: 6 })
  const messages = Array.from({ length: messageCount }, (_, i) => generateMessage(seed !== undefined ? seed + i + 1 : undefined))
  const lastMessage = messages[messages.length - 1]
  const unread = f.number.int({ min: 0, max: 4 })
  const status = f.helpers.arrayElement(['needs-review', 'ai-drafted', 'resolved'] as const)
  const createdAt = f.date.recent({ days: 14 }).toISOString()

  return {
    id: `conv-${f.string.numeric(3)}`,
    patient: `${firstName} ${lastName}`,
    patientId: `PAT-${f.string.numeric(4)}`,
    avatar: f.image.avatarGitHub(),
    subtitle: f.helpers.arrayElement(subtitles),
    lastMessage: lastMessage.text,
    lastTime: f.helpers.arrayElement(relativeTimes),
    unread,
    status,
    priority: status === 'needs-review'
      ? f.helpers.arrayElement(['urgent', 'high', 'normal'] as const)
      : f.helpers.arrayElement(['normal', 'low'] as const),
    messages,
    createdAt,
    updatedAt: f.helpers.maybe(() => f.date.between({ from: new Date(createdAt), to: new Date() }).toISOString()),
  }
}

export function generateConversations(count: number, startSeed?: number): Conversation[] {
  return Array.from({ length: count }, (_, i) => generateConversation(startSeed !== undefined ? startSeed + i : undefined))
}
