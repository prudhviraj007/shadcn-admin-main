import { useMemo } from 'react'
import { type Patient } from '../types/patient'

export function useFilteredPatients({
  patients,
  searchTerm,
}: {
  patients: Patient[]
  searchTerm: string
}) {
  return useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return patients.filter(
      (patient) =>
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.carePlan.toLowerCase().includes(query)
    )
  }, [patients, searchTerm])
}
