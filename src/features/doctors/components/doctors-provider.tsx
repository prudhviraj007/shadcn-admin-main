import { createEntityContext } from '@/hooks/use-entity-dialog'
import { type Doctor } from '../data/schema'

export const {
  Provider: DoctorsProvider,
  useEntity: useDoctors,
} = createEntityContext<Doctor, 'add' | 'edit' | 'delete'>('Doctors')
