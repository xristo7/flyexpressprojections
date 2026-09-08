import { useDrivers } from '../components/DriversContext'
import { KpiCards } from '../components/KpiCards'
import type { StreamId } from '../lib/calculations'
import { formatPct, formatUGX } from '../lib/format'

function StreamToggle({
  id,
  name,
  checked,
  onChange,
}: {
  id: StreamId
  name: string
  checked: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${name} active`}
      id={`stream-active-${id}`}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3d91] focus-visible:ring-offset-2',
        checked ? 'bg-[#0b3d91]' : 'bg-slate-300',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

export function SummaryPage() {
  const { projections, streamActive, setStreamActive } = useDrivers()
  const { streams, totals } = projections

  const activeDaily = streams
    .filter((s) => streamActive[s.id] !== false)
    .reduce((sum, x) => sum + x.daily, 0)

  const rows = [
    ...streams,
    {
      id: 'total' as const,
      name: 'Total',
      daily: activeDaily,
      monthly: totals.monthly_gross,
      quarterly: totals.monthly_gross * 3,
      annual: totals.annual_gross,
      monthly_central: totals.monthly_central,
      annual_central: totals.annual_central,
      central_capture_pct:
        totals.monthly_gross !== 0 ? totals.monthly_central / totals.monthly_gross : 0,
    },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Projection Summary</h2>
        <p className="mt-1 max-w-3xl text-slate-600">
          KPI overview of projected gross turnover and central (association) capture across revenue streams.
        </p>
      </section>

      <KpiCards />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Income table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Active</th>
                <th className="px-4 py-3 font-semibold">Stream</th>
                <th className="px-4 py-3 font-semibold">Daily</th>
                <th className="px-4 py-3 font-semibold">Monthly</th>
                <th className="px-4 py-3 font-semibold">Quarterly</th>
                <th className="px-4 py-3 font-semibold">Annual</th>
                <th className="px-4 py-3 font-semibold">Monthly central</th>
                <th className="px-4 py-3 font-semibold">Annual central</th>
                <th className="px-4 py-3 font-semibold">Central %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isTotal = row.id === 'total'
                const isActive = isTotal || streamActive[row.id as StreamId] !== false
                return (
                  <tr
                    key={row.id}
                    className={[
                      isTotal
                        ? 'bg-sky-50 font-semibold text-slate-900'
                        : 'border-t border-slate-100 text-slate-700',
                      !isTotal && !isActive ? 'opacity-50' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <td className="px-4 py-3">
                      {!isTotal && (
                        <StreamToggle
                          id={row.id as StreamId}
                          name={row.name}
                          checked={isActive}
                          onChange={(enabled) => setStreamActive(row.id as StreamId, enabled)}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.daily)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.monthly)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.quarterly)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.annual)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.monthly_central)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.annual_central)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatPct(row.central_capture_pct)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Gross turnover</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Full customer transaction value for each stream. Gross is not automatically retained by the association.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Central</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Association capture — the portion of activity attributed to central (fee-per-travel or capture %).
            Central capture % = monthly central ÷ monthly gross (0 when gross is zero).
          </p>
        </article>
      </section>
    </div>
  )
}
