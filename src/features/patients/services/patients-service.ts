import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { generatePatients } from '../data/generate-patients'
import { type Patient } from '../data/schema'

const patientsApi = createApi<Patient>('patients')

// Module-level cache for mock data when Supabase is not configured
let mockPatients: Patient[] | null = null

function getMockPatients(): Patient[] {
  if (!mockPatients) {
    mockPatients = generatePatients(25, 100)
  }
  return mockPatients
}

function resetMockPatients(): void {
  mockPatients = null
}

export async function getPatients(): Promise<Patient[]> {
  if (!isSupabaseEnabled()) return getMockPatients()
  const { data, error } = await patientsApi.getAll({ orderBy: 'last_name', ascending: true })
  if (error) throw error
  return data
}

export async function getPatientById(id: string): Promise<Patient | null> {
  if (!isSupabaseEnabled()) {
    return getMockPatients().find((p) => p.id === id) ?? null
  }
  const { data, error } = await patientsApi.getById(id)
  if (error) throw error
  return data
}

export async function createPatient(patient: Partial<Patient>): Promise<Patient> {
  if (!isSupabaseEnabled()) {
    const records = getMockPatients()
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'other',
      status: 'active',
      bloodType: '',
      allergies: [],
      emergencyContact: { name: '', phone: '', relationship: '' },
      address: '',
      insuranceProvider: '',
      insuranceId: '',
      tags: [],
      lastVisit: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...patient,
    } as Patient
    records.push(newPatient)
    return newPatient
  }
  const { data, error } = await patientsApi.create({ ...patient, id: crypto.randomUUID() } as Partial<Patient>)
  if (error) throw error
  return data
}

export async function updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
  if (!isSupabaseEnabled()) {
    const records = getMockPatients()
    const index = records.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Patient not found')
    records[index] = { ...records[index], ...patient, updatedAt: new Date().toISOString() }
    return records[index]
  }
  const { data, error } = await patientsApi.update(id, patient)
  if (error) throw error
  return data
}

export async function deletePatient(id: string): Promise<void> {
  if (!isSupabaseEnabled()) {
    const records = getMockPatients()
    const index = records.findIndex((p) => p.id === id)
    if (index !== -1) records.splice(index, 1)
    return
  }
  const { error } = await patientsApi.remove(id)
  if (error) throw error
}

export function subscribeToPatients(
  callback: (payload: { eventType: string; new: Patient; old: Patient }) => void
) {
  if (!isSupabaseEnabled()) return () => {}
  return patientsApi.subscribe(callback as never)
}

export { resetMockPatients }
