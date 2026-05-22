import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { generateDoctors } from '../data/generate-doctors'
import { type Doctor } from '../data/schema'

const doctorsApi = createApi<Doctor>('doctors')

let mockDoctors: Doctor[] | null = null

function getMockDoctors(): Doctor[] {
  if (!mockDoctors) {
    mockDoctors = generateDoctors(15, 200)
  }
  return mockDoctors
}

export async function getDoctors(): Promise<Doctor[]> {
  if (!isSupabaseEnabled()) return getMockDoctors()
  const { data, error } = await doctorsApi.getAll({ orderBy: 'name', ascending: true })
  if (error) throw error
  return data
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  if (!isSupabaseEnabled()) {
    return getMockDoctors().find((d) => d.id === id) ?? null
  }
  const { data, error } = await doctorsApi.getById(id)
  if (error) throw error
  return data
}

export async function createDoctor(doctor: Partial<Doctor>): Promise<Doctor> {
  if (!isSupabaseEnabled()) {
    const records = getMockDoctors()
    const newDoctor: Doctor = {
      id: crypto.randomUUID(),
      name: '',
      specialty: '',
      specializations: [],
      email: '',
      phoneNumber: '',
      bio: '',
      education: '',
      experienceYears: 0,
      availability: 'available',
      weeklySchedule: [],
      rating: 0,
      consultationFee: 0,
      department: '',
      languages: [],
      certifications: [],
      createdAt: new Date().toISOString(),
      ...doctor,
    } as Doctor
    records.push(newDoctor)
    return newDoctor
  }
  const { data, error } = await doctorsApi.create({ ...doctor, id: crypto.randomUUID() } as Partial<Doctor>)
  if (error) throw error
  return data
}

export async function updateDoctor(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
  if (!isSupabaseEnabled()) {
    const records = getMockDoctors()
    const index = records.findIndex((d) => d.id === id)
    if (index === -1) throw new Error('Doctor not found')
    records[index] = { ...records[index], ...doctor }
    return records[index]
  }
  const { data, error } = await doctorsApi.update(id, doctor)
  if (error) throw error
  return data
}

export async function deleteDoctor(id: string): Promise<void> {
  if (!isSupabaseEnabled()) {
    const records = getMockDoctors()
    const index = records.findIndex((d) => d.id === id)
    if (index !== -1) records.splice(index, 1)
    return
  }
  const { error } = await doctorsApi.remove(id)
  if (error) throw error
}

export function subscribeToDoctors(
  callback: (payload: { eventType: string; new: Doctor; old: Doctor }) => void
) {
  if (!isSupabaseEnabled()) return () => {}
  return doctorsApi.subscribe(callback as never)
}
