import { z } from 'zod'

/** Active / inactive / archived lifecycle status for users, patients, doctors */
export const EntityStatusSchema = z.enum([
  'active',
  'inactive',
  'archived',
  'invited',
  'suspended',
])
export type EntityStatus = z.infer<typeof EntityStatusSchema>

/** Scheduling lifecycle of an appointment */
export const AppointmentStatusSchema = z.enum([
  'scheduled',
  'checked-in',
  'in-progress',
  'completed',
  'cancelled',
])
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>

/** AI-assisted conversation review state */
export const ConversationStatusSchema = z.enum([
  'needs-review',
  'ai-drafted',
  'resolved',
])
export type ConversationStatus = z.infer<typeof ConversationStatusSchema>

/** Urgency / priority level used across tasks, appointments, notifications */
export const PrioritySchema = z.enum(['urgent', 'high', 'normal', 'low'])
export type Priority = z.infer<typeof PrioritySchema>

/** Author of a message in a conversation */
export const MessageAuthorSchema = z.enum(['patient', 'staff', 'ai'])
export type MessageAuthor = z.infer<typeof MessageAuthorSchema>

/** Patient gender */
export const GenderSchema = z.enum(['male', 'female', 'other'])
export type Gender = z.infer<typeof GenderSchema>

/** Clinical urgency level for symptom detection */
export const UrgencyLevelSchema = z.enum([
  'critical',
  'high',
  'moderate',
  'low',
  'monitor',
])
export type UrgencyLevel = z.infer<typeof UrgencyLevelSchema>

/** Visit outcome */
export const VisitStatusSchema = z.enum(['completed', 'cancelled', 'no_show'])
export type VisitStatus = z.infer<typeof VisitStatusSchema>

/** AI activity feed entry type */
export const ActivityTypeSchema = z.enum([
  'alert',
  'summary',
  'suggestion',
  'draft',
  'review',
])
export type ActivityType = z.infer<typeof ActivityTypeSchema>

/** Push / in-app notification category */
export const NotificationTypeSchema = z.enum([
  'message',
  'alert',
  'reminder',
  'lab_result',
  'appointment',
  'system',
])
export type NotificationType = z.infer<typeof NotificationTypeSchema>

/** ISO blood type classification */
export const BloodTypeSchema = z.enum([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
])
export type BloodType = z.infer<typeof BloodTypeSchema>

/** Clinical note category */
export const NoteTypeSchema = z.enum([
  'general',
  'prescription',
  'lab_result',
  'referral',
  'imaging',
])
export type NoteType = z.infer<typeof NoteTypeSchema>

/** Real-time provider status indicator */
export const AvailabilityStatusSchema = z.enum([
  'available',
  'busy',
  'offline',
  'on-leave',
])
export type AvailabilityStatus = z.infer<typeof AvailabilityStatusSchema>

/** Change direction for metric comparisons */
export const ChangeTypeSchema = z.enum(['positive', 'negative', 'neutral'])
export type ChangeType = z.infer<typeof ChangeTypeSchema>

/** User role within the practice management system */
export const UserRoleSchema = z.enum([
  'superadmin',
  'admin',
  'cashier',
  'manager',
  'doctor',
  'nurse',
  'receptionist',
])
export type UserRole = z.infer<typeof UserRoleSchema>
