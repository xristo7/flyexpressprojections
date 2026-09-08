import { DRIVER_META } from '../lib/calculations'
import { useDrivers } from '../components/DriversContext'
import { formatNumber } from '../lib/format'

export function InputsPage() {
  const { drivers, setDriver, reset } = useDrivers()

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 md:grid-cols-2">
        {DRIVER_META.map((meta) => (
          <label
            key={meta.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="block text-sm font-semibold text-slate-900">{meta.label}</span>
                <span className="mt-1 block text-xs text-slate-500">{meta.purpose}</span>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                {meta.unit}
              </span>
            </div>
            <input
              type="number"
              step={meta.step ?? (Number.isInteger(drivers[meta.key]) ? 1 : 0.01)}
              value={drivers[meta.key]}
              onChange={(e) => {
                const next = Number(e.target.value)
                if (Number.isFinite(next)) setDriver(meta.key, next)
              }}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-sky-600 focus:bg-white focus:ring-2"
            />
            <p className="mt-2 text-xs text-slate-500">Current: {formatNumber(drivers[meta.key])}</p>
          </label>
        ))}
      </div>
    </div>
  )
}
