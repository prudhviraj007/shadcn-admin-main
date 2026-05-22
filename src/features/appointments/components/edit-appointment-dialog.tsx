import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarClock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDoctorsList } from '@/features/doctors'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type Appointment, type AppointmentStatus } from '../types'

const appointmentStatuses = [
  'scheduled',
  'checked-in',
  'in-progress',
  'completed',
  'cancelled',
] as const

const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  'checked-in': 'Checked in',
  'in-progress': 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const appointmentTypes = [
  'In Clinic',
  'Telehealth',
  'Follow-up',
  'Vaccination',
  'Lab Review',
  'Specialist Visit',
] as const

const editAppointmentSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(2, 'Patient name must be at least 2 characters.'),
  doctor: z.string().min(1, 'Select a doctor.'),
  appointmentType: z.string().min(1, 'Select an appointment type.'),
  date: z
    .string()
    .min(1, 'Select an appointment date.')
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
      message: 'Enter a valid appointment date.',
    }),
  time: z.string().min(1, 'Select an appointment time.'),
  notes: z
    .string()
    .trim()
    .max(300, 'Notes must be 300 characters or fewer.')
    .optional(),
  status: z.enum(appointmentStatuses),
})

type EditAppointmentFormValues = z.infer<typeof editAppointmentSchema>

type EditAppointmentDialogProps = {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (appointment: Appointment) => Promise<void> | void
}

export function EditAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onSave,
}: EditAppointmentDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { data: doctorsData = [], isLoading: isLoadingDoctors } = useDoctorsList()

  const doctorNames = useMemo(() => {
    return doctorsData.map((d) => d.name)
  }, [doctorsData])

  const doctorSpecialties: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {}
    doctorsData.forEach((d) => {
      map[d.name] = d.specialty
    })
    return map
  }, [doctorsData])

  const form = useForm<EditAppointmentFormValues>({
    resolver: zodResolver(editAppointmentSchema),
    defaultValues: getFormValues(appointment),
  })

  useEffect(() => {
    if (appointment) {
      form.reset(getFormValues(appointment))
    }
  }, [appointment, form])

  const handleSubmit = async (values: EditAppointmentFormValues) => {
    if (!appointment) return

    setIsSaving(true)

    try {
      await onSave({
        ...appointment,
        patient: {
          ...appointment.patient,
          name: values.patientName,
        },
        doctor: values.doctor,
        specialty: doctorSpecialties[values.doctor] ?? appointment.specialty,
        type: values.appointmentType,
        date: values.date,
        time: formatTime(values.time),
        status: values.status,
        notes: values.notes,
      })
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSaving) return
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <div className='mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <CalendarClock className='size-5' />
          </div>
          <DialogTitle>Edit appointment</DialogTitle>
          <DialogDescription>
            Update appointment details, status, and care notes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='edit-appointment-form'
            onSubmit={form.handleSubmit(handleSubmit)}
            className='grid gap-4'
          >
            <FormField
              control={form.control}
              name='patientName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter patient full name'
                      autoComplete='off'
                      disabled={isSaving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='doctor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                     <Select
                       value={field.value}
                       onValueChange={field.onChange}
                       disabled={isSaving || isLoadingDoctors}
                     >
                       <FormControl>
                         <SelectTrigger className='w-full'>
                           <SelectValue placeholder={isLoadingDoctors ? 'Loading doctors...' : 'Select doctor'} />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {doctorNames.map((doctor) => (
                           <SelectItem key={doctor} value={doctor}>
                             {doctor}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='appointmentType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSaving}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type='date' disabled={isSaving} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type='time' disabled={isSaving} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSaving}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointmentStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {appointmentStatusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add symptoms, visit reason, or preparation notes'
                      className='min-h-24 resize-none'
                      disabled={isSaving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='gap-2 sm:justify-between'>
          <Button
            type='button'
            variant='outline'
            disabled={isSaving}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='edit-appointment-form'
            disabled={isSaving}
            className='gap-2'
          >
            {isSaving ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getFormValues(
  appointment: Appointment | null
): EditAppointmentFormValues {
  return {
    patientName: appointment?.patient.name ?? '',
    doctor: appointment?.doctor ?? '',
    appointmentType: appointment?.type ?? '',
    date: appointment?.date ?? '',
    time: toTimeInput(appointment?.time ?? ''),
    notes: appointment?.notes ?? '',
    status: appointment?.status ?? 'scheduled',
  }
}

function toTimeInput(value: string) {
  if (!value) return ''
  const date = new Date(`2026-01-01 ${value}`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toTimeString().slice(0, 5)
}

function formatTime(value: string) {
  const [hoursValue, minutesValue] = value.split(':')
  const hours = Number(hoursValue)
  const minutes = Number(minutesValue)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value
  }

  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12

  return `${displayHours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${suffix}`
}
