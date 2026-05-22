import { createEntityContext } from '@/hooks/use-entity-dialog'
import { type Task } from '../data/schema'

export const {
  Provider: TasksProvider,
  useEntity: useTasks,
} = createEntityContext<Task, 'create' | 'update' | 'delete' | 'import'>('Tasks')
