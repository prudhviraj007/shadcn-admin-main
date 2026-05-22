import { useEffect, useCallback, useRef } from 'react'
import { createApi } from './api'

export function useSubscription<T extends Record<string, unknown>>(
  table: string,
  onPayload: (payload: { eventType: string; new: T; old: T }) => void,
  deps: unknown[] = []
) {
  const callbackRef = useRef(onPayload)
  callbackRef.current = onPayload

  const stableCallback = useCallback(
    (payload: { eventType: string; new: T; old: T }) => {
      callbackRef.current(payload)
    },
    []
  )

  useEffect(() => {
    const api = createApi<T>(table)
    const unsubscribe = api.subscribe(stableCallback)
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, stableCallback, ...deps])
}
