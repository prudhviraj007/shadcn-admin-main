import { useMemo, useState } from 'react'
import { Bell, CheckCheck, Trash2, Loader2, Calendar, AlertTriangle, MessageSquare, FlaskConical, Info } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Notification, NotificationType } from '@/models'

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    deleteNotification,
  } = useNotifications()

  const [open, setOpen] = useState(false)

  const sorted = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notifications]
  )

  const recent = sorted.slice(0, 20)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative scale-95 rounded-full'
        >
          <Bell className='size-[1.2rem]' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -end-1 -top-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px] leading-none'
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-80 sm:w-96'
        sideOffset={8}
      >
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span className='text-sm font-semibold'>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='h-auto gap-1 px-2 py-1 text-xs font-normal text-muted-foreground'
              onClick={() => {
                markAllRead()
              }}
            >
              <CheckCheck className='size-3.5' />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='size-5 animate-spin text-muted-foreground' />
          </div>
        ) : recent.length === 0 ? (
          <div className='flex flex-col items-center py-12 text-center'>
            <Bell className='mb-2 size-8 text-muted-foreground/50' />
            <p className='text-sm font-medium'>All caught up</p>
            <p className='text-xs text-muted-foreground'>
              No new notifications
            </p>
          </div>
        ) : (
          <ScrollArea className='max-h-[min(60vh,28rem)]'>
            <DropdownMenuGroup>
              {recent.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={markRead}
                  onDelete={deleteNotification}
                />
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const isUrgent = notification.priority === 'urgent'

  return (
    <DropdownMenuItem
      className={cn(
        'flex items-start gap-3 px-4 py-3',
        !notification.read && 'bg-accent/40',
        isUrgent && 'border-s-2 border-destructive'
      )}
      onSelect={(e) => {
        e.preventDefault()
        if (!notification.read) onMarkRead(notification.id)
      }}
    >
      <span className='mt-0.5 shrink-0'>
        <NotificationIcon type={notification.type} />
      </span>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{notification.title}</p>
        <p className='mt-0.5 line-clamp-2 text-xs text-muted-foreground'>
          {notification.description}
        </p>
        <p className='mt-1 text-[10px] text-muted-foreground/60'>
          {formatTimeAgo(notification.createdAt)}
        </p>
      </div>
      <div className='flex shrink-0 flex-col gap-1'>
        {!notification.read && (
          <button
            type='button'
            className='rounded p-1 text-muted-foreground/50 hover:text-foreground'
            onClick={(e) => {
              e.stopPropagation()
              onMarkRead(notification.id)
            }}
          >
            <CheckCheck className='size-3.5' />
          </button>
        )}
        <button
          type='button'
          className='rounded p-1 text-muted-foreground/50 hover:text-destructive'
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification.id)
          }}
        >
          <Trash2 className='size-3.5' />
        </button>
      </div>
    </DropdownMenuItem>
  )
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const className = 'size-4'
  switch (type) {
    case 'appointment':
      return <Calendar className={cn(className, 'text-blue-500')} />
    case 'alert':
      return <AlertTriangle className={cn(className, 'text-destructive')} />
    case 'message':
      return <MessageSquare className={cn(className, 'text-cyan-500')} />
    case 'lab_result':
      return <FlaskConical className={cn(className, 'text-amber-500')} />
    case 'reminder':
      return <Calendar className={cn(className, 'text-violet-500')} />
    default:
      return <Info className={cn(className, 'text-muted-foreground')} />
  }
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
