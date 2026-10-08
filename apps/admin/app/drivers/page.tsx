'use client';

import { useState } from 'react';

import { PageHeader, StatusBadge } from '@/components/admin-shell';
import { drivers as initialDrivers } from '@/lib/mock-data';

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedDriver = drivers.find((driver) => driver.id === selectedId);
  const update = (id: number, verification: string) => setDrivers((items) => items.map((driver) => driver.id === id ? { ...driver, verification } : driver));
  return (
    <>
      <PageHeader title="Drivers" description="Verification and availability controls use local state." />
      {selectedDriver ? <section className="panel"><div className="panel-heading"><div><h2>{selectedDriver.name} · Earnings</h2><p>Local financial summary</p></div><button className="small-button" onClick={() => setSelectedId(null)}>Close</button></div><div className="driver-finance-grid"><div><span>Total transport earnings</span><strong>{selectedDriver.transportEarnings.toLocaleString()} CZK</strong></div><div><span>Total loader earnings</span><strong>{selectedDriver.loaderEarnings.toLocaleString()} CZK</strong></div><div><span>Platform commission paid</span><strong>{selectedDriver.commissionPaid.toLocaleString()} CZK</strong></div><div><span>Pending payout</span><strong>{selectedDriver.pendingPayout.toLocaleString()} CZK</strong></div><div><span>Paid out</span><strong>{selectedDriver.paidOut.toLocaleString()} CZK</strong></div><div><span>Completed orders</span><strong>{selectedDriver.completedOrders}</strong></div></div></section> : null}
      <section className="panel">
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Vehicle</th><th>Category</th><th>Verification</th><th>Availability</th><th>Actions</th></tr></thead><tbody>{drivers.map((driver) => <tr key={driver.id}><td><strong>{driver.name}</strong></td><td>{driver.vehicle}</td><td>{driver.category}</td><td><StatusBadge status={driver.verification} /></td><td><StatusBadge status={driver.availability} /></td><td><div className="button-group"><button className="mini-button" onClick={() => setSelectedId(driver.id)}>Earnings</button><button className="mini-button" onClick={() => update(driver.id, 'Approved')}>Approve</button><button className="mini-button" onClick={() => update(driver.id, 'Rejected')}>Reject</button><button className="mini-button danger-text" onClick={() => update(driver.id, 'Blocked')}>Block</button></div></td></tr>)}</tbody></table></div>
      </section>
    </>
  );
}
