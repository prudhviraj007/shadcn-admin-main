import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSubscription } from '@/lib/supabase/realtime'
import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import type { Notification } from '@/models'

export function RealtimeNotificationProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isSupabaseEnabled()) return

    const api = createApi<Notification>('appointments')
    const thirtyMinFromNow = new Date(Date.now() + 30 * 60 * 1000).toISOString()
    const now = new Date().toISOString()

    api
      .getAll({
        orderBy: 'date',
        ascending: true,
        limit: 5,
      } as never)
      .then(({ data }) => {
        if (!data) return
        const upcoming = (data as unknown as Record<string, string>[]).filter(
          (a) => a.date && a.date >= now && a.date <= thirtyMinFromNow
        )
        for (const apt of upcoming) {
          toast(
            <div className='flex items-start gap-3'>
              <span className='mt-0.5 shrink-0 text-lg'>⏰</span>
              <div>
                <p className='text-sm font-medium'>Appointment Reminder</p>
                <p className='text-xs text-muted-foreground'>
                  {apt.patientName ?? 'A patient'} at {apt.time ?? 'soon'}
                </p>
              </div>
            </div>,
            { duration: 6000 }
          )
        }
      })
  }, [])

  useSubscription<Notification>(
    'notifications',
    (_payload) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    []
  )

  return <>{children}</>
}
