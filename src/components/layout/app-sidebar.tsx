import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useUserRole } from '@/hooks/use-user-role'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function AppSidebar() {
  const { collapsible, variant } = useLayout()

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {PUBLISHABLE_KEY ? <RoleFilteredGroups /> : <AllGroups />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function AllGroups() {
  return sidebarData.navGroups.map((props) => (
    <NavGroup key={props.title} {...props} />
  ))
}

function RoleFilteredGroups() {
  const { roles } = useUserRole()
  const groups = useMemo(
    () =>
      sidebarData.navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            if (!item.roles || item.roles.length === 0) return true
            return item.roles.some((role) => roles.includes(role))
          }),
        }))
        .filter((group) => group.items.length > 0),
    [roles]
  )

  return groups.map((props) => <NavGroup key={props.title} {...props} />)
}
