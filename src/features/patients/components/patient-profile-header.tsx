import { ArrowLeft, Calendar, Phone, Mail, MapPin } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { getDisplayNameInitials } from '@/lib/utils'
import { patientStatusColors } from '../data/data'
import { type Patient } from '../data/schema'
import { PatientTags } from './patient-tags'

type PatientProfileHeaderProps = {
  patient: Patient
}

export function PatientProfileHeader({ patient }: PatientProfileHeaderProps) {
  const navigate = useNavigate()
  const fullName = `${patient.firstName} ${patient.lastName}`
  const statusColor = patientStatusColors[patient.status]
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()

  return (
    <div className='space-y-6'>
      <Button
        variant='ghost'
        className='-ms-2 gap-2 text-muted-foreground'
        onClick={() => navigate({ to: '/patients' })}
      >
        <ArrowLeft size={16} />
        Back to Patients
      </Button>

      <div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex items-start gap-4'>
          <Avatar className='size-16'>
            <AvatarFallback className='text-lg'>
              {getDisplayNameInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-bold tracking-tight'>{fullName}</h1>
              <Badge variant='outline' className={cn('capitalize', statusColor)}>
                {patient.status}
              </Badge>
            </div>
            <PatientTags tags={patient.tags} />
            <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1'>
                <Calendar size={14} />
                {patient.dateOfBirth} ({age} yrs)
              </span>
              <span className='flex items-center gap-1 capitalize'>
                {patient.gender}
              </span>
              <span className='flex items-center gap-1'>
                Blood: {patient.bloodType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='flex items-center gap-2 text-sm'>
          <Mail size={14} className='text-muted-foreground' />
          <span>{patient.email}</span>
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <Phone size={14} className='text-muted-foreground' />
          <span>{patient.phoneNumber}</span>
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <MapPin size={14} className='text-muted-foreground' />
          <span>{patient.address}</span>
        </div>
      </div>

      <Separator />
    </div>
  )
}
