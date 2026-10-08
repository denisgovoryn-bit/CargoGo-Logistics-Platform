import Link from 'next/link';

import { PageHeader, StatusBadge } from '@/components/admin-shell';
import { orders } from '@/lib/mock-data';

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Review and manage all transport requests." />
      <section className="panel">
        <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Driver</th><th>Route</th><th>Price</th><th>Status</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.driver}</td><td>{order.route}</td><td>{order.price.toLocaleString()} CZK</td><td><StatusBadge status={order.status} /></td><td><Link className="small-button" href={`/orders/${order.id}`}>View</Link></td></tr>)}</tbody></table></div>
      </section>
    </>
  );
}
