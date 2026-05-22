import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Mail, Phone, Star, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { getDisplayNameInitials } from '@/lib/utils'
import { availabilityColors } from '../data/data'
import { type Doctor } from '../data/schema'

type DoctorProfileHeaderProps = {
  doctor: Doctor
}

export function DoctorProfileHeader({ doctor }: DoctorProfileHeaderProps) {
  const navigate = useNavigate()
  const availabilityColor = availabilityColors[doctor.availability]

  return (
    <div className='space-y-6'>
      <Button
        variant='ghost'
        className='-ms-2 gap-2 text-muted-foreground'
        onClick={() => navigate({ to: '/doctors' })}
      >
        <ArrowLeft size={16} />
        Back to Doctors
      </Button>

      <div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex items-start gap-4'>
          <Avatar className='size-20'>
            <AvatarFallback className='text-2xl'>
              {getDisplayNameInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-bold tracking-tight'>
                {doctor.name}
              </h1>
              <Badge
                variant='outline'
                className={cn('capitalize', availabilityColor)}
              >
                {doctor.availability}
              </Badge>
            </div>
            <div className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
              <Briefcase size={14} />
              {doctor.specialty}
              <span className='mx-1'>&middot;</span>
              <Star
                size={14}
                className='fill-amber-400 text-amber-400'
              />
              {doctor.rating}
              <span className='mx-1'>&middot;</span>
              {doctor.experienceYears} years experience
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {doctor.specializations.map((spec) => (
                <Badge key={spec} variant='secondary' className='text-xs'>
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='flex items-center gap-2 text-sm'>
          <Mail size={14} className='text-muted-foreground' />
          <span>{doctor.email}</span>
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <Phone size={14} className='text-muted-foreground' />
          <span>{doctor.phoneNumber}</span>
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <span className='font-medium'>${doctor.consultationFee}</span>
          <span className='text-muted-foreground'>consultation fee</span>
        </div>
      </div>

      <Separator />
    </div>
  )
}
