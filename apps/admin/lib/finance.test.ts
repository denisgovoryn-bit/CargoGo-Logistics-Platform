import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateOrderFinancials } from './finance.ts';

const base = {
  transportChargeCzk: 1000,
  loaderChargeCzk: 0,
  additionalChargesCzk: 0,
  discountCzk: 0,
  platformCommissionRate: 15,
  stripeProcessingFeeCzk: 30,
  loaderMode: 'none' as const,
};

test('full order refund before service zeroes payouts and revenue', () => {
  const result = calculateOrderFinancials({ ...base, refundAllocation: 'full_order', transportRefundCzk: 1000 });
  assert.equal(result.finalCollectedCzk, 0);
  assert.equal(result.driverPayoutCzk, 0);
  assert.equal(result.additionalLoaderPayoutCzk, 0);
  assert.equal(result.netPlatformRevenueCzk, -30);
});

test('transport-only refund reduces transport earnings and commission only', () => {
  const result = calculateOrderFinancials({ ...base, loaderChargeCzk: 200, loaderMode: 'driver', refundAllocation: 'transport', transportRefundCzk: 200 });
  assert.equal(result.driverTransportEarningsCzk, 680);
  assert.equal(result.platformTransportCommissionCzk, 120);
  assert.equal(result.driverLoaderEarningsCzk, 170);
  assert.equal(result.platformLoaderCommissionCzk, 30);
});

test('loader-only refund reduces driver loader earnings but not transport', () => {
  const result = calculateOrderFinancials({ ...base, loaderChargeCzk: 300, loaderMode: 'driver', refundAllocation: 'loader', loaderRefundCzk: 100 });
  assert.equal(result.driverTransportEarningsCzk, 850);
  assert.equal(result.driverLoaderEarningsCzk, 170);
  assert.equal(result.platformLoaderCommissionCzk, 30);
});

test('loader-only refund reduces additional loader payout but not driver transport', () => {
  const result = calculateOrderFinancials({ ...base, loaderChargeCzk: 300, loaderMode: 'additional', additionalLoaderHours: 2, additionalLoaderHourlyRateCzk: 150, refundAllocation: 'loader', loaderRefundCzk: 100 });
  assert.equal(result.driverTransportEarningsCzk, 850);
  assert.equal(result.driverLoaderEarningsCzk, 0);
  assert.equal(result.additionalLoaderPayoutCzk, 170);
});

test('platform fee refund is borne only by platform', () => {
  const regular = calculateOrderFinancials(base);
  const refunded = calculateOrderFinancials({ ...base, refundAllocation: 'platform_fee', platformFeeRefundCzk: 50 });
  assert.equal(refunded.driverPayoutCzk, regular.driverPayoutCzk);
  assert.equal(refunded.netPlatformRevenueCzk, regular.netPlatformRevenueCzk - 50);
});

test('platform compensation does not reduce driver payout', () => {
  const regular = calculateOrderFinancials(base);
  const compensated = calculateOrderFinancials({ ...base, refundAllocation: 'platform_compensation', platformCompensationCzk: 100 });
  assert.equal(compensated.driverPayoutCzk, regular.driverPayoutCzk);
  assert.equal(compensated.netPlatformRevenueCzk, regular.netPlatformRevenueCzk - 100);
});

test('custom allocation must equal total refund', () => {
  assert.throws(() => calculateOrderFinancials({ ...base, refundAllocation: 'custom', platformFeeRefundCzk: 100, customPlatformRefundCzk: 40, customDriverRefundCzk: 30 }), /must equal total refund/);
  const result = calculateOrderFinancials({ ...base, refundAllocation: 'custom', platformFeeRefundCzk: 100, customPlatformRefundCzk: 40, customDriverRefundCzk: 60 });
  assert.equal(result.refundCzk, 100);
});

test('Stripe fee is excluded from driver and loader payouts', () => {
  const withoutFee = calculateOrderFinancials({ ...base, loaderChargeCzk: 200, loaderMode: 'driver', stripeProcessingFeeCzk: 0 });
  const withFee = calculateOrderFinancials({ ...base, loaderChargeCzk: 200, loaderMode: 'driver', stripeProcessingFeeCzk: 75 });
  assert.equal(withFee.driverPayoutCzk, withoutFee.driverPayoutCzk);
  assert.equal(withFee.driverLoaderEarningsCzk, withoutFee.driverLoaderEarningsCzk);
});

test('financial invariant remains balanced for refund types', () => {
  const scenarios = [
    calculateOrderFinancials({ ...base, refundAllocation: 'transport', transportRefundCzk: 200 }),
    calculateOrderFinancials({ ...base, loaderChargeCzk: 200, loaderMode: 'driver', refundAllocation: 'loader', loaderRefundCzk: 50 }),
    calculateOrderFinancials({ ...base, refundAllocation: 'platform_compensation', platformCompensationCzk: 80 }),
  ];
  for (const result of scenarios) {
    assert.equal(result.finalCollectedCzk, result.netPlatformRevenueCzk + result.stripeProcessingFeeCzk + result.driverPayoutCzk + result.additionalLoaderPayoutCzk);
  }
});

test('fully refunded order may create a platform loss from Stripe fee', () => {
  const result = calculateOrderFinancials({ ...base, stripeProcessingFeeCzk: 42, refundAllocation: 'full_order', transportRefundCzk: 1000 });
  assert.equal(result.platformProfitLossCzk, -42);
  assert.equal(result.finalCollectedCzk, 0);
});
