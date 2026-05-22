import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePatients } from './patients-provider'

export function PatientsPrimaryButtons() {
  const { setOpen } = usePatients()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Patient</span> <Plus size={18} />
      </Button>
    </div>
  )
}
