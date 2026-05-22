import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { generateAppointments } from '../data/generate-appointments'
import { type Appointment } from '../types/appointment'

const appointmentsApi = createApi<Appointment>('appointments')

let mockAppointments: Appointment[] | null = null

function getMockAppointments(): Appointment[] {
  if (!mockAppointments) {
    mockAppointments = generateAppointments(30, 300)
  }
  return mockAppointments
}

export async function getAppointments(): Promise<Appointment[]> {
  if (!isSupabaseEnabled()) return getMockAppointments()
  const { data, error } = await appointmentsApi.getAll({ orderBy: 'date', ascending: true })
  if (error) throw error
  return data
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  if (!isSupabaseEnabled()) {
    return getMockAppointments().find((a) => a.id === id) ?? null
  }
  const { data, error } = await appointmentsApi.getById(id)
  if (error) throw error
  return data
}

export async function createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
  if (!isSupabaseEnabled()) {
    const records = getMockAppointments()
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      patient: { name: '', email: '', avatar: '' },
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      type: '',
      status: 'scheduled',
      ...appointment,
    } as Appointment
    records.push(newAppointment)
    return newAppointment
  }
  const record = {
    ...appointment,
    id: crypto.randomUUID(),
    department: appointment.department ?? 'General',
  }
  console.log('[createAppointment] payload:', JSON.stringify(record))
  const { data, error } = await appointmentsApi.create(record as Partial<Appointment>)
  if (error) {
    console.error('[createAppointment] Supabase create failed:', error.message)
    throw error
  }
  console.log('[createAppointment] created:', JSON.stringify(data))
  return data
}

export async function updateAppointment(appointment: Appointment): Promise<Appointment> {
  if (!isSupabaseEnabled()) {
    const records = getMockAppointments()
    const index = records.findIndex((a) => a.id === appointment.id)
    if (index === -1) throw new Error('Appointment not found')
    records[index] = appointment
    return appointment
  }
  const { data, error } = await appointmentsApi.update(appointment.id, appointment)
  if (error) throw error
  return data
}

export async function deleteAppointment(appointmentId: string): Promise<string> {
  if (!isSupabaseEnabled()) {
    const records = getMockAppointments()
    const index = records.findIndex((a) => a.id === appointmentId)
    if (index !== -1) records.splice(index, 1)
    return appointmentId
  }
  const { error } = await appointmentsApi.remove(appointmentId)
  if (error) throw error
  return appointmentId
}

export function subscribeToAppointments(
  callback: (payload: { eventType: string; new: Appointment; old: Appointment }) => void
) {
  if (!isSupabaseEnabled()) return () => {}
  return appointmentsApi.subscribe(callback as never)
}
