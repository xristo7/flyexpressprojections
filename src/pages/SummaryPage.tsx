import { useDrivers } from '../components/DriversContext'
import { formatPct, formatUGX } from '../lib/format'

export function SummaryPage() {
  const { projections } = useDrivers()
  const { streams, totals } = projections

  const kpis = [
    { label: 'Monthly gross (all streams)', value: formatUGX(totals.monthly_gross), hint: 'Sum of stream monthly turnover' },
    { label: 'Monthly central', value: formatUGX(totals.monthly_central), hint: 'Association capture this month' },
    { label: 'Annual gross', value: formatUGX(totals.annual_gross), hint: 'Monthly gross × 12' },
  ]

  const rows = [
    ...streams,
    {
      id: 'total',
      name: 'Total',
      daily: streams.reduce((s, x) => s + x.daily, 0),
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

      <section className="grid gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
            <p className="mt-2 text-xs text-slate-500">{kpi.hint}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Stream table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
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
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    row.id === 'total'
                      ? 'bg-sky-50 font-semibold text-slate-900'
                      : 'border-t border-slate-100 text-slate-700'
                  }
                >
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.daily)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.monthly)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.quarterly)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.annual)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.monthly_central)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatUGX(row.annual_central)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatPct(row.central_capture_pct)}</td>
                </tr>
              ))}
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
