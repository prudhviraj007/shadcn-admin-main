import { useMemo } from 'react'
import { type Doctor } from '../types/doctor'

export function useFilteredDoctors({
  doctors,
  searchTerm,
}: {
  doctors: Doctor[]
  searchTerm: string
}) {
  return useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return doctors.filter(
      (doctor) =>
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query)
    )
  }, [doctors, searchTerm])
}
