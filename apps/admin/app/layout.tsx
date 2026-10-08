import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminShell } from '@/components/admin-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'CargoGo Prague Admin',
  description: 'Local operations dashboard prototype',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><AdminShell>{children}</AdminShell></body></html>;
}
