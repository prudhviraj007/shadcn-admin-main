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
import { SelectDropdown } from '@/components/select-dropdown'
import { genders, bloodTypes } from '../data/data'
import { type Patient } from '../data/schema'
import { usePatientMutations } from '../hooks/use-patients-queries'

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
  }),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
  dateOfBirth: z.string().min(1, 'Date of birth is required.'),
  gender: z.string().min(1, 'Gender is required.'),
  bloodType: z.string().min(1, 'Blood type is required.'),
  address: z.string().min(1, 'Address is required.'),
  insuranceProvider: z.string().min(1, 'Insurance provider is required.'),
  insuranceId: z.string().min(1, 'Insurance ID is required.'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required.'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required.'),
  emergencyContactRelationship: z.string().min(1, 'Relationship is required.'),
  allergies: z.string().optional(),
})
type PatientForm = z.infer<typeof formSchema>

type PatientsActionDialogProps = {
  currentRow?: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: PatientsActionDialogProps) {
  const isEdit = !!currentRow
  const { createEntity, updateEntity } = usePatientMutations()
  const form = useForm<PatientForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: currentRow.firstName,
          lastName: currentRow.lastName,
          email: currentRow.email,
          phoneNumber: currentRow.phoneNumber,
          dateOfBirth: currentRow.dateOfBirth,
          gender: currentRow.gender,
          bloodType: currentRow.bloodType,
          address: currentRow.address,
          insuranceProvider: currentRow.insuranceProvider,
          insuranceId: currentRow.insuranceId,
          emergencyContactName: currentRow.emergencyContact.name,
          emergencyContactPhone: currentRow.emergencyContact.phone,
          emergencyContactRelationship: currentRow.emergencyContact.relationship,
          allergies: currentRow.allergies.join(', '),
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          dateOfBirth: '',
          gender: '',
          bloodType: '',
          address: '',
          insuranceProvider: '',
          insuranceId: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelationship: '',
          allergies: '',
        },
  })

  const onSubmit = (values: PatientForm) => {
    const patientData: Patient = {
      id: currentRow?.id ?? crypto.randomUUID(),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender as Patient['gender'],
      status: 'active',
      bloodType: values.bloodType,
      allergies: values.allergies
        ? values.allergies.split(',').map((a) => a.trim())
        : [],
      emergencyContact: {
        name: values.emergencyContactName,
        phone: values.emergencyContactPhone,
        relationship: values.emergencyContactRelationship,
      },
      address: values.address,
      insuranceProvider: values.insuranceProvider,
      insuranceId: values.insuranceId,
      tags: [],
      lastVisit: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    if (isEdit) {
      updateEntity.mutateAsync({ ...currentRow!, ...patientData, id: currentRow!.id })
    } else {
      createEntity.mutateAsync(patientData)
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
            {isEdit ? 'Edit Patient' : 'Register New Patient'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update patient demographics and contact information.'
              : 'Enter patient details to create a new record.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='patient-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='john.doe@example.com'
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

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select gender'
                        items={genders.map(({ label, value }) => ({
                          label,
                          value,
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='bloodType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select blood type'
                        items={bloodTypes.map((bt) => ({
                          label: bt,
                          value: bt,
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='123 Main St, City, State' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='insuranceProvider'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input placeholder='Blue Cross' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='insuranceId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance ID</FormLabel>
                      <FormControl>
                        <Input placeholder='BC-12345' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='allergies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Penicillin, Peanuts, Latex'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='rounded-lg border p-4'>
                <h4 className='mb-3 text-sm font-medium'>
                  Emergency Contact
                </h4>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='emergencyContactName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Jane Doe' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='emergencyContactPhone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder='+1 555 0001' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='emergencyContactRelationship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder='Spouse' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='patient-form'>
            {isEdit ? 'Update Patient' : 'Register Patient'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
