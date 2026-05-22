import {
  BarChart3,
  BotMessageSquare,
  BrainCircuit,
  CalendarDays,
  Settings,
  LayoutDashboard,
  MessagesSquare,
  Stethoscope,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Clinic AI Assistant',
      logo: Command,
      plan: 'Healthcare SaaS',
    },
    {
      name: 'CareOps Clinic',
      logo: GalleryVerticalEnd,
      plan: 'Multi-site Care',
    },
    {
      name: 'Northstar Health',
      logo: AudioWaveform,
      plan: 'AI Pilot',
    },
  ],
  navGroups: [
    {
      title: 'Clinic',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
          roles: ['admin', 'doctor', 'nurse', 'receptionist'],
        },
        {
          title: 'Appointments',
          url: '/tasks',
          icon: CalendarDays,
          roles: ['admin', 'doctor', 'nurse', 'receptionist'],
        },
        {
          title: 'Conversations',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
          roles: ['admin', 'doctor'],
        },
        {
          title: 'AI Assistant',
          url: '/ai-assistant',
          icon: BotMessageSquare,
          roles: ['admin', 'doctor'],
        },
        {
          title: 'Patients',
          url: '/patients',
          icon: Users,
          roles: ['admin', 'doctor', 'nurse', 'receptionist'],
        },
        {
          title: 'Doctors',
          url: '/doctors',
          icon: Stethoscope,
          roles: ['admin'],
        },
        {
          title: 'AI Settings',
          url: '/apps',
          icon: BrainCircuit,
          roles: ['admin'],
        },
        {
          title: 'Clinic Settings',
          url: '/settings',
          icon: Settings,
          roles: ['admin'],
        },
        {
          title: 'Reports',
          url: '/help-center',
          icon: BarChart3,
          roles: ['admin', 'doctor'],
        },
      ],
    },
  ],
}
