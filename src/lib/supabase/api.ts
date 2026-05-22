type QueryResult<T> = { data: T[]; error: Error | null }
type SingleResult<T> = { data: T | null; error: Error | null }

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function mapKeysToCamelCase<T extends Record<string, unknown>>(obj: Record<string, unknown> | null): T {
  if (!obj) return {} as T
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    result[toCamelCase(key)] = obj[key]
  }
  return result as T
}

function mapKeysToSnakeCase(obj: Record<string, unknown> | null): Record<string, unknown> {
  if (!obj) return {}
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const snake = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    result[snake] = obj[key]
  }
  return result
}

function getConfig(): { baseUrl: string; apiKey: string } | null {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !apiKey) return null
  return { baseUrl, apiKey }
}

async function restGet<T>(
  table: string,
  params: Record<string, string>
): Promise<{ data: T[]; error: Error | null }> {
  const cfg = getConfig()
  if (!cfg) return { data: [], error: new Error('Supabase not configured') }

  const qs = new URLSearchParams(params).toString()
  const url = `${cfg.baseUrl}/rest/v1/${table}${qs ? '?' + qs : ''}`

  try {
    const res = await fetch(url, {
      headers: {
        apikey: cfg.apiKey,
        Authorization: `Bearer ${cfg.apiKey}`,
        Accept: 'application/json',
      },
    })
    if (!res.ok) {
      const body = await res.text()
      return { data: [], error: new Error(`GET ${table} ${res.status}: ${body}`) }
    }
    const text = await res.text()
    const json = text ? JSON.parse(text) : []
    return { data: json, error: null }
  } catch (e) {
    return { data: [], error: e instanceof Error ? e : new Error(String(e)) }
  }
}

async function restSingle<T>(
  table: string,
  params: Record<string, string>
): Promise<SingleResult<T>> {
  const result = await restGet<T>(table, params)
  if (result.error) return { data: null, error: result.error }
  if (!result.data || result.data.length === 0) {
    return { data: null, error: new Error(`${table} not found`) }
  }
  return { data: result.data[0], error: null }
}

async function restPost<T>(
  table: string,
  body: Record<string, unknown>
): Promise<SingleResult<T>> {
  const cfg = getConfig()
  if (!cfg) return { data: null, error: new Error('Supabase not configured') }

  const url = `${cfg.baseUrl}/rest/v1/${table}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: cfg.apiKey,
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      return { data: null, error: new Error(`POST ${table} ${res.status}: ${text}`) }
    }
    const text = await res.text()
    if (!text) return { data: null, error: new Error(`POST ${table} returned empty body`) }
    const json = JSON.parse(text)
    if (!Array.isArray(json) || json.length === 0) {
      return { data: null, error: new Error(`POST ${table} returned no rows`) }
    }
    return { data: json[0], error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) }
  }
}

async function restPatch<T>(
  table: string,
  filter: Record<string, string>,
  body: Record<string, unknown>
): Promise<SingleResult<T>> {
  const cfg = getConfig()
  if (!cfg) return { data: null, error: new Error('Supabase not configured') }

  const qs = new URLSearchParams(filter).toString()
  const url = `${cfg.baseUrl}/rest/v1/${table}${qs ? '?' + qs : ''}`

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        apikey: cfg.apiKey,
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      return { data: null, error: new Error(`PATCH ${table} ${res.status}: ${text}`) }
    }
    const text = await res.text()
    if (!text) return { data: null, error: new Error(`PATCH ${table} returned empty body`) }
    const json = JSON.parse(text)
    if (!Array.isArray(json) || json.length === 0) {
      return { data: null, error: new Error(`PATCH ${table} returned no rows`) }
    }
    return { data: json[0], error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) }
  }
}

async function restDelete(
  table: string,
  filter: Record<string, string>
): Promise<{ error: Error | null }> {
  const cfg = getConfig()
  if (!cfg) return { error: new Error('Supabase not configured') }

  const qs = new URLSearchParams(filter).toString()
  const url = `${cfg.baseUrl}/rest/v1/${table}${qs ? '?' + qs : ''}`

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        apikey: cfg.apiKey,
        Authorization: `Bearer ${cfg.apiKey}`,
      },
    })
    if (!res.ok) {
      const text = await res.text()
      return { error: new Error(`DELETE ${table} ${res.status}: ${text}`) }
    }
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) }
  }
}

export function createApi<T extends Record<string, unknown>>(table: string) {
  return {
    async getAll(options?: {
      orderBy?: string
      ascending?: boolean
      limit?: number
    }): Promise<QueryResult<T>> {
      const params: Record<string, string> = { select: '*' }
      const col = options?.orderBy ?? 'created_at'
      const dir = options?.ascending ? 'asc' : 'desc'
      params.order = `${col}.${dir}`
      if (options?.limit) params.limit = String(options.limit)

      const { data, error } = await restGet<Record<string, unknown>>(table, params)
      if (error) return { data: [], error }
      return {
        data: data.map((row) => mapKeysToCamelCase<T>(row)),
        error: null,
      }
    },

    async getById(id: string): Promise<SingleResult<T>> {
      const { data, error } = await restSingle<Record<string, unknown>>(table, {
        select: '*',
        id: `eq.${id}`,
      })
      if (error) return { data: null, error }
      return { data: mapKeysToCamelCase<T>(data), error: null }
    },

    async create(record: Partial<T>): Promise<SingleResult<T>> {
      const snakeRecord = mapKeysToSnakeCase(record as Record<string, unknown>)
      const { data, error } = await restPost<Record<string, unknown>>(table, snakeRecord)
      if (error) return { data: null, error }
      return { data: mapKeysToCamelCase<T>(data), error: null }
    },

    async update(id: string, record: Partial<T>): Promise<SingleResult<T>> {
      const snakeRecord = mapKeysToSnakeCase(record as Record<string, unknown>)
      const { data, error } = await restPatch<Record<string, unknown>>(
        table,
        { id: `eq.${id}` },
        snakeRecord
      )
      if (error) return { data: null, error }
      return { data: mapKeysToCamelCase<T>(data), error: null }
    },

    async remove(id: string): Promise<{ error: Error | null }> {
      return restDelete(table, { id: `eq.${id}` })
    },

    subscribe(_callback: (payload: { eventType: string; new: T; old: T }) => void): () => void {
      return () => {}
    },
  }
}
