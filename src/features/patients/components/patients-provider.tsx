import { createEntityContext } from '@/hooks/use-entity-dialog'
import { type Patient } from '../data/schema'

export const {
  Provider: PatientsProvider,
  useEntity: usePatients,
} = createEntityContext<Patient, 'add' | 'edit' | 'delete' | 'tags'>('Patients')
