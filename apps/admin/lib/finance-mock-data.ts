import { calculateOrderFinancials, type OrderFinancialInput, type PaymentStatus, type PayoutStatus } from './finance';

export type FinancialOrder = ReturnType<typeof calculateOrderFinancials> & {
  id: string;
  date: string;
  customer: string;
  driver: string;
  route: string;
  paymentStatus: PaymentStatus;
  payoutStatus: PayoutStatus;
  orderStatus: 'Completed' | 'Cancelled';
  additionalLoaderName?: string;
};

type OrderMeta = Omit<FinancialOrder, keyof ReturnType<typeof calculateOrderFinancials>>;
const order = (meta: OrderMeta, input: OrderFinancialInput): FinancialOrder => ({ ...meta, ...calculateOrderFinancials(input) });

export const financialOrders: FinancialOrder[] = [
  order(
    { id: 'CG-1044', date: '2026-08-02', customer: 'Eva P.', driver: 'Petr Novák', route: 'Karlín → Smíchov', paymentStatus: 'refunded', payoutStatus: 'not_scheduled', orderStatus: 'Cancelled' },
    { transportChargeCzk: 800, loaderChargeCzk: 0, additionalChargesCzk: 0, discountCzk: 0, platformCommissionRate: 15, stripeProcessingFeeCzk: 24, loaderMode: 'none', loaderRequired: false, loaderCount: 0, loaderHourlyRateCzk: 300, estimatedLoaderMinutes: 0, actualLoaderMinutes: 0, refundAllocation: 'full_order', refundReason: 'Cancelled before driver departure', transportRefundCzk: 800 },
  ),
  order(
    { id: 'CG-1043', date: '2026-08-02', customer: 'David R.', driver: 'Petr Novák', route: 'Žižkov → Dejvice', paymentStatus: 'partially_refunded', payoutStatus: 'pending', orderStatus: 'Completed' },
    { transportChargeCzk: 1200, loaderChargeCzk: 300, additionalChargesCzk: 0, discountCzk: 0, platformCommissionRate: 15, stripeProcessingFeeCzk: 40, loaderMode: 'driver', loaderRequired: true, loaderCount: 1, loaderHourlyRateCzk: 300, estimatedLoaderMinutes: 60, actualLoaderMinutes: 60, refundAllocation: 'loader', refundReason: 'Loading service partially incomplete', loaderRefundCzk: 120 },
  ),
  order(
    { id: 'CG-1042', date: '2026-08-01', customer: 'Anna K.', driver: 'Marek Svoboda', route: 'Holešovice → Nusle', paymentStatus: 'partially_refunded', payoutStatus: 'paid', orderStatus: 'Completed', additionalLoaderName: 'Martin K.' },
    { transportChargeCzk: 1500, loaderChargeCzk: 400, additionalChargesCzk: 150, discountCzk: 0, platformCommissionRate: 15, stripeProcessingFeeCzk: 52, loaderMode: 'additional', loaderRequired: true, loaderCount: 1, loaderHourlyRateCzk: 200, estimatedLoaderMinutes: 120, actualLoaderMinutes: 120, additionalLoaderHours: 2, additionalLoaderHourlyRateCzk: 200, refundAllocation: 'platform_compensation', refundReason: 'Late arrival goodwill compensation', platformCompensationCzk: 150 },
  ),
  order(
    { id: 'CG-1041', date: '2026-07-30', customer: 'Lucie M.', driver: 'Tomáš Dvořák', route: 'Vinohrady → Dejvice', paymentStatus: 'partially_refunded', payoutStatus: 'held', orderStatus: 'Completed' },
    { transportChargeCzk: 1000, loaderChargeCzk: 0, additionalChargesCzk: 80, discountCzk: 0, platformCommissionRate: 15, stripeProcessingFeeCzk: 31, loaderMode: 'none', loaderRequired: false, loaderCount: 0, loaderHourlyRateCzk: 300, estimatedLoaderMinutes: 0, actualLoaderMinutes: 0, refundAllocation: 'transport', refundReason: 'Route significantly shorter than estimate', transportRefundCzk: 200 },
  ),
  order(
    { id: 'CG-1040', date: '2026-07-28', customer: 'Jan S.', driver: 'Marek Svoboda', route: 'Smíchov → Dejvice', paymentStatus: 'paid', payoutStatus: 'paid', orderStatus: 'Completed' },
    { transportChargeCzk: 1400, loaderChargeCzk: 0, additionalChargesCzk: 100, discountCzk: 50, platformCommissionRate: 15, stripeProcessingFeeCzk: 38, loaderMode: 'none', loaderRequired: false, loaderCount: 0, loaderHourlyRateCzk: 300, estimatedLoaderMinutes: 0, actualLoaderMinutes: 0 },
  ),
];

export const formatCzk = (value: number) => `${value.toLocaleString('en-CZ')} CZK`;
export const formatStatus = (value: string) => value.split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
