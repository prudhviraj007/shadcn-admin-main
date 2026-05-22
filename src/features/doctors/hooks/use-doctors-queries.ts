import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../services'
import {
  createEntityListHook,
  useOptimisticUpdate,
} from '@/hooks/use-entity-query'
import type { Doctor } from '../data/schema'

const { useEntityList: useDoctorsList, queryKey } =
  createEntityListHook<Doctor>('doctors', { getList: getDoctors }, { staleTime: 30_000 })

export { useDoctorsList, queryKey }

export function useDoctorById(id: string) {
  return useQuery({
    queryKey: ['doctors', 'detail', id],
    queryFn: () => getDoctorById(id),
    enabled: !!id,
  })
}

export function useDoctorMutations() {
  const opt = useOptimisticUpdate<Doctor>(queryKey)

  const createEntity = useMutation({
    mutationFn: (data: Partial<Doctor>) => createDoctor(data),
    onMutate: async (data) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimisticAdd({ ...data, id: crypto.randomUUID() } as Doctor)
      return { previous }
    },
    onError: (_err, _vars, context) => {
      opt.rollback(context?.previous)
      toast.error('Failed to add doctor')
    },
    onSuccess: (doctor) => {
      toast.success('Doctor added', {
        description: `${doctor.name} has been registered.`,
      })
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  const updateEntity = useMutation({
    mutationFn: (data: Doctor) => updateDoctor(data.id, data),
    onMutate: async (updated) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimistic(updated)
      return { previous }
    },
    onError: (_err, doctor, context) => {
      opt.rollback(context?.previous)
      toast.error('Doctor update failed', {
        description: `${doctor.name}'s changes were not saved.`,
      })
    },
    onSuccess: (doctor) => {
      toast.success('Doctor updated', {
        description: `${doctor.name}'s profile was saved.`,
      })
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  const deleteEntity = useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onMutate: async (id) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimisticRemove(id)
      return { previous }
    },
    onError: (_err, _id, context) => {
      opt.rollback(context?.previous)
      toast.error('Failed to remove doctor')
    },
    onSuccess: () => {
      toast.success('Doctor removed')
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  return { createEntity, updateEntity, deleteEntity }
}
