import { createFileRoute } from '@tanstack/react-router'
import { DoctorsPage } from '@/features/doctors'

export const Route = createFileRoute('/_authenticated/doctors/')({
  component: DoctorsPage,
})
