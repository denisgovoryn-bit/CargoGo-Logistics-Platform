import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateLoaderCharge, calculateMobileOrderFinancials } from './orderPricing.ts';

test('loader disabled is zero', () => assert.deepEqual(calculateLoaderCharge(90, 0), { billableMinutes: 0, chargeCzk: 0 }));
test('one loader for 60 minutes', () => assert.deepEqual(calculateLoaderCharge(60, 1), { billableMinutes: 60, chargeCzk: 300 }));
test('61 minutes rounds to 75', () => assert.deepEqual(calculateLoaderCharge(61, 1), { billableMinutes: 75, chargeCzk: 375 }));
test('two loaders for 90 minutes', () => assert.deepEqual(calculateLoaderCharge(90, 2), { billableMinutes: 90, chargeCzk: 900 }));
test('commission applies to transport', () => assert.equal(calculateMobileOrderFinancials(1000, 0, 'none').platformTransportCommissionCzk, 150));
test('commission applies to loaders', () => assert.equal(calculateMobileOrderFinancials(1000, 300, 'driver').platformLoaderCommissionCzk, 45));
test('driver loader earnings stay with driver', () => assert.equal(calculateMobileOrderFinancials(1000, 300, 'driver').driverPayoutCzk, 1105));
test('additional loader payout is separate', () => { const value = calculateMobileOrderFinancials(1000, 300, 'additional'); assert.equal(value.driverPayoutCzk, 850); assert.equal(value.additionalLoaderPayoutCzk, 255); });
test('customer total equals service components', () => assert.equal(calculateMobileOrderFinancials(790, 375, 'driver').customerTotalCzk, 1165));
test('commission is counted exactly once', () => { const value = calculateMobileOrderFinancials(1000, 300, 'driver'); assert.equal(value.platformTotalCommissionCzk + value.driverPayoutCzk + value.additionalLoaderPayoutCzk, value.customerTotalCzk); });
