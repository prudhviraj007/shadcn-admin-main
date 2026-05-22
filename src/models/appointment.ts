import { z } from 'zod'
import { AppointmentStatusSchema, PrioritySchema } from './enums'

/** Minimal patient reference embedded in an appointment */
export const AppointmentPatientRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
})
export type AppointmentPatientRef = z.infer<typeof AppointmentPatientRefSchema>

/** Minimal doctor reference embedded in an appointment */
export const AppointmentDoctorRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
})
export type AppointmentDoctorRef = z.infer<typeof AppointmentDoctorRefSchema>

/** A scheduled appointment between a patient and a doctor */
export const AppointmentSchema = z.object({
  id: z.string(),
  patient: AppointmentPatientRefSchema,
  doctor: AppointmentDoctorRefSchema,
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().int().positive().describe('Duration in minutes'),
  type: z.string().min(1, 'Appointment type is required'),
  status: AppointmentStatusSchema,
  priority: PrioritySchema,
  department: z.string().min(1, 'Department is required'),
  notes: z.string().optional(),
  reason: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Appointment = z.infer<typeof AppointmentSchema>

/** Lookup table entry for configurable appointment types */
export const AppointmentTypeSchema = z.object({
  value: z.string(),
  label: z.string(),
  duration: z.number().int().positive(),
})
export type AppointmentType = z.infer<typeof AppointmentTypeSchema>
