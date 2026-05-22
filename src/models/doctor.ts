import { z } from 'zod'
import { EntityStatusSchema, AvailabilityStatusSchema } from './enums'
import { AddressSchema } from './common'

/** Weekly schedule entry for a single day */
export const WeeklyScheduleSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  isAvailable: z.boolean(),
})
export type WeeklySchedule = z.infer<typeof WeeklyScheduleSchema>

/** A healthcare provider (doctor / physician) */
export const DoctorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  specializations: z.array(z.string()).default([]),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  bio: z.string().optional(),
  education: z.string().optional(),
  experienceYears: z.number().int().nonnegative().default(0),
  profileImage: z.string().optional(),
  status: EntityStatusSchema,
  availability: AvailabilityStatusSchema,
  weeklySchedule: z.array(WeeklyScheduleSchema).default([]),
  rating: z.number().min(0).max(5).default(0),
  consultationFee: z.number().nonnegative().default(0),
  department: z.string().min(1, 'Department is required'),
  languages: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  address: AddressSchema.optional(),
  createdAt: z.string(),
})
export type Doctor = z.infer<typeof DoctorSchema>

/** Lightweight doctor summary for appointment selection */
export const DoctorSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  availability: AvailabilityStatusSchema,
  rating: z.number().min(0).max(5),
  profileImage: z.string().optional(),
})
export type DoctorSummary = z.infer<typeof DoctorSummarySchema>
