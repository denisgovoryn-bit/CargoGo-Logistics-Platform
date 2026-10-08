export type LoaderMode = 'none' | 'driver' | 'additional';
export type LoaderCount = 0 | 1 | 2;
export type RefundAllocation = 'full_order' | 'transport' | 'loader' | 'platform_fee' | 'platform_compensation' | 'custom';
export type PaymentStatus = 'pending' | 'paid' | 'partially_refunded' | 'refunded' | 'failed';
export type PayoutStatus = 'not_scheduled' | 'pending' | 'paid' | 'held';

export type OrderFinancialInput = {
  transportChargeCzk: number;
  loaderChargeCzk: number;
  additionalChargesCzk: number;
  discountCzk: number;
  platformCommissionRate: number;
  stripeProcessingFeeCzk: number;
  loaderMode: LoaderMode;
  loaderRequired?: boolean;
  loaderCount?: LoaderCount;
  loaderHourlyRateCzk?: number;
  estimatedLoaderMinutes?: number;
  actualLoaderMinutes?: number;
  billingIncrementMinutes?: number;
  additionalLoaderHours?: number;
  additionalLoaderHourlyRateCzk?: number;
  driverDeductionsCzk?: number;
  refundAllocation?: RefundAllocation;
  refundReason?: string;
  transportRefundCzk?: number;
  loaderRefundCzk?: number;
  platformFeeRefundCzk?: number;
  platformCompensationCzk?: number;
  customPlatformRefundCzk?: number;
  customDriverRefundCzk?: number;
  customLoaderRefundCzk?: number;
};

export type OrderFinancials = OrderFinancialInput & {
  refundAllocation: RefundAllocation;
  refundReason: string;
  transportRefundCzk: number;
  loaderRefundCzk: number;
  platformFeeRefundCzk: number;
  platformCompensationCzk: number;
  customPlatformRefundCzk: number;
  customDriverRefundCzk: number;
  customLoaderRefundCzk: number;
  refundCzk: number;
  customerTotalCzk: number;
  finalCollectedCzk: number;
  platformTransportCommissionCzk: number;
  platformLoaderCommissionCzk: number;
  platformTotalCommissionCzk: number;
  grossPlatformCommissionCzk: number;
  netPlatformRevenueCzk: number;
  platformProfitLossCzk: number;
  driverTransportEarningsCzk: number;
  driverLoaderEarningsCzk: number;
  driverPayoutCzk: number;
  additionalLoaderEarningsCzk: number;
  additionalLoaderPayoutCzk: number;
  driverDeductionsCzk: number;
  loaderRequired: boolean;
  loaderCount: LoaderCount;
  loaderHourlyRateCzk: number;
  estimatedLoaderMinutes: number;
  actualLoaderMinutes: number;
  billableLoaderMinutes: number;
};

const money = (value: number) => Math.round(value * 100) / 100;

function assertNonNegative(values: Record<string, number>) {
  for (const [name, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative number`);
  }
}

export function calculatePlatformCommission(amountCzk: number, rate: number) {
  assertNonNegative({ amountCzk });
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) throw new Error('Commission rate must be between 0 and 100');
  return money(amountCzk * rate / 100);
}

export function calculateDriverPayout(transportEarningsCzk: number, loaderEarningsCzk: number, deductionsCzk = 0) {
  assertNonNegative({ transportEarningsCzk, loaderEarningsCzk, deductionsCzk });
  return money(Math.max(0, transportEarningsCzk + loaderEarningsCzk - deductionsCzk));
}

export function calculateLoaderPayout(hours: number, hourlyRateCzk: number, commissionRate: number) {
  assertNonNegative({ hours, hourlyRateCzk });
  const gross = money(hours * hourlyRateCzk);
  return money(gross - calculatePlatformCommission(gross, commissionRate));
}

export function calculateLoaderCharge(minutes: number, loaderCount: LoaderCount, hourlyRateCzk: number, billingIncrementMinutes = 15) {
  assertNonNegative({ minutes, hourlyRateCzk });
  if (loaderCount < 0 || loaderCount > 2 || billingIncrementMinutes <= 0) throw new Error('Invalid loader pricing input');
  if (loaderCount === 0) return { billableLoaderMinutes: 0, loaderChargeCzk: 0 };
  const billableLoaderMinutes = Math.ceil(minutes / billingIncrementMinutes) * billingIncrementMinutes;
  return { billableLoaderMinutes, loaderChargeCzk: money(billableLoaderMinutes / 60 * hourlyRateCzk * loaderCount) };
}

export function calculateOrderFinancials(input: OrderFinancialInput): OrderFinancials {
  const loaderRequired = input.loaderRequired ?? input.loaderMode !== 'none';
  const loaderCount = input.loaderCount ?? (loaderRequired ? 1 : 0);
  const loaderHourlyRateCzk = input.loaderHourlyRateCzk ?? (input.loaderChargeCzk || 0);
  const estimatedLoaderMinutes = input.estimatedLoaderMinutes ?? (loaderRequired ? 60 : 0);
  const actualLoaderMinutes = input.actualLoaderMinutes ?? estimatedLoaderMinutes;
  const billableLoaderMinutes = loaderRequired ? Math.ceil(actualLoaderMinutes / (input.billingIncrementMinutes ?? 15)) * (input.billingIncrementMinutes ?? 15) : 0;
  const driverDeductionsCzk = input.driverDeductionsCzk ?? 0;
  const refundAllocation = input.refundAllocation ?? 'custom';
  const transportRefundCzk = input.transportRefundCzk ?? 0;
  const loaderRefundCzk = input.loaderRefundCzk ?? 0;
  const platformFeeRefundCzk = input.platformFeeRefundCzk ?? 0;
  const platformCompensationCzk = input.platformCompensationCzk ?? 0;
  const customPlatformRefundCzk = input.customPlatformRefundCzk ?? 0;
  const customDriverRefundCzk = input.customDriverRefundCzk ?? 0;
  const customLoaderRefundCzk = input.customLoaderRefundCzk ?? 0;
  assertNonNegative({
    transportChargeCzk: input.transportChargeCzk, loaderChargeCzk: input.loaderChargeCzk,
    additionalChargesCzk: input.additionalChargesCzk, discountCzk: input.discountCzk,
    stripeProcessingFeeCzk: input.stripeProcessingFeeCzk, driverDeductionsCzk,
    transportRefundCzk, loaderRefundCzk, platformFeeRefundCzk, platformCompensationCzk,
    customPlatformRefundCzk, customDriverRefundCzk, customLoaderRefundCzk,
  });
  if (input.platformCommissionRate < 0 || input.platformCommissionRate > 100) throw new Error('Commission rate must be between 0 and 100');
  if (input.loaderMode === 'none' && input.loaderChargeCzk !== 0) throw new Error('Loader charge requires a loader');
  if (!loaderRequired && (loaderCount !== 0 || input.loaderMode !== 'none')) throw new Error('Loader fields are inconsistent');
  if (loaderRequired && loaderCount === 0) throw new Error('Loader count is required');
  if (transportRefundCzk > input.transportChargeCzk) throw new Error('Transport refund cannot exceed transport charge');
  if (loaderRefundCzk > input.loaderChargeCzk) throw new Error('Loader refund cannot exceed loader charge');

  const subtotal = money(input.transportChargeCzk + input.loaderChargeCzk + input.additionalChargesCzk);
  if (input.discountCzk > subtotal) throw new Error('Discount cannot exceed subtotal');
  const customerTotalCzk = money(subtotal - input.discountCzk);
  const refundCzk = money(transportRefundCzk + loaderRefundCzk + platformFeeRefundCzk + platformCompensationCzk);
  if (refundCzk > customerTotalCzk) throw new Error('Refund cannot exceed customer total');

  let additionalLoaderEarningsCzk = 0;
  if (input.loaderMode === 'additional') {
    const hours = input.additionalLoaderHours ?? 0;
    const hourlyRate = input.additionalLoaderHourlyRateCzk ?? 0;
    assertNonNegative({ additionalLoaderHours: hours, additionalLoaderHourlyRateCzk: hourlyRate });
    additionalLoaderEarningsCzk = money(hours * hourlyRate);
    if (additionalLoaderEarningsCzk !== money(input.loaderChargeCzk)) throw new Error('Additional loader hours and rate must match loader charge');
  }

  const baseTransportCommission = calculatePlatformCommission(input.transportChargeCzk, input.platformCommissionRate);
  const baseLoaderCommission = calculatePlatformCommission(input.loaderChargeCzk, input.platformCommissionRate);
  let platformTransportCommissionCzk = baseTransportCommission;
  let platformLoaderCommissionCzk = baseLoaderCommission;
  let driverTransportEarningsCzk = money(input.transportChargeCzk - baseTransportCommission);
  let driverLoaderEarningsCzk = input.loaderMode === 'driver' ? money(input.loaderChargeCzk - baseLoaderCommission) : 0;
  let additionalLoaderPayoutCzk = input.loaderMode === 'additional' ? money(input.loaderChargeCzk - baseLoaderCommission) : 0;
  let platformRefundBurdenCzk = 0;

  if (refundAllocation === 'full_order') {
    if (refundCzk !== customerTotalCzk) throw new Error('Full order refund must equal customer total');
    platformTransportCommissionCzk = 0;
    platformLoaderCommissionCzk = 0;
    driverTransportEarningsCzk = 0;
    driverLoaderEarningsCzk = 0;
    additionalLoaderPayoutCzk = 0;
  } else if (refundAllocation === 'transport') {
    if (refundCzk !== transportRefundCzk) throw new Error('Transport refund may only contain transport refund');
    const commissionRefund = calculatePlatformCommission(transportRefundCzk, input.platformCommissionRate);
    platformTransportCommissionCzk = money(baseTransportCommission - commissionRefund);
    driverTransportEarningsCzk = money(driverTransportEarningsCzk - (transportRefundCzk - commissionRefund));
  } else if (refundAllocation === 'loader') {
    if (refundCzk !== loaderRefundCzk) throw new Error('Loader refund may only contain loader refund');
    const commissionRefund = calculatePlatformCommission(loaderRefundCzk, input.platformCommissionRate);
    platformLoaderCommissionCzk = money(baseLoaderCommission - commissionRefund);
    const payoutRefund = money(loaderRefundCzk - commissionRefund);
    if (input.loaderMode === 'driver') driverLoaderEarningsCzk = money(driverLoaderEarningsCzk - payoutRefund);
    if (input.loaderMode === 'additional') additionalLoaderPayoutCzk = money(additionalLoaderPayoutCzk - payoutRefund);
  } else if (refundAllocation === 'platform_fee') {
    if (refundCzk !== platformFeeRefundCzk) throw new Error('Platform fee refund may only contain platform fee refund');
    platformRefundBurdenCzk = platformFeeRefundCzk;
  } else if (refundAllocation === 'platform_compensation') {
    if (refundCzk !== platformCompensationCzk) throw new Error('Platform compensation may only contain platform compensation');
    platformRefundBurdenCzk = platformCompensationCzk;
  } else {
    const customTotal = money(customPlatformRefundCzk + customDriverRefundCzk + customLoaderRefundCzk);
    if (customTotal !== refundCzk) throw new Error('Custom allocation must equal total refund');
    platformRefundBurdenCzk = customPlatformRefundCzk;
    driverTransportEarningsCzk = money(Math.max(0, driverTransportEarningsCzk - customDriverRefundCzk));
    if (input.loaderMode === 'driver') driverLoaderEarningsCzk = money(Math.max(0, driverLoaderEarningsCzk - customLoaderRefundCzk));
    if (input.loaderMode === 'additional') additionalLoaderPayoutCzk = money(Math.max(0, additionalLoaderPayoutCzk - customLoaderRefundCzk));
  }

  const platformTotalCommissionCzk = money(platformTransportCommissionCzk + platformLoaderCommissionCzk);
  const grossPlatformCommissionCzk = refundAllocation === 'full_order'
    ? 0
    : money(platformTotalCommissionCzk + input.additionalChargesCzk - input.discountCzk + driverDeductionsCzk);
  const driverPayoutCzk = calculateDriverPayout(driverTransportEarningsCzk, driverLoaderEarningsCzk, driverDeductionsCzk);
  const netPlatformRevenueCzk = money(grossPlatformCommissionCzk - platformRefundBurdenCzk - input.stripeProcessingFeeCzk);
  const finalCollectedCzk = money(customerTotalCzk - refundCzk);
  const distributed = money(netPlatformRevenueCzk + input.stripeProcessingFeeCzk + driverPayoutCzk + additionalLoaderPayoutCzk);
  if (distributed !== finalCollectedCzk) throw new Error('Financial distribution does not match final collected amount');

  return {
    ...input,
    refundAllocation, refundReason: input.refundReason ?? 'No refund',
    transportRefundCzk, loaderRefundCzk, platformFeeRefundCzk, platformCompensationCzk,
    customPlatformRefundCzk, customDriverRefundCzk, customLoaderRefundCzk, refundCzk,
    customerTotalCzk, finalCollectedCzk,
    platformTransportCommissionCzk, platformLoaderCommissionCzk, platformTotalCommissionCzk,
    grossPlatformCommissionCzk, netPlatformRevenueCzk, platformProfitLossCzk: netPlatformRevenueCzk,
    driverTransportEarningsCzk, driverLoaderEarningsCzk, driverPayoutCzk,
    additionalLoaderEarningsCzk, additionalLoaderPayoutCzk, driverDeductionsCzk,
    loaderRequired, loaderCount, loaderHourlyRateCzk, estimatedLoaderMinutes, actualLoaderMinutes, billableLoaderMinutes,
  };
}
