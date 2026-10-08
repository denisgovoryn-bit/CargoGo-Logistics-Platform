export type LoaderCount = 0 | 1 | 2;
export type LoaderMode = 'none' | 'driver' | 'additional';

export const pricingConfig = {
  loaderHourlyRatePerPersonCzk: 300,
  maximumLoaders: 2 as const,
  billingIncrementMinutes: 15,
  estimatedArrivalMinutes: 20,
  standardLoadingMinutes: 30,
  estimatedTransportMinutes: 25,
  standardUnloadingMinutes: 30,
  platformCommissionRate: 0.15,
  transportPricesCzk: { 'Small Van': 790, 'Large Van': 1190, Truck: 1740 },
};

export const roundBillableMinutes = (minutes: number, increment = pricingConfig.billingIncrementMinutes) => {
  if (minutes < 0 || increment <= 0) throw new Error('Minutes and billing increment must be valid');
  return Math.ceil(minutes / increment) * increment;
};

export function calculateLoaderCharge(minutes: number, loaderCount: LoaderCount, hourlyRate = pricingConfig.loaderHourlyRatePerPersonCzk) {
  if (loaderCount === 0) return { billableMinutes: 0, chargeCzk: 0 };
  if (loaderCount < 0 || loaderCount > pricingConfig.maximumLoaders || hourlyRate < 0) throw new Error('Invalid loader pricing input');
  const billableMinutes = roundBillableMinutes(minutes);
  return { billableMinutes, chargeCzk: Math.round((billableMinutes / 60) * hourlyRate * loaderCount) };
}

export function calculateMobileOrderFinancials(transportChargeCzk: number, loaderChargeCzk: number, loaderMode: LoaderMode) {
  if (transportChargeCzk < 0 || loaderChargeCzk < 0) throw new Error('Charges cannot be negative');
  if (loaderMode === 'none' && loaderChargeCzk !== 0) throw new Error('Loader charge requires loader mode');
  const transportCommissionCzk = Math.round(transportChargeCzk * pricingConfig.platformCommissionRate);
  const loaderCommissionCzk = Math.round(loaderChargeCzk * pricingConfig.platformCommissionRate);
  const driverTransportEarningsCzk = transportChargeCzk - transportCommissionCzk;
  const driverLoaderEarningsCzk = loaderMode === 'driver' ? loaderChargeCzk - loaderCommissionCzk : 0;
  const additionalLoaderPayoutCzk = loaderMode === 'additional' ? loaderChargeCzk - loaderCommissionCzk : 0;
  return {
    customerTotalCzk: transportChargeCzk + loaderChargeCzk,
    platformTransportCommissionCzk: transportCommissionCzk,
    platformLoaderCommissionCzk: loaderCommissionCzk,
    platformTotalCommissionCzk: transportCommissionCzk + loaderCommissionCzk,
    driverPayoutCzk: driverTransportEarningsCzk + driverLoaderEarningsCzk,
    additionalLoaderPayoutCzk,
  };
}

export const estimatedLoaderMinutes = pricingConfig.estimatedArrivalMinutes + pricingConfig.standardLoadingMinutes + pricingConfig.estimatedTransportMinutes + pricingConfig.standardUnloadingMinutes;
