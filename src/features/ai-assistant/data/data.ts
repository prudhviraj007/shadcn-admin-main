import { type UrgencyLevel } from '../types'

export const urgencyColors: Record<UrgencyLevel, string> = {
  critical: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
  moderate:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  monitor:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
}

export const urgencyLabels: Record<UrgencyLevel, string> = {
  critical: 'Critical',
  moderate: 'Moderate',
  monitor: 'Monitor',
}

export const activityTypeIcons: Record<string, string> = {
  alert: 'AlertTriangle',
  summary: 'FileText',
  suggestion: 'Lightbulb',
  draft: 'BotMessageSquare',
  review: 'UserCheck',
}
