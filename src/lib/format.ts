const ugxFormatter = new Intl.NumberFormat('en-UG', {
  style: 'currency',
  currency: 'UGX',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-UG', {
  maximumFractionDigits: 2,
})

export function formatUGX(value: number): string {
  return ugxFormatter.format(Math.round(value))
}

/** Compact UGX for tight mobile KPI cards. Rounds to nearest thousand, then K/M/B. */
export function formatUGXCompact(value: number): string {
  const rounded = Math.round(value / 1000) * 1000
  const abs = Math.abs(rounded)
  const sign = rounded < 0 ? '-' : ''

  const trim = (n: number, decimals: number) => {
    const fixed = n.toFixed(decimals)
    return fixed.replace(/\.?0+$/, '')
  }

  if (abs >= 1_000_000_000) {
    return `${sign}${trim(abs / 1_000_000_000, 2)}B`
  }
  if (abs >= 1_000_000) {
    return `${sign}${trim(abs / 1_000_000, 1)}M`
  }
  if (abs >= 1_000) {
    return `${sign}${trim(abs / 1_000, 1)}K`
  }
  return `${sign}${abs}`
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-UG', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatPct(ratio: number): string {
  return `${numberFormatter.format(ratio * 100)}%`
}
