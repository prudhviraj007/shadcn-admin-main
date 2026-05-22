import { useEffect, useRef } from 'react'
import { isSupabaseEnabled, createApi } from './index'

type StoreActions<T> = {
  setItems: (items: T[]) => void
  addItem: (item: T) => void
  updateItem: (id: string, updates: Partial<T>) => void
  removeItem: (id: string) => void
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function mapKeysToCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    result[toCamelCase(key)] = obj[key]
  }
  return result as T
}

export function useSyncWithSupabase<T extends { id: string }>(
  table: string,
  store: StoreActions<T>
) {
  const storeRef = useRef(store)
  storeRef.current = store

  useEffect(() => {
    if (!isSupabaseEnabled()) return

    const api = createApi<T>(table)

    api.getAll().then(({ data, error }) => {
      if (!error && data) {
        storeRef.current.setItems(data)
      }
    })

    const unsubscribe = api.subscribe((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload
      switch (eventType) {
        case 'INSERT':
          storeRef.current.addItem(mapKeysToCamelCase<T>(newRecord as Record<string, unknown>))
          break
        case 'UPDATE':
          storeRef.current.updateItem(oldRecord?.id ?? newRecord.id, mapKeysToCamelCase<Partial<T>>(newRecord as Record<string, unknown>))
          break
        case 'DELETE':
          storeRef.current.removeItem(oldRecord?.id)
          break
      }
    })

    return () => unsubscribe()
  }, [table])
}

export async function fetchAllFromSupabase<T extends { id: string }>(
  table: string
): Promise<T[]> {
  if (!isSupabaseEnabled()) return []

  const api = createApi<T>(table)
  const { data, error } = await api.getAll()
  if (error) {
    console.error(`[Supabase] Failed to fetch ${table}:`, error.message)
    return []
  }
  return data ?? []
}
