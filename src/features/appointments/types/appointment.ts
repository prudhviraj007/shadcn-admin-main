export type AppointmentStatus =
  | 'scheduled'
  | 'checked-in'
  | 'in-progress'
  | 'completed'
  | 'cancelled'

export type Appointment = {
  id: string
  patient: {
    name: string
    email: string
    avatar: string
  }
  doctor: string
  specialty: string
  date: string
  time: string
  type: string
  status: AppointmentStatus
  department?: string
  notes?: string
}
