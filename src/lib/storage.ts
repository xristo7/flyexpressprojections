import { DEFAULT_DRIVERS, type Drivers } from './calculations'

const STORAGE_KEY = 'flyexpress.drivers.v1'

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
