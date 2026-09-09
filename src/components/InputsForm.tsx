import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Bus,
  CalendarDays,
  Route,
  Users,
  Ticket,
  Package,
  PackageSearch,
  MapPinned,
  Truck,
  HandMetal,
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
import {
  formatCurrencyAmount,
  formatRatioAsPercent,
  parseNumericInput,
  parsePercentInput,
} from '../lib/format'

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
  pickup_adoption: HandMetal,
  pickup_fee: MapPinned,
  lastmile_adoption: Truck,
  lastmile_fee: PackageSearch,
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
  pickup_central: MapPinned,
  lastmile_central: Truck,
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

type UnitKind = 'currency' | 'ratio' | 'plain'

function unitKind(unit: string): UnitKind {
  if (unit === 'UGX') return 'currency'
  if (unit === 'ratio') return 'ratio'
  return 'plain'
}

function displayValue(kind: UnitKind, value: number): string {
  if (kind === 'currency') return formatCurrencyAmount(value)
  if (kind === 'ratio') return formatRatioAsPercent(value)
  // Plain: no thousand separators (type=number friendly); trim trailing zeros
  if (Number.isInteger(value)) return String(value)
  return String(Number(value.toFixed(6)))
}

type AffixedNumberInputProps = {
  kind: UnitKind
  value: number
  step: number
  label: string
  onCommit: (next: number) => void
}

function AffixedNumberInput({ kind, value, step, label, onCommit }: AffixedNumberInputProps) {
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState(() => displayValue(kind, value))

  // Sync display when the external value changes (e.g. steppers) and we're not editing
  useEffect(() => {
    if (!focused) setDraft(displayValue(kind, value))
  }, [value, kind, focused])

  const commitFromDraft = (raw: string) => {
    if (kind === 'ratio') {
      const parsed = parsePercentInput(raw)
      if (parsed === null) {
        setDraft(displayValue(kind, value))
        return
      }
      onCommit(Math.min(1, Math.max(0, parsed)))
      return
    }
    const parsed = parseNumericInput(raw)
    if (parsed === null) {
      setDraft(displayValue(kind, value))
      return
    }
    onCommit(Math.max(0, parsed))
  }

  const useTextInput = kind === 'currency' || kind === 'ratio'

  return (
    <div className="relative flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-600">
      {kind === 'currency' && (
        <span className="pointer-events-none select-none pl-3 text-xs font-medium text-slate-400">
          UGX
        </span>
      )}
      <input
        type={useTextInput ? 'text' : 'number'}
        inputMode="decimal"
        min={useTextInput ? undefined : 0}
        step={useTextInput ? undefined : step}
        aria-label={label}
        value={focused ? draft : displayValue(kind, value)}
        onFocus={() => {
          setFocused(true)
          setDraft(displayValue(kind, value))
        }}
        onChange={(e) => {
          const raw = e.target.value
          setDraft(raw)
          if (kind === 'ratio') {
            const parsed = parsePercentInput(raw)
            if (parsed !== null) onCommit(Math.min(1, Math.max(0, parsed)))
            return
          }
          if (kind === 'currency') {
            const parsed = parseNumericInput(raw)
            if (parsed !== null) onCommit(Math.max(0, parsed))
            return
          }
          const next = Number(raw)
          if (Number.isFinite(next)) onCommit(Math.max(0, next))
        }}
        onBlur={() => {
          setFocused(false)
          commitFromDraft(draft)
        }}
        className={`min-w-0 flex-1 bg-transparent py-2 text-center text-sm font-medium text-slate-900 outline-none ${
          kind === 'currency' ? 'pr-3 pl-1.5' : kind === 'ratio' ? 'pr-1.5 pl-3' : 'px-3'
        }`}
      />
      {kind === 'ratio' && (
        <span className="pointer-events-none select-none pr-3 text-xs font-medium text-slate-400">
          %
        </span>
      )}
    </div>
  )
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {DRIVER_META.map((meta) => {
          const Icon = DRIVER_ICONS[meta.key]
          const value = drivers[meta.key]
          const step = stepFor(meta, value)
          const kind = unitKind(meta.unit)
          // Soften unit pill when in-field affixes already convey currency / %
          const showUnitPill = kind === 'plain'

          const bump = (dir: -1 | 1) => {
            const next = roundToStep(value + dir * step, step)
            const capped = kind === 'ratio' ? Math.min(1, Math.max(0, next)) : Math.max(0, next)
            setDriver(meta.key, capped)
          }

          return (
            <label
              key={meta.key}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/80 transition hover:border-sky-200"
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
                {showUnitPill && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                    {meta.unit}
                  </span>
                )}
                {kind === 'ratio' && (
                  <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    %
                  </span>
                )}
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
                <AffixedNumberInput
                  kind={kind}
                  value={value}
                  step={step}
                  label={meta.label}
                  onCommit={(next) => setDriver(meta.key, next)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    bump(1)
                  }}
                  aria-label={`Increase ${meta.label}`}
                  disabled={kind === 'ratio' && value >= 1}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                </button>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
