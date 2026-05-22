import { createFileRoute } from '@tanstack/react-router'
import { PatientProfilePage } from '@/features/patients/components/patient-profile-page'

export const Route = createFileRoute('/_authenticated/patients/$patientId')({
  component: PatientProfilePage,
})
