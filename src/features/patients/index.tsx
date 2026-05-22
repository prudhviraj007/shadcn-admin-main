import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PatientsProvider } from './components/patients-provider'
import { PatientsDialogs } from './components/patients-dialogs'
import { PatientsPrimaryButtons } from './components/patients-primary-buttons'
import { PatientsTable } from './components/patients-table'
import { usePatientsList } from './hooks/use-patients-queries'

const route = getRouteApi('/_authenticated/patients/')

export function PatientsPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: patients = [], isLoading, isError } = usePatientsList()

  return (
    <PatientsProvider>
      <Header fixed>
        <Search className='me-auto' />
        <NotificationBell />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Patients</h2>
            <p className='text-muted-foreground'>
              Manage patient records, medical history, and appointments.
            </p>
          </div>
          <PatientsPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <p className='text-lg text-muted-foreground'>Loading patients...</p>
          </div>
        ) : isError ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <p className='text-lg font-medium'>Unable to load patients</p>
            <p className='text-sm text-muted-foreground'>
              Please refresh the page or try again later.
            </p>
          </div>
        ) : (
          <PatientsTable data={patients} search={search} navigate={navigate} />
        )}
      </Main>

      <PatientsDialogs />
    </PatientsProvider>
  )
}

// Barrel exports for backward compatibility
export { getPatients } from './services/patients-service'
export { getMedicalNotesByPatientId } from './services/medical-notes-service'
export { getVisitsByPatientId } from './services/visits-service'
export { usePatientsStore } from './store/patients-store'
export { usePatientsList, usePatientById, usePatientMutations, usePatientMedicalNotes, usePatientVisits } from './hooks/use-patients-queries'
export { useFilteredPatients } from './hooks/use-filtered-patients'
export { patientTags, patientStatuses, patientStatusColors, genders, bloodTypes, noteTypes, noteTypeColors } from './data/data'
export type { Patient, MedicalNote, Visit, PatientTag, NoteType, VisitStatus, PatientStatus, PatientGender } from './data/schema'
