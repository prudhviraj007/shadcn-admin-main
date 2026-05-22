import { Edit3, Eye, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Appointment } from '../types'

type AppointmentActionsDropdownProps = {
  appointment: Appointment
  onView: (appointment: Appointment) => void
  onEdit: (appointment: Appointment) => void
  onDelete: (appointment: Appointment) => void
}

export function AppointmentActionsDropdown({
  appointment,
  onView,
  onEdit,
  onDelete,
}: AppointmentActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='size-8'>
          <MoreHorizontal className='size-4' />
          <span className='sr-only'>
            Open actions for {appointment.patient.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Appointment</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(appointment)}>
          <Eye className='size-4' />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(appointment)}>
          <Edit3 className='size-4' />
          Edit appointment
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageCircle className='size-4' />
          Message patient
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={() => onDelete(appointment)}
        >
          <Trash2 className='size-4' />
          Delete appointment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
