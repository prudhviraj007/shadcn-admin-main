import { faker } from '@faker-js/faker'
import { type Appointment } from '../types/appointment'

const appointmentStatuses = ['scheduled', 'checked-in', 'in-progress', 'completed', 'cancelled'] as const
const appointmentTypes = ['Check-up', 'Follow-up', 'Consultation', 'Procedure', 'Telehealth', 'Lab Visit']
const appointmentTimes = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
]
const specialties = [
  'Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
  'Pediatrics', 'ENT', 'Ophthalmology', 'Psychiatry', 'Oncology',
]

export function generateAppointment(seed?: number): Appointment {
  if (seed !== undefined) faker.seed(seed)

  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const status = faker.helpers.arrayElement(appointmentStatuses)
  const date =
    status === 'scheduled' || status === 'checked-in' || status === 'in-progress'
      ? faker.date.soon({ days: 14 }).toISOString().split('T')[0]
      : faker.date.recent({ days: 60 }).toISOString().split('T')[0]

  return {
    id: `APT-${faker.string.numeric(4)}`,
    patient: {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      avatar: faker.image.avatarGitHub(),
    },
    doctor: `Dr. ${faker.person.lastName()}`,
    specialty: faker.helpers.arrayElement(specialties),
    department: faker.helpers.arrayElement(specialties),
    date,
    time: faker.helpers.arrayElement(appointmentTimes),
    type: faker.helpers.arrayElement(appointmentTypes),
    status,
    notes: faker.helpers.maybe(() => faker.lorem.sentence({ min: 5, max: 15 }), { probability: 0.4 }),
  }
}

export function generateAppointments(count: number, startSeed?: number): Appointment[] {
  return Array.from({ length: count }, (_, i) => generateAppointment(startSeed !== undefined ? startSeed + i : undefined))
}
