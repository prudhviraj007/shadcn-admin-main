import { create } from 'zustand'

type PatientsState = {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export const usePatientsStore = create<PatientsState>((set) => ({
  searchTerm: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}))
