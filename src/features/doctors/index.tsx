import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DoctorsProvider } from './components/doctors-provider'
import { DoctorsDialogs } from './components/doctors-dialogs'
import { DoctorsPrimaryButtons } from './components/doctors-primary-buttons'
import { DoctorsCardGrid } from './components/doctors-card-grid'

// Barrel exports for backward compatibility
export { useFilteredDoctors } from './hooks'
export { useDoctorsList, useDoctorById, useDoctorMutations } from './hooks/use-doctors-queries'
export { getDoctors } from './services'
export { useDoctorsStore } from './store'
export type { Doctor, AvailabilityStatus } from './data/schema'

export function DoctorsPage() {
  return (
    <DoctorsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Doctors</h2>
            <p className='text-muted-foreground'>
              Manage physicians, view schedules, and track appointments.
            </p>
          </div>
          <DoctorsPrimaryButtons />
        </div>
        <DoctorsCardGrid />
      </Main>

      <DoctorsDialogs />
    </DoctorsProvider>
  )
}
