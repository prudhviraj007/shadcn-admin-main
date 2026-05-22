import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { departments } from '../data/data'
import { useDoctorsList } from '../hooks/use-doctors-queries'
import { DoctorCard } from './doctor-card'

type DoctorsCardGridProps = {
  searchQuery?: string
  departmentFilter?: string
}

export function DoctorsCardGrid({
  searchQuery = '',
  departmentFilter = '',
}: DoctorsCardGridProps) {
  const [search, setSearch] = useState(searchQuery)
  const [department, setDepartment] = useState(departmentFilter)
  const { data: doctors = [], isLoading, isError } = useDoctorsList()

  const filtered = useMemo(() => {
    let result = doctors

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.specializations.some((s) => s.toLowerCase().includes(q)) ||
          d.department.toLowerCase().includes(q)
      )
    }

    if (department) {
      result = result.filter((d) => d.department === department)
    }

    return result
  }, [search, department])

  const hasFilters = search.trim() || department

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search doctors by name, specialty...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-9 ps-9'
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className='h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <option value=''>All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {hasFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setSearch('')
              setDepartment('')
            }}
            className='h-9 gap-1'
          >
            <X size={14} />
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-20'>
          <p className='text-lg font-medium'>Loading doctors...</p>
        </div>
      ) : isError ? (
        <div className='flex flex-col items-center justify-center py-20'>
          <p className='text-lg font-medium'>Unable to load doctors</p>
          <p className='text-sm text-muted-foreground'>
            Please refresh the page or try again later.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20'>
          <p className='text-lg font-medium'>No doctors found</p>
          <p className='text-sm text-muted-foreground'>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      {!isLoading && !isError && (
        <p className='text-sm text-muted-foreground'>
          Showing {filtered.length} of {doctors.length} doctors
        </p>
      )}
    </div>
  )
}
