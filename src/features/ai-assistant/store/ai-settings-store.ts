import { create } from 'zustand'
import { mockAiAssistantSettings } from '../mock-data/ai-settings'
import { type ClinicFaq } from '../types/ai-settings'

type AiSettingsState = {
  selectedLanguages: string[]
  faqs: ClinicFaq[]
  toggleLanguage: (language: string) => void
  updateFaq: (index: number, field: keyof ClinicFaq, value: string) => void
  addFaq: () => void
  removeFaq: (index: number) => void
}

export const useAiSettingsStore = create<AiSettingsState>((set) => ({
  selectedLanguages: mockAiAssistantSettings.supportedLanguages,
  faqs: mockAiAssistantSettings.faqs,
  toggleLanguage: (language) =>
    set((state) => ({
      selectedLanguages: state.selectedLanguages.includes(language)
        ? state.selectedLanguages.filter((item) => item !== language)
        : [...state.selectedLanguages, language],
    })),
  updateFaq: (index, field, value) =>
    set((state) => ({
      faqs: state.faqs.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq
      ),
    })),
  addFaq: () =>
    set((state) => ({
      faqs: [...state.faqs, { question: '', answer: '' }],
    })),
  removeFaq: (index) =>
    set((state) => ({
      faqs: state.faqs.filter((_, faqIndex) => faqIndex !== index),
    })),
}))
