import { getFaker } from './faker'
import type {
  Patient,
  MedicalNote,
  Visit,
} from '@/models'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const
const relationships = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Guardian'] as const
const tagOptions = ['high-risk', 'follow-up', 'new-patient', 'chronic', 'medication-review', 'telehealth', 'emergency', 'referral'] as const
const visitTypes = ['Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Procedure', 'Lab Visit'] as const
const departments = ['Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'ENT', 'Pediatrics', 'Oncology'] as const
const medicalNoteTitles = [
  'Routine Check-up',
  'Prescription Refill',
  'Lab Results Review',
  'Specialist Referral',
  'Imaging Report',
  'Follow-up Assessment',
  'Pre-op Evaluation',
  'Post-op Recovery Note',
] as const

export function generatePatient(seed?: number): Patient {
  const f = getFaker(seed)
  const firstName = f.person.firstName()
  const lastName = f.person.lastName()
  const createdAt = f.date.between({ from: '2022-01-01', to: '2025-12-01' }).toISOString()

  return {
    id: `PAT-${f.string.numeric(4)}`,
    firstName,
    lastName,
    email: f.internet.email({ firstName, lastName }).toLowerCase(),
    phoneNumber: f.phone.number({ style: 'national' }),
    dateOfBirth: f.date.birthdate({ min: 18, max: 90, mode: 'age' }).toISOString().split('T')[0],
    gender: f.helpers.arrayElement(['male', 'female', 'other'] as const),
    status: f.helpers.arrayElement(['active', 'inactive', 'archived', 'invited', 'suspended'] as const),
    bloodType: f.helpers.arrayElement(bloodTypes),
    allergies: f.helpers.multiple(() => f.science.chemicalElement().name, { count: { min: 0, max: 4 } }),
    emergencyContact: {
      name: f.person.fullName(),
      phone: f.phone.number({ style: 'national' }),
      relationship: f.helpers.arrayElement(relationships),
    },
    address: {
      street: f.location.streetAddress(),
      city: f.location.city(),
      state: f.location.state(),
      postalCode: f.location.zipCode(),
      country: 'US',
    },
    insurance: {
      provider: f.company.name(),
      policyId: f.string.alphanumeric({ length: 10, casing: 'upper' }),
      groupId: f.helpers.maybe(() => f.string.alphanumeric({ length: 8, casing: 'upper' })),
    },
    tags: f.helpers.arrayElements(tagOptions, { min: 0, max: 3 }),
    lastVisit: f.date.recent({ days: 90 }).toISOString(),
    createdAt,
    updatedAt: f.date.between({ from: new Date(createdAt), to: new Date() }).toISOString(),
  }
}

export function generatePatients(count: number, startSeed?: number): Patient[] {
  return Array.from({ length: count }, (_, i) => generatePatient(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateMedicalNote(patientId: string, seed?: number): MedicalNote {
  const f = getFaker(seed)
  const createdAt = f.date.recent({ days: 60 }).toISOString()

  return {
    id: `NOTE-${f.string.numeric(5)}`,
    patientId,
    title: f.helpers.arrayElement(medicalNoteTitles),
    content: f.lorem.paragraph({ min: 2, max: 5 }),
    type: f.helpers.arrayElement(['general', 'prescription', 'lab_result', 'referral', 'imaging'] as const),
    createdBy: `Dr. ${f.person.lastName()}`,
    createdAt,
    updatedAt: f.date.between({ from: new Date(createdAt), to: new Date() }).toISOString(),
  }
}

export function generateMedicalNotes(patientIds: string[], countPerPatient?: number): MedicalNote[] {
  return patientIds.flatMap((pid, i) =>
    Array.from(
      { length: countPerPatient ?? getFaker().number.int({ min: 1, max: 3 }) },
      (_, j) => generateMedicalNote(pid, i * 100 + j)
    )
  )
}

export function generateVisit(patientId: string, seed?: number): Visit {
  const f = getFaker(seed)
  const date = f.date.recent({ days: 180 }).toISOString().split('T')[0]

  return {
    id: `VIS-${f.string.numeric(5)}`,
    patientId,
    date,
    type: f.helpers.arrayElement(visitTypes),
    doctor: `Dr. ${f.person.lastName()}`,
    department: f.helpers.arrayElement(departments),
    reason: f.lorem.sentence({ min: 3, max: 8 }),
    diagnosis: f.helpers.maybe(() => f.lorem.sentence({ min: 3, max: 6 })),
    notes: f.helpers.maybe(() => f.lorem.paragraph()),
    status: f.helpers.arrayElement(['completed', 'cancelled', 'no_show'] as const),
  }
}

export function generateVisits(patientIds: string[], countPerPatient?: number): Visit[] {
  return patientIds.flatMap((pid, i) =>
    Array.from(
      { length: countPerPatient ?? getFaker().number.int({ min: 1, max: 4 }) },
      (_, j) => generateVisit(pid, i * 100 + j)
    )
  )
}
