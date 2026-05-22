import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PatientsPage } from '@/features/patients'

const patientsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('archived'),
      ])
    )
    .optional()
    .catch([]),
  gender: z
    .array(
      z.union([
        z.literal('male'),
        z.literal('female'),
        z.literal('other'),
      ])
    )
    .optional()
    .catch([]),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/patients/')({
  validateSearch: patientsSearchSchema,
  component: PatientsPage,
})
