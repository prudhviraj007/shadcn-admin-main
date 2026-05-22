export type { RouteMeta, BreadcrumbItem, RouteGuard } from './types'
export { routeMetadata, routeGuards } from './metadata'
export { buildBreadcrumbs, resolvePageTitle } from './breadcrumbs'
export {
  getRouteGuard,
  requiresAuth,
  hasRequiredRoles,
  getRedirectPath,
} from './guards'
