/** Assert default drivers produce expected Additional passenger travels figures. */
const d = {
  vehicles: 170,
  days: 26,
  passengers: 12,
  fare: 5000,
  additional_travels: 0.5,
  central_per_travel: 10000,
}

const daily = d.vehicles * d.additional_travels * d.passengers * d.fare
const monthly = daily * d.days
const monthly_central = d.vehicles * d.additional_travels * d.days * d.central_per_travel

const EXPECT_MONTHLY = 132600000
const EXPECT_CENTRAL = 22100000

let failed = false
if (monthly !== EXPECT_MONTHLY) {
  console.error('FAIL monthly: got ' + monthly + ', expected ' + EXPECT_MONTHLY)
  failed = true
} else {
  console.log('OK Additional passenger travels monthly === ' + EXPECT_MONTHLY)
}
if (monthly_central !== EXPECT_CENTRAL) {
  console.error('FAIL monthly_central: got ' + monthly_central + ', expected ' + EXPECT_CENTRAL)
  failed = true
} else {
  console.log('OK Additional passenger travels monthly_central === ' + EXPECT_CENTRAL)
}

if (failed) process.exit(1)
console.log('Defaults verification passed.')
