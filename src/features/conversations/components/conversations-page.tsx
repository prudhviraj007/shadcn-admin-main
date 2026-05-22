import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationBell } from '@/components/notification-bell'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useConversationsStore } from '../store'
import { conversations } from '../data/conversations'
import { ConversationSidebar } from './conversation-sidebar'
import { ChatPanel } from './chat-panel'

export function ConversationsPage() {
  const { selectedId, showSidebar, setShowSidebar } =
    useConversationsStore()

  const selectedConversation =
    conversations.find((c) => c.id === selectedId) ?? conversations[0]

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <NotificationBell />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed className='flex h-full min-h-0 flex-1 flex-col gap-4'>
        <div className='shrink-0'>
          <h1 className='text-2xl font-bold tracking-tight'>Conversations</h1>
          <p className='text-sm text-muted-foreground'>
            Patient messaging with AI-assisted replies for clinic teams.
          </p>
        </div>

        <section className='flex min-h-0 flex-1 overflow-hidden rounded-lg border bg-card'>
          {/* Sidebar - visible on desktop, toggle on mobile */}
          <div
            className={`${
              showSidebar ? 'flex' : 'hidden'
            } w-full sm:flex sm:w-80 xl:w-90`}
          >
            <ConversationSidebar />
          </div>

          {/* Chat panel - visible when sidebar is hidden on mobile */}
          <div
            className={`${
              !showSidebar ? 'flex' : 'hidden'
            } w-full flex-1 flex-col sm:flex`}
          >
            <ChatPanel
              conversation={selectedConversation}
              onBack={() => setShowSidebar(true)}
            />
          </div>
        </section>
      </Main>
    </>
  )
}
