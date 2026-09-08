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
  type StreamId,
} from '../lib/calculations'
import {
  loadDrivers,
  loadStreamActive,
  resetDrivers,
  resetStreamActive,
  saveDrivers,
  saveStreamActive,
} from '../lib/storage'

type DriversContextValue = {
  drivers: Drivers
  setDriver: (key: keyof Drivers, value: number) => void
  setDrivers: (next: Drivers) => void
  reset: () => void
  projections: ProjectionResult
  streamActive: Record<StreamId, boolean>
  setStreamActive: (id: StreamId, enabled: boolean) => void
}

const DriversContext = createContext<DriversContextValue | null>(null)

export function DriversProvider({ children }: { children: ReactNode }) {
  const [drivers, setDriversState] = useState<Drivers>(() => loadDrivers())
  const [streamActive, setStreamActiveState] = useState<Record<StreamId, boolean>>(
    () => loadStreamActive(),
  )

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

  const setStreamActive = useCallback((id: StreamId, enabled: boolean) => {
    setStreamActiveState((prev) => {
      const next = { ...prev, [id]: enabled }
      saveStreamActive(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const defaults = resetDrivers()
    setDriversState(defaults)
    const streamDefaults = resetStreamActive()
    setStreamActiveState(streamDefaults)
  }, [])

  const projections = useMemo(
    () => computeProjections(drivers, streamActive),
    [drivers, streamActive],
  )

  const value = useMemo(
    () => ({
      drivers,
      setDriver,
      setDrivers,
      reset,
      projections,
      streamActive,
      setStreamActive,
    }),
    [drivers, setDriver, setDrivers, reset, projections, streamActive, setStreamActive],
  )

  return <DriversContext.Provider value={value}>{children}</DriversContext.Provider>
}

export function useDrivers() {
  const ctx = useContext(DriversContext)
  if (!ctx) throw new Error('useDrivers must be used within DriversProvider')
  return ctx
}
