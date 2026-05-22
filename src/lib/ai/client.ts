const API_URL = 'https://api.openai.com/v1'

let apiKey: string | null = null

export function getApiKey(): string | null {
  if (!apiKey) {
    apiKey = import.meta.env.VITE_OPENAI_API_KEY || null
  }
  return apiKey
}

export function isOpenAIEnabled(): boolean {
  return import.meta.env.VITE_USE_OPENAI === 'true' && !!getApiKey()
}

export function getModel(): string {
  return import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'
}

export async function chatCompletion(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<string> {
  const key = getApiKey()
  if (!key) throw new Error('OpenAI API key not configured')

  const res = await fetch(`${API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: options?.model ?? getModel(),
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OpenAI API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  return data.choices[0]?.message?.content ?? ''
}
