export type Drivers = {
  vehicles: number
  days: number
  travels_per_vehicle: number
  passengers: number
  fare: number
  additional_travels: number
  parcels_per_day: number
  parcel_fee: number
  luggage_adoption: number
  luggage_fee: number
  cohort: number
  baseline_retention: number
  package_uptake: number
  outward_fare: number
  return_fare: number
  ad_monthly: number
  central_per_travel: number
  parcel_central: number
  luggage_central: number
  return_central: number
  ad_central: number
}

export type DriverMeta = {
  key: keyof Drivers
  label: string
  unit: string
  purpose: string
  step?: number
}

export const DEFAULT_DRIVERS: Drivers = {
  vehicles: 170,
  days: 26,
  travels_per_vehicle: 6,
  passengers: 12,
  fare: 5000,
  additional_travels: 0.5,
  parcels_per_day: 1,
  parcel_fee: 4000,
  luggage_adoption: 0.1,
  luggage_fee: 3000,
  cohort: 10000,
  baseline_retention: 0.2,
  package_uptake: 0.35,
  outward_fare: 5000,
  return_fare: 4000,
  ad_monthly: 10000000,
  central_per_travel: 10000,
  parcel_central: 0.1,
  luggage_central: 0.1,
  return_central: 0.1,
  ad_central: 1.0,
}

export const DRIVER_META: DriverMeta[] = [
  { key: 'vehicles', label: 'Vehicles', unit: 'count', purpose: 'Fleet size used across travel, parcel, and luggage streams' },
  { key: 'days', label: 'Operating days / month', unit: 'days', purpose: 'Converts daily figures to monthly' },
  { key: 'travels_per_vehicle', label: 'Travels per vehicle / day', unit: 'travels', purpose: 'Base travel frequency for luggage adoption base' },
  { key: 'passengers', label: 'Passengers per travel', unit: 'pax', purpose: 'Seats filled per travel for fare and luggage' },
  { key: 'fare', label: 'Passenger fare', unit: 'UGX', purpose: 'Ticket price for additional passenger travels', step: 500 },
  { key: 'additional_travels', label: 'Additional travels / vehicle / day', unit: 'travels', purpose: 'Incremental travels beyond baseline' },
  { key: 'parcels_per_day', label: 'Parcels per vehicle / day', unit: 'parcels', purpose: 'Parcel volume driver' },
  { key: 'parcel_fee', label: 'Parcel fee', unit: 'UGX', purpose: 'Fee charged per parcel', step: 500 },
  { key: 'luggage_adoption', label: 'Luggage adoption rate', unit: 'ratio', purpose: 'Share of passenger seats that pay luggage fee', step: 0.01 },
  { key: 'luggage_fee', label: 'Luggage fee', unit: 'UGX', purpose: 'Fee per luggage-adopting passenger', step: 500 },
  { key: 'cohort', label: 'Return-ticket cohort', unit: 'pax / month', purpose: 'Monthly outward travellers eligible for return package' },
  { key: 'baseline_retention', label: 'Baseline return retention', unit: 'ratio', purpose: 'Share who already buy a return without the package', step: 0.01 },
  { key: 'package_uptake', label: 'Package uptake', unit: 'ratio', purpose: 'Share who buy the return package', step: 0.01 },
  { key: 'outward_fare', label: 'Outward fare (reference)', unit: 'UGX', purpose: 'Reference only — not used in uplift math', step: 500 },
  { key: 'return_fare', label: 'Return fare', unit: 'UGX', purpose: 'Price applied to incremental return bookings', step: 500 },
  { key: 'ad_monthly', label: 'Advertising revenue / month', unit: 'UGX', purpose: 'Monthly advertising gross', step: 500000 },
  { key: 'central_per_travel', label: 'Central fee per additional travel', unit: 'UGX', purpose: 'Association capture per additional travel (not % of fare)', step: 1000 },
  { key: 'parcel_central', label: 'Parcel central capture', unit: 'ratio', purpose: 'Share of parcel gross retained centrally', step: 0.01 },
  { key: 'luggage_central', label: 'Luggage central capture', unit: 'ratio', purpose: 'Share of luggage gross retained centrally', step: 0.01 },
  { key: 'return_central', label: 'Return-ticket central capture', unit: 'ratio', purpose: 'Share of return uplift gross retained centrally', step: 0.01 },
  { key: 'ad_central', label: 'Advertising central capture', unit: 'ratio', purpose: 'Share of advertising gross retained centrally', step: 0.01 },
]

export type StreamId =
  | 'additional_passenger'
  | 'parcels'
  | 'luggage'
  | 'return_ticket'
  | 'advertising'

export const DEFAULT_STREAM_ACTIVE: Record<StreamId, boolean> = {
  additional_passenger: true,
  parcels: true,
  luggage: true,
  return_ticket: true,
  advertising: true,
}

export type StreamResult = {
  id: StreamId
  name: string
  daily: number
  monthly: number
  quarterly: number
  annual: number
  monthly_central: number
  annual_central: number
  central_capture_pct: number
}

export type ReturnTicketDetail = {
  baseline_retained: number
  package_bookings: number
  incremental_bookings: number
  incremental_uptake: number
}

export type ProjectionResult = {
  streams: StreamResult[]
  totals: {
    monthly_gross: number
    monthly_central: number
    annual_gross: number
    annual_central: number
  }
  returnDetail: ReturnTicketDetail
}

function capturePct(central: number, gross: number): number {
  return gross !== 0 ? central / gross : 0
}

function isStreamActive(
  active: Record<StreamId, boolean> | undefined,
  id: StreamId,
): boolean {
  return active?.[id] !== false
}

export function computeProjections(
  d: Drivers,
  active?: Record<StreamId, boolean>,
): ProjectionResult {
  // Additional passenger travels
  const addDaily = d.vehicles * d.additional_travels * d.passengers * d.fare
  const addMonthly = addDaily * d.days
  const addMonthlyCentral = d.vehicles * d.additional_travels * d.days * d.central_per_travel

  // Parcels
  const parcelDaily = d.vehicles * d.parcels_per_day * d.parcel_fee
  const parcelMonthly = parcelDaily * d.days
  const parcelMonthlyCentral = parcelMonthly * d.parcel_central

  // Luggage
  const luggageDaily =
    d.vehicles * d.travels_per_vehicle * d.passengers * d.luggage_adoption * d.luggage_fee
  const luggageMonthly = luggageDaily * d.days
  const luggageMonthlyCentral = luggageMonthly * d.luggage_central

  // Return-ticket uplift
  const baseline_retained = d.cohort * d.baseline_retention
  const package_bookings = d.cohort * d.package_uptake
  const incremental_bookings = Math.max(package_bookings - baseline_retained, 0)
  const incremental_uptake = Math.max(d.package_uptake - d.baseline_retention, 0)
  const returnMonthly = d.cohort * incremental_uptake * d.return_fare
  const returnDaily = returnMonthly / d.days
  const returnMonthlyCentral = returnMonthly * d.return_central

  // Advertising
  const adMonthly = d.ad_monthly
  const adDaily = adMonthly / d.days
  const adMonthlyCentral = adMonthly * d.ad_central

  const mk = (
    id: StreamId,
    name: string,
    daily: number,
    monthly: number,
    monthly_central: number,
  ): StreamResult => ({
    id,
    name,
    daily,
    monthly,
    quarterly: monthly * 3,
    annual: monthly * 12,
    monthly_central,
    annual_central: monthly_central * 12,
    central_capture_pct: capturePct(monthly_central, monthly),
  })

  const streams: StreamResult[] = [
    mk('additional_passenger', 'Additional passenger travels', addDaily, addMonthly, addMonthlyCentral),
    mk('parcels', 'Parcels', parcelDaily, parcelMonthly, parcelMonthlyCentral),
    mk('luggage', 'Luggage', luggageDaily, luggageMonthly, luggageMonthlyCentral),
    mk('return_ticket', 'Return-ticket uplift', returnDaily, returnMonthly, returnMonthlyCentral),
    mk('advertising', 'Advertising', adDaily, adMonthly, adMonthlyCentral),
  ]

  const included = streams.filter((x) => isStreamActive(active, x.id))
  const monthly_gross = included.reduce((s, x) => s + x.monthly, 0)
  const monthly_central = included.reduce((s, x) => s + x.monthly_central, 0)
  const annual_gross = included.reduce((s, x) => s + x.annual, 0)
  const annual_central = included.reduce((s, x) => s + x.annual_central, 0)

  return {
    streams,
    totals: { monthly_gross, monthly_central, annual_gross, annual_central },
    returnDetail: {
      baseline_retained,
      package_bookings,
      incremental_bookings,
      incremental_uptake,
    },
  }
}
