/** Assert default drivers produce expected sheet totals (streamlined delivery segmentation). */
const d = {
  vehicles: 170,
  days: 26,
  travels_per_vehicle: 6,
  passengers: 12,
  fare: 5000,
  additional_travels: 0.5,
  parcels_per_day: 2,
  parcel_fee: 4000,
  pickup_adoption: 0.25,
  pickup_fee: 4000,
  lastmile_adoption: 0.4,
  lastmile_fee: 4000,
  luggage_adoption: 0.1,
  luggage_fee: 3000,
  cohort: 10000,
  baseline_retention: 0.2,
  package_uptake: 0.35,
  return_fare: 4000,
  ad_monthly: 5_000_000,
  central_per_travel: 10000,
  parcel_central: 0.1,
  pickup_central: 0.1,
  lastmile_central: 0.1,
  luggage_central: 0.1,
  return_central: 0.1,
  ad_central: 1.0,
}

const streams = []

// Additional passenger
{
  const daily = d.vehicles * d.additional_travels * d.passengers * d.fare
  const monthly = daily * d.days
  const monthly_central = d.vehicles * d.additional_travels * d.days * d.central_per_travel
  streams.push({ id: 'additional_passenger', monthly, monthly_central })
}

// Parcel transport
{
  const daily = d.vehicles * d.parcels_per_day * d.parcel_fee
  const monthly = daily * d.days
  const monthly_central = monthly * d.parcel_central
  streams.push({ id: 'parcel_transport', monthly, monthly_central })
}

// Sender pickup
{
  const daily = d.vehicles * d.parcels_per_day * d.pickup_adoption * d.pickup_fee
  const monthly = daily * d.days
  const monthly_central = monthly * d.pickup_central
  streams.push({ id: 'sender_pickup', monthly, monthly_central })
}

// Last-mile delivery
{
  const daily = d.vehicles * d.parcels_per_day * d.lastmile_adoption * d.lastmile_fee
  const monthly = daily * d.days
  const monthly_central = monthly * d.lastmile_central
  streams.push({ id: 'lastmile_delivery', monthly, monthly_central })
}

// Luggage
{
  const daily =
    d.vehicles * d.travels_per_vehicle * d.passengers * d.luggage_adoption * d.luggage_fee
  const monthly = daily * d.days
  const monthly_central = monthly * d.luggage_central
  streams.push({ id: 'luggage', monthly, monthly_central })
}

// Return-ticket uplift
{
  const incremental_uptake = Math.max(d.package_uptake - d.baseline_retention, 0)
  const monthly = d.cohort * incremental_uptake * d.return_fare
  const monthly_central = monthly * d.return_central
  streams.push({ id: 'return_ticket', monthly, monthly_central })
}

// Advertising
{
  const monthly = d.ad_monthly
  const monthly_central = monthly * d.ad_central
  streams.push({ id: 'advertising', monthly, monthly_central })
}

const EXPECT = {
  additional_passenger: { monthly: 132600000, monthly_central: 22100000 },
  parcel_transport: { monthly: 35360000, monthly_central: 3536000 },
  sender_pickup: { monthly: 8840000, monthly_central: 884000 },
  lastmile_delivery: { monthly: 14144000, monthly_central: 1414400 },
  luggage: { monthly: 95472000, monthly_central: 9547200 },
  return_ticket: { monthly: 6000000, monthly_central: 600000 },
  advertising: { monthly: 5000000, monthly_central: 5000000 },
}

const EXPECT_TOTAL_MONTHLY = 297416000
const EXPECT_TOTAL_CENTRAL = 43081600

let failed = false

/** Near-equality for IEEE float ratio products (e.g. 0.35 - 0.2). */
function nearlyEqual(a, b, eps = 1e-6) {
  return Math.abs(a - b) <= eps
}

function assertEq(label, got, expected) {
  if (!nearlyEqual(got, expected)) {
    console.error(`FAIL ${label}: got ${got}, expected ${expected}`)
    failed = true
  } else {
    console.log(`OK ${label} === ${expected}`)
  }
}

for (const s of streams) {
  const exp = EXPECT[s.id]
  assertEq(`${s.id} monthly`, s.monthly, exp.monthly)
  assertEq(`${s.id} monthly_central`, s.monthly_central, exp.monthly_central)
}

const totalMonthly = streams.reduce((a, s) => a + s.monthly, 0)
const totalCentral = streams.reduce((a, s) => a + s.monthly_central, 0)
assertEq('monthly gross total', totalMonthly, EXPECT_TOTAL_MONTHLY)
assertEq('monthly central total', totalCentral, EXPECT_TOTAL_CENTRAL)

if (failed) process.exit(1)
console.log('Defaults verification passed.')
