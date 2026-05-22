export const EntityStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Archived: 'archived',
  Invited: 'invited',
  Suspended: 'suspended',
} as const
export type EntityStatus = (typeof EntityStatus)[keyof typeof EntityStatus]

export const AppointmentStatus = {
  Scheduled: 'scheduled',
  CheckedIn: 'checked-in',
  InProgress: 'in-progress',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const
export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const ConversationStatus = {
  NeedsReview: 'needs-review',
  AiDrafted: 'ai-drafted',
  Resolved: 'resolved',
} as const
export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus]

export const Priority = {
  Urgent: 'urgent',
  High: 'high',
  Normal: 'normal',
  Low: 'low',
} as const
export type Priority = (typeof Priority)[keyof typeof Priority]

export const MessageAuthor = {
  Patient: 'patient',
  Staff: 'staff',
  Ai: 'ai',
} as const
export type MessageAuthor = (typeof MessageAuthor)[keyof typeof MessageAuthor]

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const
export type Gender = (typeof Gender)[keyof typeof Gender]

export const UrgencyLevel = {
  Critical: 'critical',
  High: 'high',
  Moderate: 'moderate',
  Low: 'low',
  Monitor: 'monitor',
} as const
export type UrgencyLevel = (typeof UrgencyLevel)[keyof typeof UrgencyLevel]

export const VisitStatus = {
  Completed: 'completed',
  Cancelled: 'cancelled',
  NoShow: 'no_show',
} as const
export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus]

export const ActivityType = {
  Alert: 'alert',
  Summary: 'summary',
  Suggestion: 'suggestion',
  Draft: 'draft',
  Review: 'review',
} as const
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]

export const NotificationType = {
  Message: 'message',
  Alert: 'alert',
  Reminder: 'reminder',
  LabResult: 'lab_result',
  Appointment: 'appointment',
  System: 'system',
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export const BloodType = {
  APositive: 'A+',
  ANegative: 'A-',
  BPositive: 'B+',
  BNegative: 'B-',
  ABPositive: 'AB+',
  ABNegative: 'AB-',
  OPositive: 'O+',
  ONegative: 'O-',
} as const
export type BloodType = (typeof BloodType)[keyof typeof BloodType]

export const NoteType = {
  General: 'general',
  Prescription: 'prescription',
  LabResult: 'lab_result',
  Referral: 'referral',
  Imaging: 'imaging',
} as const
export type NoteType = (typeof NoteType)[keyof typeof NoteType]

export const AvailabilityStatus = {
  Available: 'available',
  Busy: 'busy',
  Offline: 'offline',
  OnLeave: 'on-leave',
} as const
export type AvailabilityStatus = (typeof AvailabilityStatus)[keyof typeof AvailabilityStatus]
