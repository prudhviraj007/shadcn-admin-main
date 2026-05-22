import { create } from 'zustand'
import { conversations } from '../data/conversations'

type ConversationsState = {
  searchTerm: string
  selectedId: string
  statusFilter: string
  showSidebar: boolean
  setSearchTerm: (value: string) => void
  setSelectedId: (value: string) => void
  setStatusFilter: (value: string) => void
  setShowSidebar: (value: boolean) => void
  toggleSidebar: () => void
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  searchTerm: '',
  selectedId: conversations[0].id,
  statusFilter: '',
  showSidebar: true,
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedId: (selectedId) => set({ selectedId, showSidebar: false }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setShowSidebar: (showSidebar) => set({ showSidebar }),
  toggleSidebar: () => set((s) => ({ showSidebar: !s.showSidebar })),
}))
