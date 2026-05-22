import {
  type AppointmentStatus,
  type Priority,
} from './enums'

export type AppointmentPatient = {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
}

export type AppointmentDoctor = {
  id: string
  name: string
  specialty: string
}

export type Appointment = {
  id: string
  patient: AppointmentPatient
  doctor: AppointmentDoctor
  date: string
  time: string
  duration: number
  type: string
  status: AppointmentStatus
  priority: Priority
  department: string
  notes?: string
  reason?: string
  createdAt: string
  updatedAt: string
}

export type AppointmentType = {
  value: string
  label: string
  duration: number
}
