import { faker } from '@faker-js/faker'
import { type Doctor } from './schema'
import { departments, specializationsList, languagesList, weekDays } from './data'

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
]

export function generateDoctor(seed?: number): Doctor {
  if (seed !== undefined) faker.seed(seed)

  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const specialty = faker.helpers.arrayElement(departments)
  const department = specialty
  const createdAt = faker.date.between({ from: '2015-01-01', to: '2024-06-01' }).toISOString()

  return {
    id: `DOC-${faker.string.numeric(4)}`,
    name: `Dr. ${firstName} ${lastName}`,
    specialty,
    specializations: faker.helpers.arrayElements(
      specializationsList.filter((s) => s.toLowerCase().includes(specialty.split(' ')[0].toLowerCase()) || Math.random() > 0.7),
      { min: 1, max: 4 }
    ),
    profileImage: faker.image.avatarGitHub(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@clinic.com`,
    phoneNumber: faker.phone.number({ style: 'national' }),
    bio: faker.lorem.paragraph({ min: 2, max: 4 }),
    education: faker.helpers.arrayElement(educations),
    experienceYears: faker.number.int({ min: 3, max: 30 }),
    availability: faker.helpers.arrayElement(['available', 'busy', 'offline', 'on-leave'] as const),
    weeklySchedule: weekDays.map((day) => ({
      day,
      startTime: day === 'Sunday' ? '' : '09:00',
      endTime: day === 'Sunday' ? '' : '17:00',
      isAvailable: day !== 'Sunday',
    })),
    rating: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
    consultationFee: faker.number.int({ min: 75, max: 500 }),
    department,
    languages: faker.helpers.arrayElements(languagesList, { min: 1, max: 4 }),
    certifications: faker.helpers.multiple(
      () => `Board Certified - ${faker.helpers.arrayElement(specializationsList)}`,
      { count: { min: 1, max: 4 } }
    ),
    createdAt,
  }
}

export function generateDoctors(count: number, startSeed?: number): Doctor[] {
  return Array.from({ length: count }, (_, i) => generateDoctor(startSeed !== undefined ? startSeed + i : undefined))
}
