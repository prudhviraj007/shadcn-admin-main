import { createEntityContext } from '@/hooks/use-entity-dialog'
import { type User } from '../data/schema'

export const {
  Provider: UsersProvider,
  useEntity: useUsers,
} = createEntityContext<User, 'invite' | 'add' | 'edit' | 'delete'>('Users')
