// Reusable enums and status types
export {
  EntityStatusSchema,
  type EntityStatus,
  AppointmentStatusSchema,
  type AppointmentStatus,
  ConversationStatusSchema,
  type ConversationStatus,
  PrioritySchema,
  type Priority,
  MessageAuthorSchema,
  type MessageAuthor,
  GenderSchema,
  type Gender,
  UrgencyLevelSchema,
  type UrgencyLevel,
  VisitStatusSchema,
  type VisitStatus,
  ActivityTypeSchema,
  type ActivityType,
  NotificationTypeSchema,
  type NotificationType,
  BloodTypeSchema,
  type BloodType,
  NoteTypeSchema,
  type NoteType,
  AvailabilityStatusSchema,
  type AvailabilityStatus,
  ChangeTypeSchema,
  type ChangeType,
  UserRoleSchema,
  type UserRole,
} from './enums'

// Shared base types
export {
  AddressSchema,
  type Address,
  EmergencyContactSchema,
  type EmergencyContact,
  InsuranceSchema,
  type Insurance,
  TimestampsSchema,
  type Timestamps,
  PaginatedResponseSchema,
} from './common'

// Domain models
export {
  AppointmentSchema,
  type Appointment,
  AppointmentPatientRefSchema,
  type AppointmentPatientRef,
  AppointmentDoctorRefSchema,
  type AppointmentDoctorRef,
  AppointmentTypeSchema,
  type AppointmentType,
} from './appointment'

export {
  PatientSchema,
  type Patient,
  PatientSummarySchema,
  type PatientSummary,
  MedicalNoteSchema,
  type MedicalNote,
  VisitSchema,
  type Visit,
  PatientTagSchema,
  type PatientTag,
} from './patient'

export {
  DoctorSchema,
  type Doctor,
  DoctorSummarySchema,
  type DoctorSummary,
  WeeklyScheduleSchema,
  type WeeklySchedule,
} from './doctor'

export {
  ConversationSchema,
  type Conversation,
  MessageSchema,
  type Message,
} from './conversation'

export {
  NotificationSchema,
  type Notification,
  NotificationPreferencesSchema,
  type NotificationPreferences,
} from './notification'

export {
  AiActivitySchema,
  type AiActivity,
  UrgentSymptomSchema,
  type UrgentSymptom,
  AiSuggestionSchema,
  type AiSuggestion,
  AiSummarySchema,
  type AiSummary,
  AiMetricSchema,
  type AiMetric,
} from './ai-activity'
