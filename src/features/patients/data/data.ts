import { type PatientStatus, type PatientTag, type NoteType } from './schema'

export const patientStatuses = [
  { label: 'Active', value: 'active' as PatientStatus },
  { label: 'Inactive', value: 'inactive' as PatientStatus },
  { label: 'Archived', value: 'archived' as PatientStatus },
]

export const patientStatusColors: Record<PatientStatus, string> = {
  active: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  inactive: 'bg-neutral-300/40 border-neutral-300',
  archived: 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
}

export const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const patientTags: PatientTag[] = [
  { value: 'high-risk', label: 'High Risk', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300' },
  { value: 'follow-up', label: 'Follow Up', color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
  { value: 'new-patient', label: 'New Patient', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'chronic', label: 'Chronic', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'medication-review', label: 'Medication Review', color: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300' },
  { value: 'telehealth', label: 'Telehealth', color: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300' },
  { value: 'emergency', label: 'Emergency', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 'referral', label: 'Referral', color: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300' },
]

export const noteTypes: { label: string; value: NoteType }[] = [
  { label: 'General', value: 'general' },
  { label: 'Prescription', value: 'prescription' },
  { label: 'Lab Result', value: 'lab_result' },
  { label: 'Referral', value: 'referral' },
  { label: 'Imaging', value: 'imaging' },
]

export const noteTypeColors: Record<NoteType, string> = {
  general: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300',
  prescription: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  lab_result: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  referral: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
  imaging: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
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
]

export const visitTypes = [
  'Check-up',
  'Follow-up',
  'Consultation',
  'Emergency',
  'Procedure',
  'Lab Visit',
]
