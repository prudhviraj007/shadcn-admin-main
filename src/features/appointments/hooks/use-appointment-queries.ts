import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../services'
import {
  createEntityListHook,
  useOptimisticUpdate,
} from '@/hooks/use-entity-query'
import type { Appointment } from '../types'

const { useEntityList, queryKey } =
  createEntityListHook<Appointment>('appointments', {
    getList: getAppointments,
    staleTime: 30_000,
  })

export { useEntityList as useAppointmentsList, queryKey }

export function useAppointmentMutations() {
  const opt = useOptimisticUpdate<Appointment>(queryKey)

  const createEntity = useMutation({
    mutationFn: (data: Partial<Appointment>) => createAppointment(data),
    onMutate: async (data) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimisticAdd({ ...data, id: crypto.randomUUID() } as Appointment)
      return { previous }
    },
    onError: (_err, _vars, context) => {
      opt.rollback(context?.previous)
      toast.error('Failed to create appointment')
    },
    onSuccess: () => {
      toast.success('Appointment created')
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  const updateEntity = useMutation({
    mutationFn: (data: Appointment) => updateAppointment(data),
    onMutate: async (updated) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimistic(updated)
      return { previous }
    },
    onError: (_err, appointment, context) => {
      opt.rollback(context?.previous)
      toast.error('Appointment update failed', {
        description: `${appointment.patient.name}'s changes were not saved.`,
      })
    },
    onSuccess: (appointment) => {
      toast.success('Appointment updated', {
        description: `${appointment.patient.name}'s appointment was saved.`,
      })
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  const deleteEntity = useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onMutate: async (id) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      opt.applyOptimisticRemove(id)
      return { previous }
    },
    onError: (_err, _id, context) => {
      opt.rollback(context?.previous)
      toast.error('Appointment delete failed', {
        description: 'The appointment was restored in the schedule.',
      })
    },
    onSuccess: () => {
      toast.success('Appointment deleted', {
        description: 'The clinic schedule was updated.',
      })
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  const updateAppointmentStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: Appointment['status']
    }) => {
      const previous = opt.getPreviousData()
      const existing = previous?.find((a) => a.id === id)
      if (!existing) throw new Error('Appointment not found')
      return updateAppointment({ ...existing, status })
    },
    onMutate: async ({ id, status }) => {
      await opt.cancelQueries()
      const previous = opt.getPreviousData()
      const existing = previous?.find((a) => a.id === id)
      if (existing) {
        opt.applyOptimistic({ ...existing, status })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      opt.rollback(context?.previous)
      toast.error('Failed to update appointment status')
    },
    onSuccess: () => {
      toast.success('Appointment status updated')
    },
    onSettled: () => {
      opt.invalidate()
    },
  })

  return { createEntity, updateEntity, deleteEntity, updateAppointmentStatus }
}
