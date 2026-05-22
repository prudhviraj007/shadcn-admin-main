import { type AvailabilityStatus } from './schema'

export const availabilityStatuses: { label: string; value: AvailabilityStatus }[] = [
  { label: 'Available', value: 'available' },
  { label: 'Busy', value: 'busy' },
  { label: 'Offline', value: 'offline' },
  { label: 'On Leave', value: 'on-leave' },
]

export const availabilityColors: Record<AvailabilityStatus, string> = {
  available: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  busy: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  offline: 'bg-neutral-300/40 text-neutral-700 border-neutral-300 dark:text-neutral-300',
  'on-leave': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
}

export const availabilityIcons: Record<AvailabilityStatus, string> = {
  available: '🟢',
  busy: '🟡',
  offline: '⚪',
  'on-leave': '🔴',
}

export const departments = [
  'Primary Care',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Oncology',
  'ENT',
  'Ophthalmology',
  'Psychiatry',
  'Radiology',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine',
  'Obstetrics & Gynecology',
]

export const specializationsList = [
  'General Medicine',
  'Hypertension Management',
  'Diabetes Care',
  'Cardiac Imaging',
  'Interventional Cardiology',
  'Pediatric Cardiology',
  'Skin Surgery',
  'Cosmetic Dermatology',
  'Pediatric Dermatology',
  'General Pediatrics',
  'Adolescent Medicine',
  'Sports Medicine',
  'Joint Replacement',
  'Spine Surgery',
  'General Neurology',
  'Stroke Management',
  'Headache Medicine',
  'Medical Oncology',
  'Radiation Oncology',
  'Hematology',
  'General ENT',
  'Pediatric ENT',
  'Cataract Surgery',
  'Glaucoma Management',
  'General Psychiatry',
  'Child Psychiatry',
  'Diagnostic Radiology',
  'Interventional Radiology',
  'Emergency Care',
  'Trauma Medicine',
  'Family Medicine',
  'Preventive Care',
  'Internal Medicine',
  'Women\'s Health',
  'Prenatal Care',
]

export const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const languagesList = [
  'English',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Russian',
  'Japanese',
  'Korean',
  'Italian',
  'Vietnamese',
  'Thai',
  'Turkish',
]
