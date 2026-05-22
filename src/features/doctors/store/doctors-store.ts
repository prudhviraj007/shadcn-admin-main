import { create } from 'zustand'

type DoctorsState = {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export const useDoctorsStore = create<DoctorsState>((set) => ({
  searchTerm: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}))
