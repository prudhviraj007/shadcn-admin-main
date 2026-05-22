import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Clinical Risk',
  },
  {
    value: 'feature',
    label: 'Patient Request',
  },
  {
    value: 'documentation',
    label: 'Chart Note',
  },
]

export const statuses = [
  {
    label: 'Needs Triage',
    value: 'backlog' as const,
    icon: HelpCircle,
  },
  {
    label: 'Queued',
    value: 'todo' as const,
    icon: Circle,
  },
  {
    label: 'In Review',
    value: 'in progress' as const,
    icon: Timer,
  },
  {
    label: 'Completed',
    value: 'done' as const,
    icon: CheckCircle,
  },
  {
    label: 'Deferred',
    value: 'canceled' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Critical',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]
