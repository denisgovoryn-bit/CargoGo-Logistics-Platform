'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PageHeader, StatusBadge } from '@/components/admin-shell';
import { financialOrders, formatCzk } from '@/lib/finance-mock-data';
import { orders, type AdminOrderStatus } from '@/lib/mock-data';
const statuses: AdminOrderStatus[] = ['New', 'Assigned', 'In progress', 'Completed', 'Cancelled'];
export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>(); const order = useMemo(() => orders.find((item) => item.id === id) ?? orders[0], [id]);
  const [status, setStatus] = useState<AdminOrderStatus>(order.status); const [price, setPrice] = useState(String(order.price)); const [driver, setDriver] = useState(order.driver);
  const financial = financialOrders.find((item) => item.id === order.id) ?? financialOrders[1];
  const item = (label: string, value: string | number) => <div><dt>{label}</dt><dd>{value}</dd></div>;
  return <><PageHeader title={`Order ${order.id}`} description="Local controls update this page only." /><Link className="text-link back-link" href="/orders">← Back to orders</Link><div className="details-grid">
    <section className="panel"><div className="panel-heading"><h2>Order details</h2><StatusBadge status={status} /></div><dl className="details-list">{item('Customer', order.customer)}{item('Driver', driver)}{item('Route', order.route)}{item('Distance', order.distance)}{item('Vehicle', order.vehicle)}{item('Cargo', order.cargo)}</dl></section>
    <section className="panel"><h2>Loader and financial details</h2><dl className="details-list">{item('Loader required', financial.loaderRequired ? 'Yes' : 'No')}{item('Loader count', financial.loaderCount)}{item('Loader mode', financial.loaderMode)}{item('Loader actual time', `${financial.actualLoaderMinutes} min`)}{item('Loader billable time', `${financial.billableLoaderMinutes} min`)}{item('Loader charge', formatCzk(financial.loaderChargeCzk))}{item('Platform transport commission', formatCzk(financial.platformTransportCommissionCzk))}{item('Platform loader commission', formatCzk(financial.platformLoaderCommissionCzk))}{item('Total platform commission', formatCzk(financial.platformTotalCommissionCzk))}{item('Driver payout', formatCzk(financial.driverPayoutCzk))}{item('Additional loader payout', formatCzk(financial.additionalLoaderPayoutCzk))}</dl></section>
    <section className="panel form-panel"><h2>Manage order</h2><label>Assign driver<select value={driver} onChange={(event) => setDriver(event.target.value)}><option>Unassigned</option><option>Petr Novák</option><option>Tomáš Dvořák</option><option>Marek Svoboda</option></select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as AdminOrderStatus)}>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label><label>Final price (CZK)<input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} /></label><button type="button">Save local changes</button><button className="danger-button" type="button" onClick={() => setStatus('Cancelled')}>Cancel order</button></section>
  </div></>;
}
