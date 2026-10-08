'use client';

import { useMemo, useState } from 'react';

import { PageHeader, StatusBadge } from '@/components/admin-shell';
import { financialOrders, formatCzk, formatStatus, type FinancialOrder } from '@/lib/finance-mock-data';

type Period = 'today' | 'week' | 'month' | 'custom';

const periodLabels: { value: Period; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'This month' },
  { value: 'custom', label: 'Custom range' },
];

const toDate = (value: string) => new Date(`${value}T12:00:00`);

function FinancialDetails({ order, onClose }: { order: FinancialOrder; onClose: () => void }) {
  const row = (label: string, value: string) => <div><dt>{label}</dt><dd>{value}</dd></div>;
  const refundBearer = {
    full_order: 'All parties — service cancelled before start',
    transport: 'Driver transport earnings and transport commission',
    loader: order.loaderMode === 'driver' ? 'Driver loader earnings and loader commission' : 'Additional loader payout and loader commission',
    platform_fee: 'CargoGo platform revenue',
    platform_compensation: 'CargoGo platform revenue',
    custom: `CargoGo ${formatCzk(order.customPlatformRefundCzk)} · Driver ${formatCzk(order.customDriverRefundCzk)} · Loader ${formatCzk(order.customLoaderRefundCzk)}`,
  }[order.refundAllocation];
  return (
    <section className="finance-detail panel">
      <div className="panel-heading"><div><h2>Financial details · {order.id}</h2><p>{order.customer} · {order.route}</p></div><button className="small-button" onClick={onClose}>Close</button></div>
      <div className="finance-detail-grid">
        <article><h3>Customer payment</h3><dl className="details-list">{row('Transport price', formatCzk(order.transportChargeCzk))}{row('Loader service', formatCzk(order.loaderChargeCzk))}{row('Additional services', formatCzk(order.additionalChargesCzk))}{row('Discount', `− ${formatCzk(order.discountCzk)}`)}{row('Total', formatCzk(order.customerTotalCzk))}{row('Refund', `− ${formatCzk(order.refundCzk)}`)}{row('Final collected', formatCzk(order.finalCollectedCzk))}</dl></article>
        <article><h3>Platform</h3><dl className="details-list">{row('Commission percentage', `${order.platformCommissionRate}%`)}{row('Transport commission', formatCzk(order.platformTransportCommissionCzk))}{row('Loader commission', formatCzk(order.platformLoaderCommissionCzk))}{row('Gross platform commission', formatCzk(order.grossPlatformCommissionCzk))}{row('Stripe processing fee', `− ${formatCzk(order.stripeProcessingFeeCzk)}`)}{row('Manual adjustments', formatCzk(order.additionalChargesCzk - order.discountCzk + order.driverDeductionsCzk))}{row('Net platform revenue', formatCzk(order.netPlatformRevenueCzk))}{row('Platform profit / loss', formatCzk(order.platformProfitLossCzk))}</dl></article>
        <article><h3>Loader service</h3><dl className="details-list">{row('Loader required', order.loaderRequired ? 'Yes' : 'No')}{row('Loader count', String(order.loaderCount))}{row('Loader mode', order.loaderMode)}{row('Actual time', `${order.actualLoaderMinutes} min`)}{row('Billable time', `${order.billableLoaderMinutes} min`)}{row('Hourly rate per person', formatCzk(order.loaderHourlyRateCzk))}{row('Loader charge', formatCzk(order.loaderChargeCzk))}</dl></article>
        <article><h3>Driver</h3><dl className="details-list">{row('Transport earnings', formatCzk(order.driverTransportEarningsCzk))}{row('Loader earnings', formatCzk(order.driverLoaderEarningsCzk))}{row('Deductions', `− ${formatCzk(order.driverDeductionsCzk)}`)}{row('Final driver payout', formatCzk(order.driverPayoutCzk))}</dl></article>
        {order.loaderMode === 'additional' ? <article><h3>Additional loader</h3><dl className="details-list">{row('Loader name', order.additionalLoaderName ?? 'Mock loader')}{row('Worked time', `${order.additionalLoaderHours ?? 0} hours`)}{row('Hourly rate', formatCzk(order.additionalLoaderHourlyRateCzk ?? 0))}{row('Gross loader earnings', formatCzk(order.additionalLoaderEarningsCzk))}{row('Platform commission', formatCzk(order.platformLoaderCommissionCzk))}{row('Final loader payout', formatCzk(order.additionalLoaderPayoutCzk))}</dl></article> : null}
        <article className="refund-allocation"><h3>Refund allocation</h3><dl className="details-list">{row('Refund reason', order.refundReason)}{row('Refund type', formatStatus(order.refundAllocation))}{row('Transport refund', formatCzk(order.transportRefundCzk))}{row('Loader refund', formatCzk(order.loaderRefundCzk))}{row('Platform fee refund', formatCzk(order.platformFeeRefundCzk))}{row('Platform-funded compensation', formatCzk(order.platformCompensationCzk))}{row('Who bears the refund', refundBearer)}</dl></article>
      </div>
    </section>
  );
}

export default function FinancePage() {
  const [period, setPeriod] = useState<Period>('month');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-08-02');
  const [selectedOrder, setSelectedOrder] = useState<FinancialOrder | null>(null);

  const filteredOrders = useMemo(() => {
    const today = new Date('2026-08-02T12:00:00');
    const start = new Date(today);
    if (period === 'today') start.setHours(0, 0, 0, 0);
    if (period === 'week') start.setDate(today.getDate() - 6);
    if (period === 'month') start.setDate(1);
    const rangeStart = period === 'custom' ? toDate(startDate) : start;
    const rangeEnd = period === 'custom' ? toDate(endDate) : today;
    return financialOrders.filter((order) => {
      const date = toDate(order.date);
      return date >= rangeStart && date <= rangeEnd;
    });
  }, [endDate, period, startDate]);

  const totals = useMemo(() => filteredOrders.reduce((sum, order) => ({
    gross: sum.gross + order.customerTotalCzk,
    commission: sum.commission + order.grossPlatformCommissionCzk,
    driver: sum.driver + order.driverTransportEarningsCzk + order.driverLoaderEarningsCzk,
    loaderRevenue: sum.loaderRevenue + order.loaderChargeCzk,
    loaderEarnings: sum.loaderEarnings + order.driverLoaderEarningsCzk + order.additionalLoaderPayoutCzk,
    refunds: sum.refunds + order.refundCzk,
    stripe: sum.stripe + order.stripeProcessingFeeCzk,
    net: sum.net + order.netPlatformRevenueCzk,
    completed: sum.completed + (order.orderStatus === 'Completed' ? 1 : 0),
  }), { gross: 0, commission: 0, driver: 0, loaderRevenue: 0, loaderEarnings: 0, refunds: 0, stripe: 0, net: 0, completed: 0 }), [filteredOrders]);

  const cards = [
    ['Gross Revenue', formatCzk(totals.gross)], ['Gross Platform Commission', formatCzk(totals.commission)], ['Driver Earnings', formatCzk(totals.driver)], ['Loader Revenue', formatCzk(totals.loaderRevenue)],
    ['Loader Earnings', formatCzk(totals.loaderEarnings)], ['Stripe Processing Fees', formatCzk(totals.stripe)], ['Refunds and Compensation', formatCzk(totals.refunds)], ['Net Platform Revenue', formatCzk(totals.net)], ['Completed Orders', String(totals.completed)],
  ];

  const exportCsv = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Driver', 'Transport charge', 'Loader charge', 'Total', 'Commission', 'Driver payout', 'Loader payout', 'Refund', 'Payment status', 'Payout status'];
    const rows = filteredOrders.map((order) => [order.id, order.date, order.customer, order.driver, order.transportChargeCzk, order.loaderChargeCzk, order.customerTotalCzk, order.grossPlatformCommissionCzk, order.driverPayoutCzk, order.additionalLoaderPayoutCzk, order.refundCzk, order.paymentStatus, order.payoutStatus]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `cargogo-finance-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title="Finance" description="Revenue, commissions and payouts from local mock orders." />
      <section className="finance-toolbar panel"><div className="period-tabs">{periodLabels.map((item) => <button className={period === item.value ? 'active' : ''} key={item.value} onClick={() => setPeriod(item.value)}>{item.label}</button>)}</div>{period === 'custom' ? <div className="date-range"><label>From<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label><label>To<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label></div> : null}<button className="export-button" onClick={exportCsv}>Export CSV</button></section>
      <section className="metric-grid finance-metrics">{cards.map(([label, value]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>Selected period</small></article>)}</section>
      {selectedOrder ? <FinancialDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} /> : null}
      <section className="panel"><div className="panel-heading"><div><h2>Financial orders</h2><p>Completed and cancelled orders · {filteredOrders.length} records</p></div></div><div className="table-wrap"><table className="finance-table"><thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Driver</th><th>Route</th><th>Transport charge</th><th>Loader charge</th><th>Other charges</th><th>Total paid</th><th>Gross commission</th><th>Driver payout</th><th>Loader payout</th><th>Refund</th><th>Payment status</th><th>Payout status</th><th /></tr></thead><tbody>{filteredOrders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong><small className="cell-note">{order.orderStatus}</small></td><td>{order.date}</td><td>{order.customer}</td><td>{order.driver}</td><td>{order.route}</td><td>{formatCzk(order.transportChargeCzk)}</td><td>{formatCzk(order.loaderChargeCzk)}</td><td>{formatCzk(order.additionalChargesCzk)}</td><td><strong>{formatCzk(order.customerTotalCzk)}</strong></td><td>{formatCzk(order.grossPlatformCommissionCzk)}</td><td>{formatCzk(order.driverPayoutCzk)}</td><td>{formatCzk(order.additionalLoaderPayoutCzk)}</td><td>{formatCzk(order.refundCzk)}</td><td><StatusBadge status={formatStatus(order.paymentStatus)} /></td><td><StatusBadge status={formatStatus(order.payoutStatus)} /></td><td><button className="small-button" onClick={() => setSelectedOrder(order)}>Details</button></td></tr>)}</tbody></table></div></section>
    </>
  );
}
