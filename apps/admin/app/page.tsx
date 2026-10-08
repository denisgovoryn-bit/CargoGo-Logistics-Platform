import Link from 'next/link';

import { PageHeader, StatusBadge } from '@/components/admin-shell';
import { orders } from '@/lib/mock-data';

const metrics = [
  ['New Orders', '12', '+3 this hour'],
  ['Active Orders', '8', '6 drivers assigned'],
  ['Completed Today', '34', '+12% vs yesterday'],
  ['Drivers Online', '21', 'of 36 approved'],
  ['Revenue Today', '42,680 CZK', 'Gross bookings'],
  ['Platform Commission Today', '6,402 CZK', '15% average'],
  ['Driver Earnings Today', '31,478 CZK', 'Transport and loading'],
  ['Loader Earnings Today', '2,340 CZK', 'Driver and helper work'],
  ['Pending Driver Payouts', '8,920 CZK', '4 payouts'],
  ['Pending Loader Payouts', '1,020 CZK', '2 payouts'],
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Today’s CargoGo operations at a glance." />
      <section className="metric-grid">{metrics.map(([label, value, note]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</section>
      <section className="finance-cta panel"><div><h2>Finance overview</h2><p>Review revenue, commissions, driver payouts and loader payouts.</p></div><Link className="export-button" href="/finance">View Finance</Link></section>
      <section className="panel">
        <div className="panel-heading"><div><h2>Recent orders</h2><p>Latest activity across Prague</p></div><Link className="text-link" href="/orders">View all</Link></div>
        <div className="table-wrap"><table><thead><tr><th>Order</th><th>Route</th><th>Driver</th><th>Price</th><th>Status</th></tr></thead><tbody>{orders.slice(0, 3).map((order) => <tr key={order.id}><td><Link className="order-link" href={`/orders/${order.id}`}>{order.id}</Link></td><td>{order.route}</td><td>{order.driver}</td><td>{order.price.toLocaleString()} CZK</td><td><StatusBadge status={order.status} /></td></tr>)}</tbody></table></div>
      </section>
    </>
  );
}
