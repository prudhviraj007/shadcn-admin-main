import { isOpenAIEnabled, chatCompletion } from './client'
import {
  mockChatResponse,
  mockAppointmentSuggestions,
  mockConversationSummary,
  mockUrgentSymptoms,
  mockSuggestions,
} from './mock'
import type {
  ChatMessage,
  UrgentSymptom,
  AiSuggestion,
  AiSummary,
} from '@/features/ai-assistant/types'

const SYSTEM_PROMPT = `You are a helpful medical clinic AI assistant. 
You assist healthcare staff by:
- Drafting professional, empathetic replies to patient messages
- Summarizing patient conversations for clinical review
- Identifying urgent symptoms that require immediate attention
- Suggesting appropriate appointment types and timelines

Always respond in a clear, professional manner. 
Do NOT provide definitive medical diagnoses — always recommend consulting a qualified healthcare provider.`

export async function getAiChatResponse(
  conversationHistory: { role: 'user' | 'assistant' | 'system'; content: string }[],
  userMessage: string
): Promise<string> {
  if (isOpenAIEnabled()) {
    try {
      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...conversationHistory.map((m) => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: userMessage },
      ]
      return await chatCompletion(messages, { temperature: 0.7, maxTokens: 512 })
    } catch (err) {
      console.error('[AI] Chat response error, falling back to mock:', err)
      return mockChatResponse(userMessage)
    }
  }
  return mockChatResponse(userMessage)
}

export async function getAppointmentSuggestions(
  patientContext: string
): Promise<string[]> {
  if (isOpenAIEnabled()) {
    try {
      const messages = [
        { role: 'system' as const, content: `${SYSTEM_PROMPT}\n\nSuggest 2-4 appointment options based on this patient context. Return them as a JSON array of strings, each describing a date/time/type option.` },
        { role: 'user' as const, content: patientContext },
      ]
      const raw = await chatCompletion(messages, { temperature: 0.5, maxTokens: 512 })
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
      } catch {}
      return raw.split('\n').filter((l) => l.trim()).slice(0, 4)
    } catch (err) {
      console.error('[AI] Appointment suggestions error, falling back to mock:', err)
      return mockAppointmentSuggestions(patientContext)
    }
  }
  return mockAppointmentSuggestions(patientContext)
}

export async function getConversationSummary(
  messages: ChatMessage[]
): Promise<AiSummary> {
  if (isOpenAIEnabled()) {
    try {
      const conversationText = messages
        .map((m) => `[${m.author}] ${m.text}`)
        .join('\n')

      const messages_payload = [
        {
          role: 'system' as const,
          content: `${SYSTEM_PROMPT}\n\nSummarize the following conversation. Extract 3-5 key points, a recommendation, and the patient name. Return as JSON: { "patient": string, "keyPoints": string[], "recommendation": string, "periodStart": string, "periodEnd": string }. Use the conversation dates for the period.`,
        },
        { role: 'user' as const, content: conversationText },
      ]
      const raw = await chatCompletion(messages_payload, { temperature: 0.3, maxTokens: 512 })
      try {
        const parsed = JSON.parse(raw)
        return {
          id: `sum-${Date.now()}`,
          patient: parsed.patient || 'Unknown Patient',
          periodStart: parsed.periodStart || new Date().toLocaleDateString(),
          periodEnd: parsed.periodEnd || new Date().toLocaleDateString(),
          keyPoints: parsed.keyPoints || [],
          recommendation: parsed.recommendation || 'No specific recommendation.',
          generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      } catch {}
    } catch (err) {
      console.error('[AI] Conversation summary error, falling back to mock:', err)
    }
  }
  return mockConversationSummary(messages)
}

export async function detectUrgentSymptoms(
  text: string
): Promise<UrgentSymptom[]> {
  if (isOpenAIEnabled()) {
    try {
      const messages = [
        {
          role: 'system' as const,
          content: `${SYSTEM_PROMPT}\n\nAnalyze the following text for urgent medical keywords. Return as JSON array: [{ "symptom": string, "urgency": "critical"|"moderate"|"monitor", "description": string, "suggestedAction": string }]. Return empty array if no urgent symptoms detected.`,
        },
        { role: 'user' as const, content: text },
      ]
      const raw = await chatCompletion(messages, { temperature: 0.1, maxTokens: 512 })
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          return parsed.map((s: Record<string, string>, i: number) => ({
            id: `sym-${Date.now()}-${i}`,
            symptom: s.symptom || 'Unknown',
            patient: 'Auto-detected',
            description: s.description || '',
            detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            urgency: (s.urgency as UrgentSymptom['urgency']) || 'monitor',
            suggestedAction: s.suggestedAction || 'Review patient message.',
          }))
        }
      } catch {}
    } catch (err) {
      console.error('[AI] Symptom detection error, falling back to mock:', err)
    }
  }
  return mockUrgentSymptoms(text)
}

export async function getAiSuggestions(): Promise<AiSuggestion[]> {
  if (isOpenAIEnabled()) {
    try {
      const messages = [
        {
          role: 'system' as const,
          content: `${SYSTEM_PROMPT}\n\nGenerate 3-5 suggested replies for common patient inquiries. Return as JSON array: [{ "context": string, "reply": string, "category": "medication"|"symptom"|"follow-up"|"scheduling", "confidence": number }].`,
        },
        { role: 'user' as const, content: 'Generate suggestions for current patient conversations.' },
      ]
      const raw = await chatCompletion(messages, { temperature: 0.6, maxTokens: 1024 })
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          return parsed.map((s: Record<string, unknown>, i: number) => ({
            id: `sug-${Date.now()}-${i}`,
            context: (s.context as string) || '',
            reply: (s.reply as string) || '',
            category: (s.category as string) || 'follow-up',
            confidence: (s.confidence as number) || 85,
          }))
        }
      } catch {}
    } catch (err) {
      console.error('[AI] Suggestions error, falling back to mock:', err)
    }
  }
  return mockSuggestions()
}
