import { useDrivers } from './DriversContext'
import { formatUShCompactParts, formatUShParts } from '../lib/format'

type KpiCardsProps = {
  /** Compact padding / type for sticky strip above the inputs drawer */
  compact?: boolean
  className?: string
}

function MoneyValue({
  amount,
  compactDisplay,
  className,
}: {
  amount: number
  /** When true, prefer compact K/M/B (used on mobile) */
  compactDisplay: boolean
  className?: string
}) {
  const full = formatUShParts(amount)
  const short = formatUShCompactParts(amount)
  const parts = compactDisplay ? short : full
  const title = `USh ${full.amount}`

  return (
    <p className={className} title={title}>
      <span className="mr-1 text-[0.65em] font-medium tracking-wide text-white/45">
        {parts.symbol}
      </span>
      <span>{parts.amount}</span>
    </p>
  )
}

export function KpiCards({ compact = false, className = '' }: KpiCardsProps) {
  const { projections } = useDrivers()
  const { totals } = projections

  const kpis = [
    {
      label: 'Monthly gross',
      amount: totals.monthly_gross,
      hint: 'Sum of stream monthly turnover',
      tone: 'navy' as const,
    },
    {
      label: 'Annual gross',
      amount: totals.annual_gross,
      hint: 'Monthly gross × 12',
      tone: 'navy' as const,
    },
    {
      label: 'Monthly central',
      amount: totals.monthly_central,
      hint: 'Association capture this month',
      tone: 'army' as const,
    },
    {
      label: 'Annual central',
      amount: totals.annual_central,
      hint: 'Monthly central × 12',
      tone: 'army' as const,
    },
  ]

  return (
    <section
      className={[
        // Mobile: 2×2 pairs; desktop: four columns with full amounts
        'grid grid-cols-2 md:grid-cols-4',
        compact ? 'gap-2 md:gap-3' : 'gap-3 md:gap-4',
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
            'rounded-2xl border border-white/15 text-white shadow-sm',
            kpi.tone === 'army' ? 'bg-[#4B5320]' : 'bg-[#0b3d91]',
            compact ? 'p-3 md:p-4' : 'p-4 md:p-5',
          ].join(' ')}
        >
          <p
            className={[
              'font-medium text-white/80',
              compact ? 'text-xs md:text-sm' : 'text-sm',
            ].join(' ')}
          >
            {kpi.label}
          </p>
          {/* Mobile: compact K/M/B; desktop (md+): full amount — both use muted USh */}
          <div className="md:hidden">
            <MoneyValue
              amount={kpi.amount}
              compactDisplay
              className={[
                'mt-1 font-bold tracking-tight text-white',
                compact ? 'text-base' : 'text-xl',
              ].join(' ')}
            />
          </div>
          <div className="hidden md:block">
            <MoneyValue
              amount={kpi.amount}
              compactDisplay={false}
              className={[
                'mt-2 font-bold tracking-tight text-white',
                compact ? 'text-lg lg:text-xl' : 'text-xl lg:text-2xl',
              ].join(' ')}
            />
          </div>
          {!compact && <p className="mt-2 text-xs text-white/70">{kpi.hint}</p>}
        </article>
      ))}
    </section>
  )
}
