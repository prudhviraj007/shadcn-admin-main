import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getDisplayNameInitials } from '@/lib/utils'
import { Mail, Clock, Star } from 'lucide-react'
import { availabilityColors } from '../data/data'
import { type Doctor } from '../data/schema'
import { DoctorCardActions } from './doctor-card-actions'

type DoctorCardProps = {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const availabilityColor = availabilityColors[doctor.availability]

  return (
    <Card className='group relative transition-shadow hover:shadow-md'>
      <CardHeader className='flex flex-row items-start justify-between gap-3 pb-3 max-sm:gap-2'>
        <div className='flex items-start gap-3 max-sm:gap-2'>
          <Avatar className='size-12 max-sm:size-10'>
            <AvatarFallback className='text-sm'>
              {getDisplayNameInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h3 className='font-semibold leading-none'>{doctor.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {doctor.specialty}
            </p>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Star size={12} className='fill-amber-400 text-amber-400' />
              {doctor.rating} &middot; {doctor.experienceYears} yrs exp
            </div>
          </div>
        </div>
        <DoctorCardActions doctor={doctor} />
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex flex-wrap gap-1'>
          <Badge
            variant='outline'
            className={cn('capitalize text-xs', availabilityColor)}
          >
            {doctor.availability}
          </Badge>
          {doctor.specializations.slice(0, 2).map((spec) => (
            <Badge key={spec} variant='secondary' className='text-xs'>
              {spec}
            </Badge>
          ))}
          {doctor.specializations.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{doctor.specializations.length - 2}
            </Badge>
          )}
        </div>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Mail size={12} />
          {doctor.email}
        </div>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Clock size={12} />
          {doctor.weeklySchedule.find((d) => d.isAvailable)?.startTime ?? 'N/A'} -{' '}
          {doctor.weeklySchedule.find((d) => d.isAvailable)?.endTime ?? 'N/A'}
        </div>
      </CardContent>
    </Card>
  )
}
