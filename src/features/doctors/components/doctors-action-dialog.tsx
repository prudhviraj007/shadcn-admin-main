import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { departments } from '../data/data'
import { type Doctor } from '../data/schema'
import { useDoctorMutations } from '../hooks/use-doctors-queries'

const defaultSchedule = [
  { day: 'Monday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'Tuesday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'Wednesday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'Thursday', startTime: '08:00', endTime: '17:00', isAvailable: true },
  { day: 'Friday', startTime: '08:00', endTime: '15:00', isAvailable: true },
  { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: false },
  { day: 'Sunday', startTime: '00:00', endTime: '00:00', isAvailable: false },
]

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  specialty: z.string().min(1, 'Specialty is required.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
  }),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
  department: z.string().min(1, 'Department is required.'),
  bio: z.string().min(1, 'Bio is required.'),
  education: z.string().min(1, 'Education is required.'),
  experienceYears: z.string().min(1, 'Experience is required.'),
  consultationFee: z.string().min(1, 'Consultation fee is required.'),
  languages: z.string().optional(),
  specializations: z.string().optional(),
})
type DoctorForm = z.infer<typeof formSchema>

type DoctorsActionDialogProps = {
  currentRow?: Doctor
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoctorsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: DoctorsActionDialogProps) {
  const isEdit = !!currentRow
  const { createEntity, updateEntity } = useDoctorMutations()
  const form = useForm<DoctorForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          specialty: currentRow.specialty,
          email: currentRow.email,
          phoneNumber: currentRow.phoneNumber,
          department: currentRow.department,
          bio: currentRow.bio,
          education: currentRow.education,
          experienceYears: String(currentRow.experienceYears),
          consultationFee: String(currentRow.consultationFee),
          languages: currentRow.languages.join(', '),
          specializations: currentRow.specializations.join(', '),
        }
      : {
          name: '',
          specialty: '',
          email: '',
          phoneNumber: '',
          department: '',
          bio: '',
          education: '',
          experienceYears: '',
          consultationFee: '',
          languages: '',
          specializations: '',
        },
  })

  const onSubmit = (values: DoctorForm) => {
    const doctorData: Doctor = {
      id: currentRow?.id ?? crypto.randomUUID(),
      name: values.name,
      specialty: values.specialty,
      specializations: values.specializations
        ? values.specializations.split(',').map((s) => s.trim())
        : [],
      email: values.email,
      phoneNumber: values.phoneNumber,
      bio: values.bio,
      education: values.education,
      experienceYears: Number(values.experienceYears) || 0,
      availability: 'available',
      weeklySchedule: defaultSchedule,
      rating: 4.0,
      consultationFee: Number(values.consultationFee) || 0,
      department: values.department,
      languages: values.languages
        ? values.languages.split(',').map((s) => s.trim())
        : [],
      certifications: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    if (isEdit) {
      updateEntity.mutateAsync({ ...currentRow!, ...doctorData, id: currentRow!.id })
    } else {
      createEntity.mutateAsync(doctorData)
    }
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update doctor profile details.'
              : 'Register a new doctor to the clinic.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='doctor-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Dr. John Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='specialty'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder='Cardiology' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='john.doe@clinic.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder='+1 555 0000' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='department'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select department'
                        items={departments.map((d) => ({ label: d, value: d }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='experienceYears'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type='number' min='0' placeholder='10' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='consultationFee'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fee ($)</FormLabel>
                      <FormControl>
                        <Input type='number' min='0' placeholder='150' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='languages'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages (comma separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='English, Spanish'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='education'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='MD, University Name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='specializations'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specializations (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Cardiac Imaging, Interventional Cardiology'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief professional biography...'
                        className='min-h-24 resize-y'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='doctor-form'>
            {isEdit ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
