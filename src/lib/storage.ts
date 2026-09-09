import {
  DEFAULT_DRIVERS,
  DEFAULT_STREAM_ACTIVE,
  type Drivers,
  type StreamId,
} from './calculations'

const STORAGE_KEY = 'flyexpress.drivers.v2'
const STREAM_ACTIVE_KEY = 'flyexpress.streamActive.v2'

export function loadDrivers(): Drivers {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_DRIVERS }
    const parsed = JSON.parse(raw) as Partial<Drivers>
    return { ...DEFAULT_DRIVERS, ...parsed }
  } catch {
    return { ...DEFAULT_DRIVERS }
  }
}

export function saveDrivers(drivers: Drivers): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers))
}

export function resetDrivers(): Drivers {
  localStorage.removeItem(STORAGE_KEY)
  return { ...DEFAULT_DRIVERS }
}

export function loadStreamActive(): Record<StreamId, boolean> {
  try {
    const raw = localStorage.getItem(STREAM_ACTIVE_KEY)
    if (!raw) return { ...DEFAULT_STREAM_ACTIVE }
    const parsed = JSON.parse(raw) as Partial<Record<StreamId, boolean>>
    return { ...DEFAULT_STREAM_ACTIVE, ...parsed }
  } catch {
    return { ...DEFAULT_STREAM_ACTIVE }
  }
}

export function saveStreamActive(active: Record<StreamId, boolean>): void {
  localStorage.setItem(STREAM_ACTIVE_KEY, JSON.stringify(active))
}

export function resetStreamActive(): Record<StreamId, boolean> {
  localStorage.removeItem(STREAM_ACTIVE_KEY)
  return { ...DEFAULT_STREAM_ACTIVE }
}
