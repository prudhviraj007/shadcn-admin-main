import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getMedicalNotesByPatientId,
  getVisitsByPatientId,
} from '../services'
import {
  createEntityListHook,
  useOptimisticUpdate,
} from '@/hooks/use-entity-query'
import type { Patient } from '../data/schema'

const { useEntityList: usePatientsList, queryKey } =
  createEntityListHook<Patient>('patients', { getList: getPatients }, { staleTime: 30_000 })

export { usePatientsList, queryKey }

export function usePatientById(id: string) {
  return useQuery({
    queryKey: ['patients', 'detail', id],
    queryFn: () => getPatientById(id),
    enabled: !!id,
  })
}

export function usePatientMedicalNotes(patientId: string) {
  return useQuery({
    queryKey: ['patients', 'medical-notes', patientId],
    queryFn: () => getMedicalNotesByPatientId(patientId),
    enabled: !!patientId,
  })
}

export function usePatientVisits(patientId: string) {
  return useQuery({
    queryKey: ['patients', 'visits', patientId],
    queryFn: () => getVisitsByPatientId(patientId),
    enabled: !!patientId,
  })
}

export function usePatientMutations() {
  const opt = useOptimisticUpdate<Patient>(queryKey)

  const createEntity = useMutation({
    mutationFn: (data: Partial<Patient>) => createPatient(data),
    onMutate: async (data) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimisticAdd({ ...data, id: crypto.randomUUID() } as Patient)
      return { previous }
    },
    onError: (_err, _vars, context) => {
      opt.rollback(context?.previous)
      toast.error('Failed to register patient')
    },
    onSuccess: (patient) => {
      toast.success('Patient registered', {
        description: `${patient.firstName} ${patient.lastName} has been added.`,
      })
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  const updateEntity = useMutation({
    mutationFn: (data: Patient) => updatePatient(data.id, data),
    onMutate: async (updated) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimistic(updated)
      return { previous }
    },
    onError: (_err, patient, context) => {
      opt.rollback(context?.previous)
      toast.error('Patient update failed', {
        description: `${patient.firstName} ${patient.lastName}'s changes were not saved.`,
      })
    },
    onSuccess: (patient) => {
      toast.success('Patient updated', {
        description: `${patient.firstName} ${patient.lastName}'s record was saved.`,
      })
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  const deleteEntity = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onMutate: async (id) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimisticRemove(id)
      return { previous }
    },
    onError: (_err, _id, context) => {
      opt.rollback(context?.previous)
      toast.error('Failed to delete patient record')
    },
    onSuccess: () => {
      toast.success('Patient record deleted')
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  return { createEntity, updateEntity, deleteEntity }
}
