import type { LucideIcon } from 'lucide-react'
import {
  Bus,
  CalendarDays,
  Route,
  Users,
  Ticket,
  Package,
  Briefcase,
  Banknote,
  RefreshCw,
  Megaphone,
  Percent,
  PieChart,
  UserRound,
  Minus,
  Plus,
} from 'lucide-react'
import { DRIVER_META, type Drivers } from '../lib/calculations'
import { useDrivers } from './DriversContext'
import { formatNumber } from '../lib/format'

type InputsFormProps = {
  /** Compact padding for drawer; grid is still 1→2 cols */
  compact?: boolean
  /** Hide the page-level title/reset row when drawer provides its own header */
  hideHeader?: boolean
}

const DRIVER_ICONS: Record<keyof Drivers, LucideIcon> = {
  vehicles: Bus,
  days: CalendarDays,
  travels_per_vehicle: Route,
  passengers: Users,
  fare: Ticket,
  additional_travels: Route,
  parcels_per_day: Package,
  parcel_fee: Banknote,
  luggage_adoption: Briefcase,
  luggage_fee: Briefcase,
  cohort: UserRound,
  baseline_retention: RefreshCw,
  package_uptake: Percent,
  outward_fare: Ticket,
  return_fare: RefreshCw,
  ad_monthly: Megaphone,
  central_per_travel: Banknote,
  parcel_central: PieChart,
  luggage_central: Percent,
  return_central: PieChart,
  ad_central: Percent,
}

function stepFor(meta: (typeof DRIVER_META)[number], value: number): number {
  // Currency fields nudge by UGX 500 on +/- 
  if (meta.unit === 'UGX') return meta.step ?? 500
  return meta.step ?? (Number.isInteger(value) ? 1 : 0.01)
}

function roundToStep(value: number, step: number): number {
  const decimals = (String(step).split('.')[1] || '').length
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function InputsForm({ compact = false, hideHeader = false }: InputsFormProps) {
  const { drivers, setDriver, reset } = useDrivers()

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {!hideHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Inputs</h2>
            <p className="mt-1 max-w-3xl text-slate-600">
              Edit all projection drivers. Changes save automatically to localStorage in this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset to defaults
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {DRIVER_META.map((meta) => {
          const Icon = DRIVER_ICONS[meta.key]
          const value = drivers[meta.key]
          const step = stepFor(meta, value)

          const bump = (dir: -1 | 1) => {
            const next = roundToStep(value + dir * step, step)
            setDriver(meta.key, Math.max(0, next))
          }

          return (
            <label
              key={meta.key}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Icon
                      className="h-4 w-4 shrink-0 text-[#0b3d91]"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                    {meta.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">{meta.purpose}</span>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                  {meta.unit}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    bump(-1)
                  }}
                  aria-label={`Decrease ${meta.label}`}
                  disabled={value <= 0}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                </button>
                <input
                  type="number"
                  min={0}
                  step={step}
                  value={value}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    if (Number.isFinite(next)) setDriver(meta.key, Math.max(0, next))
                  }}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-medium text-slate-900 outline-none ring-sky-600 focus:bg-white focus:ring-2"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    bump(1)
                  }}
                  aria-label={`Increase ${meta.label}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Current: {formatNumber(value)} · step {step}
              </p>
            </label>
          )
        })}
      </div>
    </div>
  )
}
