import { useDrivers } from '../components/DriversContext'
import { FormulaBlock } from '../components/FormulaBlock'
import { formatNumber, formatPct, formatUGX } from '../lib/format'

export function CalculationsPage() {
  const { drivers: d, projections } = useDrivers()
  const add = projections.streams.find((s) => s.id === 'additional_passenger')!
  const parcelTransport = projections.streams.find((s) => s.id === 'parcel_transport')!
  const senderPickup = projections.streams.find((s) => s.id === 'sender_pickup')!
  const lastmile = projections.streams.find((s) => s.id === 'lastmile_delivery')!
  const luggage = projections.streams.find((s) => s.id === 'luggage')!
  const ret = projections.streams.find((s) => s.id === 'return_ticket')!
  const ad = projections.streams.find((s) => s.id === 'advertising')!
  const rd = projections.returnDetail
  const n = formatNumber

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Calculations</h2>
        <p className="mt-1 max-w-3xl text-slate-600">
          How each stream is derived: symbolic formula, numbers substituted from current inputs, and key intermediates.
        </p>
      </section>

      <FormulaBlock
        title="Additional passenger travels"
        symbolic={[
          'daily = vehicles x additional_travels x passengers x fare',
          'monthly = daily x days',
          'quarterly = monthly x 3',
          'annual = monthly x 12',
          'monthly_central = vehicles x additional_travels x days x central_per_travel',
          'annual_central = monthly_central x 12',
        ]}
        substituted={[
          'daily = ' + n(d.vehicles) + ' x ' + n(d.additional_travels) + ' x ' + n(d.passengers) + ' x ' + n(d.fare) + ' = ' + formatUGX(add.daily),
          'monthly = ' + formatUGX(add.daily) + ' x ' + n(d.days) + ' = ' + formatUGX(add.monthly),
          'monthly_central = ' + n(d.vehicles) + ' x ' + n(d.additional_travels) + ' x ' + n(d.days) + ' x ' + n(d.central_per_travel) + ' = ' + formatUGX(add.monthly_central),
        ]}
        results={[
          { label: 'Daily gross', value: formatUGX(add.daily) },
          { label: 'Monthly gross', value: formatUGX(add.monthly) },
          { label: 'Monthly central', value: formatUGX(add.monthly_central) },
          { label: 'Central capture', value: formatPct(add.central_capture_pct) },
        ]}
      />

      <article className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">Delivery segmentation note:</span>{' '}
          Sender pickup and last-mile delivery adoptions are <strong>independent</strong> — a parcel can use neither, either, or both. Both are applied to the same{' '}
          <code className="rounded bg-white px-1 py-0.5 text-xs">parcels_per_day</code> volume base.
        </p>
      </article>

      <FormulaBlock
        title="Parcel transport"
        symbolic={[
          'daily = vehicles x parcels_per_day x parcel_fee',
          'monthly = daily x days',
          'monthly_central = monthly x parcel_central',
          'annual_central = monthly_central x 12',
        ]}
        substituted={[
          'daily = ' + n(d.vehicles) + ' x ' + n(d.parcels_per_day) + ' x ' + n(d.parcel_fee) + ' = ' + formatUGX(parcelTransport.daily),
          'monthly = ' + formatUGX(parcelTransport.daily) + ' x ' + n(d.days) + ' = ' + formatUGX(parcelTransport.monthly),
          'monthly_central = ' + formatUGX(parcelTransport.monthly) + ' x ' + n(d.parcel_central) + ' = ' + formatUGX(parcelTransport.monthly_central),
        ]}
        results={[
          { label: 'Daily gross', value: formatUGX(parcelTransport.daily) },
          { label: 'Monthly gross', value: formatUGX(parcelTransport.monthly) },
          { label: 'Monthly central', value: formatUGX(parcelTransport.monthly_central) },
          { label: 'Central capture', value: formatPct(parcelTransport.central_capture_pct) },
        ]}
      />

      <FormulaBlock
        title="Sender pickup"
        symbolic={[
          'daily = vehicles x parcels_per_day x pickup_adoption x pickup_fee',
          'monthly = daily x days',
          'monthly_central = monthly x pickup_central',
          'annual_central = monthly_central x 12',
        ]}
        substituted={[
          'daily = ' + n(d.vehicles) + ' x ' + n(d.parcels_per_day) + ' x ' + n(d.pickup_adoption) + ' x ' + n(d.pickup_fee) + ' = ' + formatUGX(senderPickup.daily),
          'monthly = ' + formatUGX(senderPickup.daily) + ' x ' + n(d.days) + ' = ' + formatUGX(senderPickup.monthly),
          'monthly_central = ' + formatUGX(senderPickup.monthly) + ' x ' + n(d.pickup_central) + ' = ' + formatUGX(senderPickup.monthly_central),
        ]}
        results={[
          { label: 'Daily gross', value: formatUGX(senderPickup.daily) },
          { label: 'Monthly gross', value: formatUGX(senderPickup.monthly) },
          { label: 'Monthly central', value: formatUGX(senderPickup.monthly_central) },
          { label: 'Central capture', value: formatPct(senderPickup.central_capture_pct) },
        ]}
      />

      <FormulaBlock
        title="Last-mile delivery"
        symbolic={[
          'daily = vehicles x parcels_per_day x lastmile_adoption x lastmile_fee',
          'monthly = daily x days',
          'monthly_central = monthly x lastmile_central',
          'annual_central = monthly_central x 12',
        ]}
        substituted={[
          'daily = ' + n(d.vehicles) + ' x ' + n(d.parcels_per_day) + ' x ' + n(d.lastmile_adoption) + ' x ' + n(d.lastmile_fee) + ' = ' + formatUGX(lastmile.daily),
          'monthly = ' + formatUGX(lastmile.daily) + ' x ' + n(d.days) + ' = ' + formatUGX(lastmile.monthly),
          'monthly_central = ' + formatUGX(lastmile.monthly) + ' x ' + n(d.lastmile_central) + ' = ' + formatUGX(lastmile.monthly_central),
        ]}
        results={[
          { label: 'Daily gross', value: formatUGX(lastmile.daily) },
          { label: 'Monthly gross', value: formatUGX(lastmile.monthly) },
          { label: 'Monthly central', value: formatUGX(lastmile.monthly_central) },
          { label: 'Central capture', value: formatPct(lastmile.central_capture_pct) },
        ]}
      />

      <FormulaBlock
        title="Luggage"
        symbolic={[
          'daily = vehicles x travels_per_vehicle x passengers x luggage_adoption x luggage_fee',
          'monthly = daily x days',
          'monthly_central = monthly x luggage_central',
        ]}
        substituted={[
          'daily = ' + n(d.vehicles) + ' x ' + n(d.travels_per_vehicle) + ' x ' + n(d.passengers) + ' x ' + n(d.luggage_adoption) + ' x ' + n(d.luggage_fee) + ' = ' + formatUGX(luggage.daily),
          'monthly = ' + formatUGX(luggage.daily) + ' x ' + n(d.days) + ' = ' + formatUGX(luggage.monthly),
          'monthly_central = ' + formatUGX(luggage.monthly) + ' x ' + n(d.luggage_central) + ' = ' + formatUGX(luggage.monthly_central),
        ]}
        results={[
          { label: 'Daily gross', value: formatUGX(luggage.daily) },
          { label: 'Monthly gross', value: formatUGX(luggage.monthly) },
          { label: 'Monthly central', value: formatUGX(luggage.monthly_central) },
          { label: 'Central capture', value: formatPct(luggage.central_capture_pct) },
        ]}
      />

      <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Return-ticket uplift logic</h3>
        <p className="mt-2 text-sm text-slate-600">
          Only the incremental uptake above baseline retention creates uplift. Outward fare is reference-only and is not used in the uplift amount.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ul className="space-y-2 font-mono text-xs text-slate-700 sm:text-sm">
            <li className="rounded-lg bg-white px-3 py-2">incremental_uptake = max(package_uptake - baseline_retention, 0)</li>
            <li className="rounded-lg bg-white px-3 py-2">monthly = cohort x incremental_uptake x return_fare</li>
            <li className="rounded-lg bg-white px-3 py-2">daily = monthly / days</li>
            <li className="rounded-lg bg-white px-3 py-2">monthly_central = monthly x return_central</li>
            <li className="rounded-lg bg-white px-3 py-2">baseline_retained = cohort x baseline_retention</li>
            <li className="rounded-lg bg-white px-3 py-2">package_bookings = cohort x package_uptake</li>
            <li className="rounded-lg bg-white px-3 py-2">incremental_bookings = max(package_bookings - baseline_retained, 0)</li>
          </ul>
          <ul className="space-y-2 font-mono text-xs text-slate-700 sm:text-sm">
            <li className="rounded-lg bg-white px-3 py-2">{'incremental_uptake = max(' + n(d.package_uptake) + ' - ' + n(d.baseline_retention) + ', 0) = ' + n(rd.incremental_uptake)}</li>
            <li className="rounded-lg bg-white px-3 py-2">{'baseline_retained = ' + n(d.cohort) + ' x ' + n(d.baseline_retention) + ' = ' + n(rd.baseline_retained)}</li>
            <li className="rounded-lg bg-white px-3 py-2">{'package_bookings = ' + n(d.cohort) + ' x ' + n(d.package_uptake) + ' = ' + n(rd.package_bookings)}</li>
            <li className="rounded-lg bg-white px-3 py-2">{'incremental_bookings = ' + n(rd.incremental_bookings)}</li>
            <li className="rounded-lg bg-white px-3 py-2">{'monthly = ' + n(d.cohort) + ' x ' + n(rd.incremental_uptake) + ' x ' + n(d.return_fare) + ' = ' + formatUGX(ret.monthly)}</li>
            <li className="rounded-lg bg-white px-3 py-2">{'outward_fare (reference) = ' + formatUGX(d.outward_fare)}</li>
          </ul>
        </div>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-amber-100 bg-white px-3 py-2">
            <dt className="text-xs text-slate-500">Daily gross</dt>
            <dd className="text-sm font-semibold">{formatUGX(ret.daily)}</dd>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white px-3 py-2">
            <dt className="text-xs text-slate-500">Monthly gross</dt>
            <dd className="text-sm font-semibold">{formatUGX(ret.monthly)}</dd>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white px-3 py-2">
            <dt className="text-xs text-slate-500">Monthly central</dt>
            <dd className="text-sm font-semibold">{formatUGX(ret.monthly_central)}</dd>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white px-3 py-2">
            <dt className="text-xs text-slate-500">Central capture</dt>
            <dd className="text-sm font-semibold">{formatPct(ret.central_capture_pct)}</dd>
          </div>
        </dl>
      </article>

      <FormulaBlock
        title="Advertising"
        symbolic={[
          'monthly = ad_monthly',
          'daily = monthly / days',
          'monthly_central = monthly x ad_central',
          'annual_central = monthly_central x 12',
        ]}
        substituted={[
          'monthly = ' + formatUGX(d.ad_monthly),
          'daily = ' + formatUGX(d.ad_monthly) + ' / ' + n(d.days) + ' = ' + formatUGX(ad.daily),
          'monthly_central = ' + formatUGX(ad.monthly) + ' x ' + n(d.ad_central) + ' = ' + formatUGX(ad.monthly_central),
        ]}
        results={[
          { label: 'Daily gross', value: formatUGX(ad.daily) },
          { label: 'Monthly gross', value: formatUGX(ad.monthly) },
          { label: 'Monthly central', value: formatUGX(ad.monthly_central) },
          { label: 'Central capture', value: formatPct(ad.central_capture_pct) },
        ]}
      />

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Totals and capture rule</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>Sum monthly gross = {formatUGX(projections.totals.monthly_gross)}</li>
          <li>Sum monthly central = {formatUGX(projections.totals.monthly_central)}</li>
          <li>Sum annual gross = {formatUGX(projections.totals.annual_gross)}</li>
          <li className="font-mono text-xs sm:text-sm">central_capture_% = monthly_central / monthly_gross if monthly_gross != 0 else 0</li>
        </ul>
      </article>
    </div>
  )
}
