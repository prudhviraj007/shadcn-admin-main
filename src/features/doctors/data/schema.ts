import { z } from 'zod'

const availabilitySchema = z.union([
  z.literal('available'),
  z.literal('busy'),
  z.literal('offline'),
  z.literal('on-leave'),
])
export type AvailabilityStatus = z.infer<typeof availabilitySchema>

const scheduleDaySchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean(),
})

export const _doctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  specializations: z.array(z.string()),
  email: z.string(),
  phoneNumber: z.string(),
  bio: z.string(),
  education: z.string(),
  experienceYears: z.number(),
  profileImage: z.string().optional(),
  availability: availabilitySchema,
  weeklySchedule: z.array(scheduleDaySchema),
  rating: z.number(),
  consultationFee: z.number(),
  department: z.string(),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
  createdAt: z.string(),
})
export type Doctor = z.infer<typeof _doctorSchema>
