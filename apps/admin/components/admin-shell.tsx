import Link from 'next/link';
import type { ReactNode } from 'react';

const navigation = [
  { href: '/', label: 'Dashboard' },
  { href: '/orders', label: 'Orders' },
  { href: '/drivers', label: 'Drivers' },
  { href: '/finance', label: 'Finance' },
  { href: '/pricing', label: 'Pricing' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div><span className="brand-mark">CG</span><strong>CargoGo Prague</strong><small>Operations</small></div>
        <nav>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="admin-user"><span className="avatar">AD</span><span><strong>Admin</strong><small>Local prototype</small></span></div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return <header className="page-header"><div><h1>{title}</h1><p>{description}</p></div><span className="prototype-badge">Mock data</span></header>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>;
}
