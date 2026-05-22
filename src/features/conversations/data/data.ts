import { type ConversationStatus, type Priority } from '../types/conversation'

export const statusLabels: Record<ConversationStatus, string> = {
  'needs-review': 'Needs Review',
  'ai-drafted': 'AI Drafted',
  resolved: 'Resolved',
}

export const statusColors: Record<ConversationStatus, string> = {
  'needs-review':
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  'ai-drafted':
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
  resolved:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
}

export const priorityLabels: Record<Priority, string> = {
  urgent: 'Urgent',
  normal: 'Normal',
  low: 'Low',
}

export const priorityColors: Record<Priority, string> = {
  urgent:
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  normal:
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  low: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300',
}

export const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Unread', value: 'unread' },
  { label: 'Needs Review', value: 'needs-review' },
  { label: 'AI Drafted', value: 'ai-drafted' },
  { label: 'Resolved', value: 'resolved' },
] as const
