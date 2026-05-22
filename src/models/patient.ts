import { z } from 'zod'
import {
  EntityStatusSchema,
  GenderSchema,
  BloodTypeSchema,
  NoteTypeSchema,
  VisitStatusSchema,
} from './enums'
import { AddressSchema, EmergencyContactSchema, InsuranceSchema } from './common'

/** A patient registered in the healthcare system */
export const PatientSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: GenderSchema,
  status: EntityStatusSchema,
  bloodType: BloodTypeSchema,
  allergies: z.array(z.string()).default([]),
  emergencyContact: EmergencyContactSchema,
  address: AddressSchema.optional(),
  insurance: InsuranceSchema.optional(),
  tags: z.array(z.string()).default([]),
  lastVisit: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Patient = z.infer<typeof PatientSchema>

/** Lightweight patient summary for lists and search results */
export const PatientSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  status: EntityStatusSchema,
  lastVisit: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type PatientSummary = z.infer<typeof PatientSummarySchema>

/** A clinical note attached to a patient chart */
export const MedicalNoteSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: NoteTypeSchema,
  createdBy: z.string().min(1, 'Author is required'),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type MedicalNote = z.infer<typeof MedicalNoteSchema>

/** A recorded patient visit / encounter */
export const VisitSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  date: z.string().min(1, 'Date is required'),
  type: z.string().min(1, 'Visit type is required'),
  doctor: z.string().min(1, 'Doctor name is required'),
  department: z.string().min(1, 'Department is required'),
  reason: z.string().min(1, 'Reason is required'),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  status: VisitStatusSchema,
})
export type Visit = z.infer<typeof VisitSchema>

/** Tag option used for filtering / categorizing patients */
export const PatientTagSchema = z.object({
  value: z.string(),
  label: z.string(),
  color: z.string(),
})
export type PatientTag = z.infer<typeof PatientTagSchema>
