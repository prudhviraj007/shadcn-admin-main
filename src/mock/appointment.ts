import { getFaker } from './faker'
import type { Appointment, AppointmentType } from '@/models'

const appointmentTypes = ['Check-up', 'Follow-up', 'Consultation', 'Procedure', 'Telehealth', 'Lab Visit'] as const
const appointmentTimes = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
] as const
const departments = [
  'Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
  'Pediatrics', 'ENT', 'Ophthalmology', 'Psychiatry', 'Oncology',
] as const

export function generateAppointment(seed?: number): Appointment {
  const f = getFaker(seed)
  const firstName = f.person.firstName()
  const lastName = f.person.lastName()
  const status = f.helpers.arrayElement(['scheduled', 'checked-in', 'in-progress', 'completed', 'cancelled'] as const)
  const date =
    status === 'scheduled' || status === 'checked-in' || status === 'in-progress'
      ? f.date.soon({ days: 14 }).toISOString().split('T')[0]
      : f.date.recent({ days: 60 }).toISOString().split('T')[0]
  const doctorFirstName = f.person.firstName()
  const doctorLastName = f.person.lastName()
  const createdAt = f.date.recent({ days: 30 }).toISOString()

  return {
    id: `APT-${f.string.numeric(4)}`,
    patient: {
      id: `PAT-${f.string.numeric(4)}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: f.phone.number({ style: 'national' }),
      avatar: f.image.avatarGitHub(),
    },
    doctor: {
      id: `DOC-${f.string.numeric(4)}`,
      name: `Dr. ${doctorFirstName} ${doctorLastName}`,
      specialty: f.helpers.arrayElement(departments),
    },
    date,
    time: f.helpers.arrayElement(appointmentTimes),
    duration: f.helpers.arrayElement([15, 30, 45, 60]),
    type: f.helpers.arrayElement(appointmentTypes),
    status,
    priority: f.helpers.arrayElement(['urgent', 'high', 'normal', 'low'] as const),
    department: f.helpers.arrayElement(departments),
    notes: f.helpers.maybe(() => f.lorem.sentence({ min: 5, max: 15 })),
    reason: f.helpers.maybe(() => f.lorem.sentence({ min: 3, max: 8 })),
    createdAt,
    updatedAt: f.date.between({ from: new Date(createdAt), to: new Date() }).toISOString(),
  }
}

export function generateAppointments(count: number, startSeed?: number): Appointment[] {
  return Array.from({ length: count }, (_, i) => generateAppointment(startSeed !== undefined ? startSeed + i : undefined))
}

export function generateAppointmentTypes(): AppointmentType[] {
  return [
    { value: 'check-up', label: 'Check-up', duration: 30 },
    { value: 'follow-up', label: 'Follow-up', duration: 15 },
    { value: 'consultation', label: 'Consultation', duration: 45 },
    { value: 'procedure', label: 'Procedure', duration: 60 },
    { value: 'telehealth', label: 'Telehealth', duration: 30 },
    { value: 'lab-visit', label: 'Lab Visit', duration: 15 },
  ]
}
