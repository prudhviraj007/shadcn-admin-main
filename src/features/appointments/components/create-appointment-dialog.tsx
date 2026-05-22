import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { type AppointmentStatus } from '../types'

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
  'General Consultation',
  'Follow-up',
  'Telehealth',
  'Vaccination',
  'Lab Review',
  'Specialist Visit',
] as const

const createAppointmentSchema = z.object({
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

export type CreateAppointmentFormValues = z.infer<
  typeof createAppointmentSchema
>

type CreateAppointmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (values: CreateAppointmentFormValues) => Promise<void> | void
}

const defaultValues: CreateAppointmentFormValues = {
  patientName: '',
  doctor: '',
  appointmentType: '',
  date: '',
  time: '',
  notes: '',
  status: 'scheduled',
}

export function CreateAppointmentDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateAppointmentDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { data: doctorsData = [], isLoading: isLoadingDoctors } = useDoctorsList()

  const doctorNames = useMemo(() => {
    return doctorsData.map((d) => d.name)
  }, [doctorsData])

  const form = useForm<CreateAppointmentFormValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues,
  })

  const handleSubmit = async (values: CreateAppointmentFormValues) => {
    setIsSaving(true)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 800))
      await onCreate?.(values)
      toast.success('Appointment created', {
        description: `${values.patientName} is scheduled with ${values.doctor}.`,
      })
      form.reset(defaultValues)
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSaving) return
    if (!nextOpen) form.reset(defaultValues)
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <div className='mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <CalendarPlus className='size-5' />
          </div>
          <DialogTitle>Create appointment</DialogTitle>
          <DialogDescription>
            Schedule a patient visit and keep the clinic team aligned.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='create-appointment-form'
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
            form='create-appointment-form'
            disabled={isSaving}
            className='gap-2'
          >
            {isSaving ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Creating...
              </>
            ) : (
              <>
                <CalendarPlus className='size-4' />
                Create appointment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
