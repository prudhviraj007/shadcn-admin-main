import { createFileRoute } from '@tanstack/react-router'
import { DoctorProfilePage } from '@/features/doctors/components/doctor-profile-page'

export const Route = createFileRoute('/_authenticated/doctors/$doctorId')({
  component: DoctorProfilePage,
})
