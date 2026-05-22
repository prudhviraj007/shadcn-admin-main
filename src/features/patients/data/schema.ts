import { z } from 'zod'

const patientStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('archived'),
])
export type PatientStatus = z.infer<typeof patientStatusSchema>

const genderSchema = z.union([
  z.literal('male'),
  z.literal('female'),
  z.literal('other'),
])
export type PatientGender = z.infer<typeof genderSchema>

const noteTypeSchema = z.union([
  z.literal('general'),
  z.literal('prescription'),
  z.literal('lab_result'),
  z.literal('referral'),
  z.literal('imaging'),
])
export type NoteType = z.infer<typeof noteTypeSchema>

const visitStatusSchema = z.union([
  z.literal('completed'),
  z.literal('cancelled'),
  z.literal('no_show'),
])
export type VisitStatus = z.infer<typeof visitStatusSchema>

const emergencyContactSchema = z.object({
  name: z.string(),
  phone: z.string(),
  relationship: z.string(),
})

export const _patientSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  dateOfBirth: z.string(),
  gender: genderSchema,
  status: patientStatusSchema,
  bloodType: z.string(),
  allergies: z.array(z.string()),
  emergencyContact: emergencyContactSchema,
  address: z.string(),
  insuranceProvider: z.string(),
  insuranceId: z.string(),
  tags: z.array(z.string()),
  lastVisit: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Patient = z.infer<typeof _patientSchema>

export const _medicalNoteSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  title: z.string(),
  content: z.string(),
  type: noteTypeSchema,
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type MedicalNote = z.infer<typeof _medicalNoteSchema>

export const _visitSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  date: z.string(),
  type: z.string(),
  doctor: z.string(),
  department: z.string(),
  reason: z.string(),
  diagnosis: z.string(),
  notes: z.string(),
  status: visitStatusSchema,
})
export type Visit = z.infer<typeof _visitSchema>

export type PatientTag = {
  value: string
  label: string
  color: string
}
