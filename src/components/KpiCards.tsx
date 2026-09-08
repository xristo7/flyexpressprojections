import { useDrivers } from './DriversContext'
import { formatUGX, formatUGXCompact } from '../lib/format'

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
      label: 'Monthly gross',
      amount: totals.monthly_gross,
      hint: 'Sum of stream monthly turnover',
    },
    {
      label: 'Annual gross',
      amount: totals.annual_gross,
      hint: 'Monthly gross × 12',
    },
    {
      label: 'Monthly central',
      amount: totals.monthly_central,
      hint: 'Association capture this month',
    },
    {
      label: 'Annual central',
      amount: totals.annual_central,
      hint: 'Monthly central × 12',
    },
  ]

  return (
    <section
      className={[
        'grid grid-cols-2',
        compact ? 'gap-2 sm:gap-3' : 'gap-3 sm:gap-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Key performance indicators"
    >
      {kpis.map((kpi) => {
        const full = formatUGX(kpi.amount)
        const short = formatUGXCompact(kpi.amount)
        return (
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
                compact ? 'text-base sm:text-xl' : 'text-xl sm:text-2xl',
              ].join(' ')}
              title={full}
            >
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{full}</span>
            </p>
            {!compact && <p className="mt-2 text-xs text-white/70">{kpi.hint}</p>}
          </article>
        )
      })}
    </section>
  )
}
