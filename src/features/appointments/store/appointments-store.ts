import { create } from 'zustand'
import { type AppointmentStatus } from '../types/appointment'

type AppointmentsState = {
  searchTerm: string
  statusFilter: AppointmentStatus | 'All statuses'
  setSearchTerm: (value: string) => void
  setStatusFilter: (value: AppointmentStatus | 'All statuses') => void
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  searchTerm: '',
  statusFilter: 'All statuses',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
}))
