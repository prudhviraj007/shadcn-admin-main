import { createContext, useContext, useState, createElement, type ReactNode, type Dispatch, type SetStateAction } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type EntityDialogContextType<TEntity, TDialog extends string> = {
  open: TDialog | null
  setOpen: (str: TDialog | null) => void
  currentRow: TEntity | null
  setCurrentRow: Dispatch<SetStateAction<TEntity | null>>
}

export function createEntityContext<TEntity, TDialog extends string>(
  name: string,
  _initial: TDialog | null = null
) {
  const Ctx = createContext<EntityDialogContextType<TEntity, TDialog> | null>(null)

  function Provider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useDialogState<TDialog>(null)
    const [currentRow, setCurrentRow] = useState<TEntity | null>(null)

    return createElement(Ctx, { value: { open, setOpen, currentRow, setCurrentRow } }, children)
  }

  function useEntity() {
    const ctx = useContext(Ctx)
    if (!ctx) {
      throw new Error(`use${name} has to be used within <${name}Provider>`)
    }
    return ctx
  }

  return { Provider, useEntity }
}
