import {
  type AvailabilityStatus,
  type EntityStatus,
} from './enums'

export type WeeklySchedule = {
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export type Doctor = {
  id: string
  name: string
  specialty: string
  specializations: string[]
  email: string
  phoneNumber: string
  bio: string
  education: string
  experienceYears: number
  profileImage?: string
  status: EntityStatus
  availability: AvailabilityStatus
  weeklySchedule: WeeklySchedule[]
  rating: number
  consultationFee: number
  department: string
  languages: string[]
  certifications: string[]
  createdAt: string
}

export type DoctorSummary = {
  id: string
  name: string
  specialty: string
  availability: AvailabilityStatus
  rating: number
  profileImage?: string
}
