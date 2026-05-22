import { useMemo } from 'react'
import { type Conversation } from '../types/conversation'

export function useFilteredConversations({
  conversations,
  searchTerm,
  statusFilter,
}: {
  conversations: Conversation[]
  searchTerm: string
  statusFilter?: string
}) {
  return useMemo(() => {
    let result = conversations

    const query = searchTerm.trim().toLowerCase()
    if (query) {
      result = result.filter(
        (c) =>
          c.patient.toLowerCase().includes(query) ||
          c.subtitle.toLowerCase().includes(query) ||
          c.lastMessage.toLowerCase().includes(query)
      )
    }

    if (statusFilter === 'unread') {
      result = result.filter((c) => c.unread > 0)
    } else if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter)
    }

    return result
  }, [conversations, searchTerm, statusFilter])
}
