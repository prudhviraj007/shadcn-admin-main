import { useQuery, useMutation } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
  getAiChatResponse,
  getAppointmentSuggestions,
  getConversationSummary,
  detectUrgentSymptoms,
  getAiSuggestions,
} from '@/lib/ai'
import type {
  ChatMessage,
  UrgentSymptom,
  AiSuggestion,
  AiSummary,
} from '@/features/ai-assistant/types'

export function useAiChatResponse() {
  return useMutation({
    mutationFn: async ({
      history,
      message,
    }: {
      history: { role: 'user' | 'assistant' | 'system'; content: string }[]
      message: string
    }) => getAiChatResponse(history, message),
  })
}

export function useAppointmentSuggestions(
  patientContext: string
): UseQueryResult<string[]> {
  return useQuery({
    queryKey: ['ai', 'appointment-suggestions', patientContext],
    queryFn: () => getAppointmentSuggestions(patientContext),
    enabled: patientContext.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export function useConversationSummary(
  messages: ChatMessage[]
): UseQueryResult<AiSummary> {
  return useQuery({
    queryKey: ['ai', 'conversation-summary', messages.length],
    queryFn: () => getConversationSummary(messages),
    enabled: messages.length > 0,
    staleTime: 30 * 1000,
  })
}

export function useUrgentSymptomDetection(
  text: string
): UseQueryResult<UrgentSymptom[]> {
  return useQuery({
    queryKey: ['ai', 'urgent-symptoms', text],
    queryFn: () => detectUrgentSymptoms(text),
    enabled: text.length > 0,
    staleTime: 60 * 1000,
  })
}

export function useAiSuggestions(): UseQueryResult<AiSuggestion[]> {
  return useQuery({
    queryKey: ['ai', 'suggestions'],
    queryFn: () => getAiSuggestions(),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
