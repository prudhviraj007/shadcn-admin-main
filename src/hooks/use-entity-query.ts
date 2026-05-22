import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

export type EntityService<T extends { id: string }> = {
  getList?: () => Promise<T[]>
}

export function createEntityKey(entityKey: string) {
  return {
    list: () => [entityKey, 'list'] as const,
    byId: (id: string) => [entityKey, 'detail', id] as const,
  }
}

export function createEntityListHook<T extends { id: string }>(
  entityKey: string,
  service: EntityService<T>,
  options?: { staleTime?: number }
) {
  const queryKey = createEntityKey(entityKey)

  function useEntityList(): UseQueryResult<T[]> {
    return useQuery({
      queryKey: queryKey.list(),
      queryFn: () => service.getList!(),
      enabled: !!service.getList,
      staleTime: options?.staleTime,
    })
  }

  return { useEntityList, queryKey }
}

export function useOptimisticUpdate<T extends { id: string }>(
  queryKey: ReturnType<typeof createEntityKey>
) {
  const queryClient = useQueryClient()

  return {
    cancelQueries: () =>
      queryClient.cancelQueries({ queryKey: queryKey.list() }),
    getPreviousData: () =>
      queryClient.getQueryData<T[]>(queryKey.list()),
    applyOptimistic: (updated: T) => {
      queryClient.setQueryData<T[]>(queryKey.list(), (items = []) =>
        items.map((item) => (item.id === updated.id ? updated : item))
      )
    },
    applyOptimisticAdd: (item: T) => {
      queryClient.setQueryData<T[]>(queryKey.list(), (existing = []) => [...existing, item])
    },
    applyOptimisticRemove: (id: string) => {
      queryClient.setQueryData<T[]>(queryKey.list(), (items = []) =>
        items.filter((item) => item.id !== id)
      )
    },
    rollback: (previous: T[] | undefined) => {
      queryClient.setQueryData(queryKey.list(), previous)
    },
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.list() })
    },
  }
}
