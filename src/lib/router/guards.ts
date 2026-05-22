import type { RouteGuard } from './types'
import { routeGuards } from './metadata'

export function getRouteGuard(routeId: string): RouteGuard | undefined {
  return routeGuards[routeId]
}

export function requiresAuth(routeId: string): boolean {
  return routeGuards[routeId]?.requiresAuth ?? false
}

export function hasRequiredRoles(
  routeId: string,
  userRoles: string[]
): boolean {
  const guard = routeGuards[routeId]
  if (!guard?.requiredRoles?.length) return true
  return guard.requiredRoles.some((role) => userRoles.includes(role))
}

export function getRedirectPath(routeId: string): string | undefined {
  return routeGuards[routeId]?.redirectTo
}
