import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useDoctorById } from '../hooks/use-doctors-queries'
import { DoctorProfileHeader } from './doctor-profile-header'
import { DoctorSchedule } from './doctor-schedule'
import { DoctorAppointmentsOverview } from './doctor-appointments-overview'

const route = getRouteApi('/_authenticated/doctors/$doctorId')

export function DoctorProfilePage() {
  const { doctorId } = route.useParams()
  const { data: doctor, isLoading, isError } = useDoctorById(doctorId)

  if (isLoading) {
    return (
      <>
        <Header fixed>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main>
          <div className='flex flex-col items-center justify-center py-20'>
            <p className='text-lg text-muted-foreground'>Loading doctor...</p>
          </div>
        </Main>
      </>
    )
  }

  if (isError || !doctor) {
    return (
      <>
        <Header fixed>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main>
          <div className='flex flex-col items-center justify-center py-20'>
            <h2 className='text-2xl font-bold'>Doctor not found</h2>
            <p className='text-muted-foreground'>
              No doctor found with ID {doctorId}.
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
        <DoctorProfileHeader doctor={doctor} />

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {doctor.bio}
                </p>
              </CardContent>
            </Card>

            <DoctorSchedule doctor={doctor} />

            <DoctorAppointmentsOverview doctorName={doctor.name} />
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h4 className='mb-2 text-sm font-medium'>Department</h4>
                  <Badge variant='secondary'>{doctor.department}</Badge>
                </div>
                <Separator />
                <div>
                  <h4 className='mb-2 text-sm font-medium'>Education</h4>
                  <p className='text-sm text-muted-foreground'>
                    {doctor.education}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className='mb-2 text-sm font-medium'>Languages</h4>
                  <div className='flex flex-wrap gap-1'>
                    {doctor.languages.map((lang) => (
                      <Badge key={lang} variant='outline' className='text-xs'>
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className='mb-2 text-sm font-medium'>Certifications</h4>
                  <ul className='space-y-1'>
                    {doctor.certifications.map((cert) => (
                      <li
                        key={cert}
                        className='text-sm text-muted-foreground'
                      >
                        &bull; {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
