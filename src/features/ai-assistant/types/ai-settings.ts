export type ClinicFaq = {
  question: string
  answer: string
}

export type ClinicTimingSettings = {
  weekdayOpen: string
  weekdayClose: string
  saturdayOpen: string
  saturdayClose: string
}

export type AiAssistantSettings = {
  timings: ClinicTimingSettings
  consultationFee: number
  supportedLanguages: string[]
  greetingMessage: string
  faqs: ClinicFaq[]
}
