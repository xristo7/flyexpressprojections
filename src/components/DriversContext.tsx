import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  computeProjections,
  type Drivers,
  type ProjectionResult,
} from '../lib/calculations'
import { loadDrivers, resetDrivers, saveDrivers } from '../lib/storage'

type DriversContextValue = {
  drivers: Drivers
  setDriver: (key: keyof Drivers, value: number) => void
  setDrivers: (next: Drivers) => void
  reset: () => void
  projections: ProjectionResult
}

const DriversContext = createContext<DriversContextValue | null>(null)

export function DriversProvider({ children }: { children: ReactNode }) {
  const [drivers, setDriversState] = useState<Drivers>(() => loadDrivers())

  const setDrivers = useCallback((next: Drivers) => {
    setDriversState(next)
    saveDrivers(next)
  }, [])

  const setDriver = useCallback((key: keyof Drivers, value: number) => {
    setDriversState((prev) => {
      const next = { ...prev, [key]: value }
      saveDrivers(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const defaults = resetDrivers()
    setDriversState(defaults)
  }, [])

  const projections = useMemo(() => computeProjections(drivers), [drivers])

  const value = useMemo(
    () => ({ drivers, setDriver, setDrivers, reset, projections }),
    [drivers, setDriver, setDrivers, reset, projections],
  )

  return <DriversContext.Provider value={value}>{children}</DriversContext.Provider>
}

export function useDrivers() {
  const ctx = useContext(DriversContext)
  if (!ctx) throw new Error('useDrivers must be used within DriversProvider')
  return ctx
}
