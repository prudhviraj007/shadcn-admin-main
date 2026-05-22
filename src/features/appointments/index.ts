export { AppointmentsPage } from './components/appointments-page'
export {
  CreateAppointmentDialog,
  type CreateAppointmentFormValues,
} from './components/create-appointment-dialog'
export { AppointmentActionsDropdown } from './components/appointment-actions-dropdown'
export { AppointmentDetailsDrawer } from './components/appointment-details-drawer'
export {
  AppointmentStatusBadge,
  appointmentStatusConfig,
} from './components/appointment-status-badge'
export { EditAppointmentDialog } from './components/edit-appointment-dialog'
export { useFilteredAppointments, useAppointmentsList, useAppointmentMutations } from './hooks'
export {
  deleteAppointment,
  getAppointments,
  updateAppointment,
  createAppointment,
} from './services'
export { useAppointmentsStore } from './store'
export type { Appointment, AppointmentStatus } from './types'
