const numberFormatter = new Intl.NumberFormat('en-UG', {
  maximumFractionDigits: 2,
})

const ugxAmountFormatter = new Intl.NumberFormat('en-UG', {
  maximumFractionDigits: 0,
})

/** Full UGX string (legacy / tables). Prefer formatUShParts for KPI cards. */
export function formatUGX(value: number): string {
  return `USh ${ugxAmountFormatter.format(Math.round(value))}`
}

export type UShParts = { symbol: string; amount: string }

/** Full amount with separate USh symbol for muted styling. */
export function formatUShParts(value: number): UShParts {
  return {
    symbol: 'USh',
    amount: ugxAmountFormatter.format(Math.round(value)),
  }
}

/** Compact amount (K/M/B) after rounding to nearest thousand — for mobile KPIs. */
export function formatUShCompactParts(value: number): UShParts {
  const rounded = Math.round(value / 1000) * 1000
  const abs = Math.abs(rounded)
  const sign = rounded < 0 ? '-' : ''

  const trim = (n: number, decimals: number) => {
    const fixed = n.toFixed(decimals)
    return fixed.replace(/\.?0+$/, '')
  }

  let amount: string
  if (abs >= 1_000_000_000) {
    amount = `${sign}${trim(abs / 1_000_000_000, 2)}B`
  } else if (abs >= 1_000_000) {
    amount = `${sign}${trim(abs / 1_000_000, 1)}M`
  } else if (abs >= 1_000) {
    amount = `${sign}${trim(abs / 1_000, 1)}K`
  } else {
    amount = `${sign}${abs}`
  }

  return { symbol: 'USh', amount }
}

/** @deprecated alias — mobile compact string without symbol */
export function formatUGXCompact(value: number): string {
  return formatUShCompactParts(value).amount
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
