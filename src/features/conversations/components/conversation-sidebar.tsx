import { Search as SearchIcon, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useConversationsStore } from '../store'
import { useFilteredConversations } from '../hooks'
import { conversations } from '../data/conversations'
import { statusFilters } from '../data/data'
import { ConversationListItem } from './conversation-list-item'

export function ConversationSidebar() {
  const {
    searchTerm,
    setSearchTerm,
    selectedId,
    setSelectedId,
    statusFilter,
    setStatusFilter,
  } = useConversationsStore()

  const filtered = useFilteredConversations({
    conversations,
    searchTerm,
    statusFilter,
  })

  return (
    <aside className='flex h-full w-full flex-col border-e bg-card sm:w-80 xl:w-90'>
      <div className='shrink-0 space-y-3 border-b p-4'>
        <label className='relative block'>
          <SearchIcon className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search conversations...'
            className='h-9 w-full rounded-md border border-input bg-background ps-9 pe-8 text-sm transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              <X size={14} />
            </button>
          )}
        </label>
        <div className='flex gap-1 overflow-x-auto'>
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                statusFilter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className='min-h-0 flex-1'>
        <div className='space-y-0.5 p-2'>
          {filtered.length === 0 ? (
            <div className='px-3 py-8 text-center text-sm text-muted-foreground'>
              No conversations found
            </div>
          ) : (
            filtered.map((c) => (
              <ConversationListItem
                key={c.id}
                conversation={c}
                isActive={c.id === selectedId}
                onClick={() => setSelectedId(c.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className='shrink-0 border-t px-4 py-2 text-xs text-muted-foreground'>
        {filtered.length} of {conversations.length} conversations
      </div>
    </aside>
  )
}
