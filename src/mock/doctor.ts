import { getFaker } from './faker'
import type { Doctor, WeeklySchedule } from '@/models'

const departments = [
  'Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology',
  'Pediatrics', 'ENT', 'Ophthalmology', 'Psychiatry', 'Oncology',
  'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Rheumatology',
] as const

const specializationsList = [
  'Internal Medicine', 'Cardiology', 'Dermatology', 'Orthopedic Surgery',
  'Neurology', 'Pediatrics', 'Otolaryngology', 'Ophthalmology',
  'Psychiatry', 'Oncology', 'Endocrinology', 'Gastroenterology',
  'Pulmonology', 'Rheumatology', 'Sports Medicine', 'Geriatrics',
  'Pain Management', 'Sleep Medicine', 'Allergy & Immunology',
] as const

const languagesList = [
  'English', 'Spanish', 'French', 'Mandarin', 'Hindi', 'Arabic',
  'Portuguese', 'German', 'Japanese', 'Korean', 'Vietnamese', 'Italian',
] as const

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

const educations = [
  'MD, Harvard Medical School',
  'MD, Johns Hopkins University School of Medicine',
  'MD, Stanford University School of Medicine',
  'MD, University of California San Francisco',
  'MD, Mayo Clinic Alix School of Medicine',
  'MD, University of Pennsylvania Perelman School of Medicine',
  'MD, Columbia University Vagelos College of Physicians and Surgeons',
  'DO, Michigan State University College of Osteopathic Medicine',
  'MBBS, University of Oxford Medical School',
  'MD, University of Toronto Faculty of Medicine',
  'MD, Yale School of Medicine',
  'MD, Duke University School of Medicine',
] as const

export function generateWeeklySchedule(seed?: number): WeeklySchedule[] {
  const f = getFaker(seed)
  return dayNames.map((day) => ({
    day,
    startTime: day === 'Sunday' ? '' : '09:00',
    endTime: day === 'Sunday' ? '' : '17:00',
    isAvailable: day !== 'Sunday' && day !== 'Saturday',
  }))
}

export function generateDoctor(seed?: number): Doctor {
  const f = getFaker(seed)
  const firstName = f.person.firstName()
  const lastName = f.person.lastName()
  const specialty = f.helpers.arrayElement(departments)
  const createdAt = f.date.between({ from: '2015-01-01', to: '2024-06-01' }).toISOString()

  return {
    id: `DOC-${f.string.numeric(4)}`,
    name: `Dr. ${firstName} ${lastName}`,
    specialty,
    specializations: f.helpers.arrayElements(specializationsList, { min: 1, max: 4 }),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@clinic.com`,
    phoneNumber: f.phone.number({ style: 'national' }),
    bio: f.lorem.paragraph({ min: 2, max: 4 }),
    education: f.helpers.arrayElement(educations),
    experienceYears: f.number.int({ min: 3, max: 30 }),
    profileImage: f.image.avatarGitHub(),
    status: f.helpers.arrayElement(['active', 'inactive'] as const),
    availability: f.helpers.arrayElement(['available', 'busy', 'offline', 'on-leave'] as const),
    weeklySchedule: generateWeeklySchedule(),
    rating: f.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
    consultationFee: f.number.int({ min: 75, max: 500 }),
    department: specialty,
    languages: f.helpers.arrayElements(languagesList, { min: 1, max: 4 }),
    certifications: f.helpers.multiple(
      () => `Board Certified - ${f.helpers.arrayElement(specializationsList)}`,
      { count: { min: 1, max: 4 } }
    ),
    address: {
      street: f.location.streetAddress(),
      city: f.location.city(),
      state: f.location.state(),
      postalCode: f.location.zipCode(),
      country: 'US',
    },
    createdAt,
  }
}

export function generateDoctors(count: number, startSeed?: number): Doctor[] {
  return Array.from({ length: count }, (_, i) => generateDoctor(startSeed !== undefined ? startSeed + i : undefined))
}
