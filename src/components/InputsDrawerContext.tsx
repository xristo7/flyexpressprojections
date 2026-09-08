import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type InputsDrawerContextValue = {
  open: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

const InputsDrawerContext = createContext<InputsDrawerContextValue | null>(null)

export function InputsDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openDrawer = useCallback(() => setOpen(true), [])
  const closeDrawer = useCallback(() => setOpen(false), [])
  const toggleDrawer = useCallback(() => setOpen((v) => !v), [])

  const value = useMemo(
    () => ({ open, openDrawer, closeDrawer, toggleDrawer }),
    [open, openDrawer, closeDrawer, toggleDrawer],
  )

  return (
    <InputsDrawerContext.Provider value={value}>{children}</InputsDrawerContext.Provider>
  )
}

export function useInputsDrawer() {
  const ctx = useContext(InputsDrawerContext)
  if (!ctx) throw new Error('useInputsDrawer must be used within InputsDrawerProvider')
  return ctx
}
