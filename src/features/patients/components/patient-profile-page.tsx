import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePatientById, usePatientMedicalNotes, usePatientVisits } from '../hooks/use-patients-queries'
import { getAppointments } from '@/features/appointments'
import { PatientProfileHeader } from './patient-profile-header'
import { PatientMedicalNotes } from './patient-medical-notes'
import { PatientVisitHistory } from './patient-visit-history'
import { PatientAppointmentHistory } from './patient-appointment-history'

const route = getRouteApi('/_authenticated/patients/$patientId')

export function PatientProfilePage() {
  const { patientId } = route.useParams()
  const { data: patient, isLoading, isError } = usePatientById(patientId)
  const { data: patientNotes = [] } = usePatientMedicalNotes(patientId)
  const { data: patientVisits = [] } = usePatientVisits(patientId)
  const { data: allAppointments = [] } = useQuery({
    queryKey: ['appointments', 'list'],
    queryFn: () => getAppointments(),
  })

  const patientAppointments = useMemo(
    () =>
      allAppointments.filter((a) => {
        if (!patient) return false
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
        return a.patient.name.toLowerCase() === fullName
      }),
    [allAppointments, patient]
  )

  if (isLoading) {
    return (
      <>
        <Header fixed>
          <Search className='me-auto' />
          <NotificationBell />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main>
          <div className='flex flex-col items-center justify-center py-20'>
            <p className='text-lg text-muted-foreground'>Loading patient...</p>
          </div>
        </Main>
      </>
    )
  }

  if (isError || !patient) {
    return (
      <>
        <Header fixed>
          <Search className='me-auto' />
          <NotificationBell />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main>
          <div className='flex flex-col items-center justify-center py-20'>
            <h2 className='text-2xl font-bold'>Patient not found</h2>
            <p className='text-muted-foreground'>
              No patient found with ID {patientId}.
            </p>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <NotificationBell />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        <PatientProfileHeader patient={patient} />

        <Tabs defaultValue='notes' className='flex-1'>
          <TabsList>
            <TabsTrigger value='notes'>
              Medical Notes ({patientNotes.length})
            </TabsTrigger>
            <TabsTrigger value='visits'>
              Visit History ({patientVisits.length})
            </TabsTrigger>
            <TabsTrigger value='appointments'>
              Appointments ({patientAppointments.length})
            </TabsTrigger>
            <TabsTrigger value='details'>Details</TabsTrigger>
          </TabsList>

          <TabsContent value='notes' className='mt-6'>
            <PatientMedicalNotes
              notes={patientNotes}
              patientId={patient.id}
            />
          </TabsContent>

          <TabsContent value='visits' className='mt-6'>
            <PatientVisitHistory visits={patientVisits} />
          </TabsContent>

          <TabsContent value='appointments' className='mt-6'>
            <PatientAppointmentHistory appointments={patientAppointments} />
          </TabsContent>

          <TabsContent value='details' className='mt-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='rounded-lg border p-6'>
                <h3 className='mb-4 font-semibold'>Personal Information</h3>
                <dl className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Date of Birth</dt>
                    <dd>{patient.dateOfBirth}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Gender</dt>
                    <dd className='capitalize'>{patient.gender}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Blood Type</dt>
                    <dd>{patient.bloodType}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Allergies</dt>
                    <dd>
                      {patient.allergies.length > 0
                        ? patient.allergies.join(', ')
                        : 'None'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className='rounded-lg border p-6'>
                <h3 className='mb-4 font-semibold'>Insurance</h3>
                <dl className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Provider</dt>
                    <dd>{patient.insuranceProvider}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Member ID</dt>
                    <dd>{patient.insuranceId}</dd>
                  </div>
                </dl>
              </div>

              <div className='rounded-lg border p-6'>
                <h3 className='mb-4 font-semibold'>Emergency Contact</h3>
                <dl className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Name</dt>
                    <dd>{patient.emergencyContact.name}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Phone</dt>
                    <dd>{patient.emergencyContact.phone}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Relationship</dt>
                    <dd>{patient.emergencyContact.relationship}</dd>
                  </div>
                </dl>
              </div>

              <div className='rounded-lg border p-6'>
                <h3 className='mb-4 font-semibold'>Record Timeline</h3>
                <dl className='space-y-3 text-sm'>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Created</dt>
                    <dd>{patient.createdAt}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Last Updated</dt>
                    <dd>{patient.updatedAt}</dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='text-muted-foreground'>Last Visit</dt>
                    <dd>{patient.lastVisit}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
