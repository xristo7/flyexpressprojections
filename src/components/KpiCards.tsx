import { useDrivers } from './DriversContext'
import { formatUGX } from '../lib/format'

type KpiCardsProps = {
  /** Compact padding / type for sticky strip above the inputs drawer */
  compact?: boolean
  className?: string
}

export function KpiCards({ compact = false, className = '' }: KpiCardsProps) {
  const { projections } = useDrivers()
  const { totals } = projections

  const kpis = [
    {
      label: 'Monthly gross (all streams)',
      value: formatUGX(totals.monthly_gross),
      hint: 'Sum of stream monthly turnover',
    },
    {
      label: 'Monthly central',
      value: formatUGX(totals.monthly_central),
      hint: 'Association capture this month',
    },
    {
      label: 'Annual gross',
      value: formatUGX(totals.annual_gross),
      hint: 'Monthly gross × 12',
    },
  ]

  return (
    <section
      className={[
        'grid gap-3 sm:grid-cols-3',
        compact ? 'gap-2 sm:gap-3' : 'gap-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Key performance indicators"
    >
      {kpis.map((kpi) => (
        <article
          key={kpi.label}
          className={[
            'rounded-2xl border border-white/15 bg-[#0b3d91] text-white shadow-sm',
            compact ? 'p-3 sm:p-4' : 'p-5',
          ].join(' ')}
        >
          <p
            className={[
              'font-medium text-white/80',
              compact ? 'text-xs sm:text-sm' : 'text-sm',
            ].join(' ')}
          >
            {kpi.label}
          </p>
          <p
            className={[
              'mt-1 font-bold tracking-tight text-white sm:mt-2',
              compact ? 'text-lg sm:text-xl' : 'text-2xl',
            ].join(' ')}
          >
            {kpi.value}
          </p>
          {!compact && <p className="mt-2 text-xs text-white/70">{kpi.hint}</p>}
        </article>
      ))}
    </section>
  )
}
