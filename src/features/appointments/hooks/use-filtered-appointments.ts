import { useMemo } from 'react'
import { type Appointment } from '../types/appointment'

export function useFilteredAppointments({
  appointments,
  searchTerm,
  statusFilter,
}: {
  appointments: Appointment[]
  searchTerm: string
  statusFilter: string
}) {
  return useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return appointments.filter((appointment) => {
      const matchesStatus =
        statusFilter === 'All statuses' || appointment.status === statusFilter
      const matchesSearch =
        !query ||
        appointment.patient.name.toLowerCase().includes(query) ||
        appointment.patient.email.toLowerCase().includes(query) ||
        appointment.doctor.toLowerCase().includes(query) ||
        appointment.id.toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [appointments, searchTerm, statusFilter])
}
