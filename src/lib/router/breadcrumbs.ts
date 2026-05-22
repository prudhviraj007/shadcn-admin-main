import type { BreadcrumbItem, RouteMeta } from './types'

export function buildBreadcrumbs(
  pathname: string,
  metadataMap: Record<string, RouteMeta>
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]

  const segments = pathname.split('/').filter(Boolean)
  let accumulated = ''

  for (const segment of segments) {
    accumulated += `/${segment}`
    const meta = metadataMap[accumulated]
    if (meta?.breadcrumb) {
      crumbs.push({ label: meta.breadcrumb, href: accumulated })
    } else if (meta?.title) {
      crumbs.push({ label: meta.title, href: accumulated })
    } else {
      crumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: accumulated,
      })
    }
  }

  const last = crumbs[crumbs.length - 1]
  if (last) delete last.href

  return crumbs
}

export function resolvePageTitle(
  pathname: string,
  metadataMap: Record<string, RouteMeta>,
  params?: Record<string, string>
): string {
  const meta = metadataMap[pathname]
  if (!meta) return 'Dashboard'
  let title = meta.title
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      title = title.replace(`:${key}`, value)
    }
  }
  return title
}
