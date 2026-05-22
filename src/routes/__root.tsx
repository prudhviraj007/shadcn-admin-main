import { useEffect } from 'react'
import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { routeMetadata } from '@/lib/router'
import { isDev } from '@/lib/env'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootLayout,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RootLayout() {
  const location = useRouterState({ select: (s) => s.location })

  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    let path = ''
    let title = 'Clinic AI Assistant'

    for (const segment of segments) {
      path += `/${segment}`
      const meta = routeMetadata[path]
      if (meta?.title) {
        title = `${meta.title} — Clinic AI Assistant`
      }
    }

    document.title = title
  }, [location.pathname])

  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={5000} />
      {isDev && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  )
}
