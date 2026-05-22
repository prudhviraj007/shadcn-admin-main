import { type AiAssistantSettings } from '../types/ai-settings'

export const supportedLanguageOptions = [
  'English',
  'Hindi',
  'Telugu',
  'Tamil',
  'Kannada',
  'Spanish',
]

export const mockAiAssistantSettings: AiAssistantSettings = {
  timings: {
    weekdayOpen: '09:00',
    weekdayClose: '18:00',
    saturdayOpen: '10:00',
    saturdayClose: '14:00',
  },
  consultationFee: 75,
  supportedLanguages: ['English', 'Hindi', 'Telugu'],
  greetingMessage:
    'Hello, thanks for contacting Northstar Health. I am the Clinic AI Assistant. I can help with appointments, clinic hours, fees, and common care questions. For urgent symptoms, please call emergency services.',
  faqs: [
    {
      question: 'What are your clinic hours?',
      answer: 'We are open Monday to Saturday from 9:00 AM to 6:00 PM.',
    },
    {
      question: 'Can I reschedule my appointment?',
      answer: 'Yes. Please share your preferred date and time.',
    },
    {
      question: 'Do you support telehealth consultations?',
      answer:
        'Yes, video consultations are available for eligible appointments.',
    },
  ],
}
