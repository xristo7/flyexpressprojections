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

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-UG', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatPct(ratio: number): string {
  return `${numberFormatter.format(ratio * 100)}%`
}
