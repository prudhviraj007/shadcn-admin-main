import { faker } from '@faker-js/faker'
import { type Patient, type MedicalNote, type Visit } from './schema'

export function generatePatient(seed?: number): Patient {
  if (seed !== undefined) faker.seed(seed)

  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const gender = faker.helpers.arrayElement(['male', 'female', 'other'] as const)
  const createdAt = faker.date.between({ from: '2022-01-01', to: '2025-12-01' }).toISOString()

  return {
    id: `PAT-${faker.string.numeric(4)}`,
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phoneNumber: faker.phone.number({ style: 'national' }),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }).toISOString().split('T')[0],
    gender,
    status: faker.helpers.arrayElement(['active', 'inactive', 'archived'] as const),
    bloodType: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    allergies: faker.helpers.multiple(() => faker.science.chemicalElement().name, { count: { min: 0, max: 4 } }),
    emergencyContact: {
      name: faker.person.fullName(),
      phone: faker.phone.number({ style: 'national' }),
      relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Child', 'Friend']),
    },
    address: faker.location.streetAddress({ useFullAddress: true }),
    insuranceProvider: faker.company.name(),
    insuranceId: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
    tags: faker.helpers.arrayElements(
      ['high-risk', 'follow-up', 'new-patient', 'chronic', 'medication-review', 'telehealth', 'emergency', 'referral'],
      { min: 0, max: 3 }
    ),
    lastVisit: faker.date.recent({ days: 90 }).toISOString(),
    createdAt,
    updatedAt: faker.date.between({ from: new Date(createdAt), to: new Date() }).toISOString(),
  }
}

export function generatePatients(count: number, startSeed?: number): Patient[] {
  return Array.from({ length: count }, (_, i) => generatePatient(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateMedicalNote(patientId: string, seed?: number): MedicalNote {
  if (seed !== undefined) faker.seed(seed)

  const createdAt = faker.date.recent({ days: 60 }).toISOString()

  return {
    id: `NOTE-${faker.string.numeric(5)}`,
    patientId,
    title: faker.helpers.arrayElement([
      'Routine Check-up', 'Prescription Refill', 'Lab Results Review',
      'Specialist Referral', 'Imaging Report', 'Follow-up Assessment',
    ]),
    content: faker.lorem.paragraph({ min: 2, max: 5 }),
    type: faker.helpers.arrayElement(['general', 'prescription', 'lab_result', 'referral', 'imaging'] as const),
    createdBy: `Dr. ${faker.person.lastName()}`,
    createdAt,
    updatedAt: faker.date.between({ from: new Date(createdAt), to: new Date() }).toISOString(),
  }
}

export function generateMedicalNotes(patientIds: string[], countPerPatient?: number): MedicalNote[] {
  return patientIds.flatMap((pid, i) =>
    Array.from({ length: countPerPatient ?? faker.number.int({ min: 1, max: 3 }) }, (_, j) =>
      generateMedicalNote(pid, i * 100 + j)
    )
  )
}

export function generateVisit(patientId: string, seed?: number): Visit {
  if (seed !== undefined) faker.seed(seed)

  return {
    id: `VIS-${faker.string.numeric(5)}`,
    patientId,
    date: faker.date.recent({ days: 180 }).toISOString().split('T')[0],
    type: faker.helpers.arrayElement(['Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Procedure', 'Lab Visit']),
    doctor: `Dr. ${faker.person.lastName()}`,
    department: faker.helpers.arrayElement([
      'Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'ENT',
    ]),
    reason: faker.lorem.sentence({ min: 3, max: 8 }),
    diagnosis: faker.helpers.maybe(() => faker.lorem.sentence({ min: 3, max: 6 }), { probability: 0.7 }) ?? '',
    notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.5 }) ?? '',
    status: faker.helpers.arrayElement(['completed', 'cancelled', 'no_show'] as const),
  }
}

export function generateVisits(patientIds: string[], countPerPatient?: number): Visit[] {
  return patientIds.flatMap((pid, i) =>
    Array.from({ length: countPerPatient ?? faker.number.int({ min: 1, max: 4 }) }, (_, j) =>
      generateVisit(pid, i * 100 + j)
    )
  )
}
