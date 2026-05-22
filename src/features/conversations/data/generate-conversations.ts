import { faker } from '@faker-js/faker'
import { type Conversation, type Message, type ConversationStatus, type Priority } from '../types/conversation'

const substatuses: ConversationStatus[] = ['needs-review', 'ai-drafted', 'resolved']
const messageAuthors = ['patient', 'staff', 'ai'] as const

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
]

export function generateMessage(seed?: number): Message {
  if (seed !== undefined) faker.seed(seed)

  const author = faker.helpers.arrayElement(messageAuthors)

  return {
    id: `m${faker.string.numeric(6)}`,
    author,
    text: author === 'ai'
      ? faker.helpers.arrayElement([
          `Draft reply: ${faker.lorem.sentence({ min: 8, max: 20 })}`,
          `AI note: ${faker.lorem.sentence({ min: 6, max: 15 })}`,
        ])
      : faker.lorem.sentence({ min: 5, max: 18 }),
    time: faker.date.recent({ days: 7 }).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

export function generateConversation(seed?: number): Conversation {
  if (seed !== undefined) faker.seed(seed)

  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const messageCount = faker.number.int({ min: 2, max: 6 })
  const messages = Array.from({ length: messageCount }, (_, i) => generateMessage(seed !== undefined ? seed + i + 1 : undefined))
  const lastMessage = messages[messages.length - 1]
  const unread = faker.number.int({ min: 0, max: 4 })
  const status = faker.helpers.arrayElement(substatuses)

  return {
    id: `conv-${faker.string.numeric(3)}`,
    patient: `${firstName} ${lastName}`,
    patientId: `PAT-${faker.string.numeric(4)}`,
    avatar: faker.image.avatarGitHub(),
    subtitle: faker.helpers.arrayElement(subtitles),
    lastMessage: lastMessage.text,
    lastTime: faker.helpers.arrayElement([
      'Just now', '5m ago', '12m ago', '1h ago', '3h ago', 'Yesterday', '2d ago',
    ]),
    unread,
    status,
    priority: status === 'needs-review'
      ? faker.helpers.arrayElement(['urgent', 'normal'] as Priority[])
      : faker.helpers.arrayElement(['normal', 'low'] as Priority[]),
    messages,
  }
}

export function generateConversations(count: number, startSeed?: number): Conversation[] {
  return Array.from({ length: count }, (_, i) => generateConversation(startSeed !== undefined ? startSeed + i : undefined))
}
