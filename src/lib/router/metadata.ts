import type { RouteMeta } from './types'
import type { RouteGuard } from './types'

export const routeMetadata: Record<string, RouteMeta> = {
  '/': { title: 'Dashboard', breadcrumb: 'Dashboard' },
  '/patients': { title: 'Patients', breadcrumb: 'Patients' },
  '/patients/$patientId': { title: 'Patient :patientId', breadcrumb: 'Profile' },
  '/doctors': { title: 'Doctors', breadcrumb: 'Doctors' },
  '/doctors/$doctorId': { title: 'Doctor :doctorId', breadcrumb: 'Profile' },
  '/appointments': { title: 'Appointments', breadcrumb: 'Appointments' },
  '/tasks': { title: 'Tasks', breadcrumb: 'Tasks' },
  '/users': { title: 'Care Team', breadcrumb: 'Care Team' },
  '/chats': { title: 'Chats', breadcrumb: 'Chats' },
  '/conversations': { title: 'Conversations', breadcrumb: 'Conversations' },
  '/notifications': { title: 'Notifications', breadcrumb: 'Notifications' },
  '/ai-assistant': { title: 'AI Assistant', breadcrumb: 'AI Assistant' },
  '/apps': { title: 'Apps & Integrations', breadcrumb: 'Apps' },
  '/settings': { title: 'Settings', breadcrumb: 'Settings' },
  '/settings/account': { title: 'Account Settings', breadcrumb: 'Account' },
  '/settings/appearance': { title: 'Appearance', breadcrumb: 'Appearance' },
  '/settings/display': { title: 'Display', breadcrumb: 'Display' },
  '/settings/notifications': { title: 'Notifications', breadcrumb: 'Notifications' },
  '/help-center': { title: 'Help Center', breadcrumb: 'Help Center' },
}

export const routeGuards: Record<string, RouteGuard> = {
  '/_authenticated': { requiresAuth: true, redirectTo: '/sign-in' },
  '/clerk/_authenticated': { requiresAuth: true, redirectTo: '/clerk/sign-in' },
}
