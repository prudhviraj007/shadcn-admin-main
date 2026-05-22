import {
  type EntityStatus,
  type Gender,
  type BloodType,
  type NoteType,
  type VisitStatus,
} from './enums'

export type EmergencyContact = {
  name: string
  phone: string
  relationship: string
}

export type Patient = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: Gender
  status: EntityStatus
  bloodType: BloodType
  allergies: string[]
  emergencyContact: EmergencyContact
  address: string
  insuranceProvider: string
  insuranceId: string
  tags: string[]
  lastVisit: string
  createdAt: string
  updatedAt: string
}

export type MedicalNote = {
  id: string
  patientId: string
  title: string
  content: string
  type: NoteType
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type Visit = {
  id: string
  patientId: string
  date: string
  type: string
  doctor: string
  department: string
  reason: string
  diagnosis: string
  notes: string
  status: VisitStatus
}

export type PatientTag = {
  value: string
  label: string
  color: string
}

export type PatientSummary = {
  id: string
  name: string
  email: string
  phoneNumber: string
  status: EntityStatus
  lastVisit: string
  tags: string[]
}
