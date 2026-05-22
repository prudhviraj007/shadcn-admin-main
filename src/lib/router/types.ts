import type { ReactNode } from 'react'

export type RouteMeta = {
  title: string
  breadcrumb?: string
  icon?: ReactNode
  description?: string
}

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: ReactNode
}

export type RouteGuard = {
  requiresAuth?: boolean
  requiredRoles?: string[]
  redirectTo?: string
}
