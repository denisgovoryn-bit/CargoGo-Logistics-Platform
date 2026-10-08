export type AdminOrderStatus = 'New' | 'Assigned' | 'In progress' | 'Completed' | 'Cancelled';

export const orders = [
  { id: 'CG-1042', customer: 'Anna K.', driver: 'Unassigned', route: 'Karlín → Smíchov', price: 790, status: 'New' as AdminOrderStatus, cargo: 'Desk, chair and 4 boxes', distance: '9.2 km', vehicle: 'Small Van' },
  { id: 'CG-1041', customer: 'David R.', driver: 'Petr Novák', route: 'Žižkov → Dejvice', price: 1190, status: 'In progress' as AdminOrderStatus, cargo: 'Two wardrobes', distance: '11.8 km', vehicle: 'Large Van' },
  { id: 'CG-1040', customer: 'Lucie M.', driver: 'Tomáš Dvořák', route: 'Nusle → Holešovice', price: 980, status: 'Completed' as AdminOrderStatus, cargo: 'Moving boxes', distance: '8.6 km', vehicle: 'Small Van' },
  { id: 'CG-1039', customer: 'Jan S.', driver: 'Marek Svoboda', route: 'Smíchov → Dejvice', price: 1540, status: 'Completed' as AdminOrderStatus, cargo: 'Shop equipment', distance: '12.4 km', vehicle: 'Truck' },
];

export const drivers = [
  { id: 1, name: 'Petr Novák', vehicle: 'Ford Transit · 8AB 2468', category: 'Small Van', verification: 'Approved', availability: 'Online', transportEarnings: 18420, loaderEarnings: 2140, commissionPaid: 3628, pendingPayout: 1275, paidOut: 19285, completedOrders: 27 },
  { id: 2, name: 'Tomáš Dvořák', vehicle: 'Mercedes Sprinter · 5AZ 1042', category: 'Large Van', verification: 'Pending', availability: 'Offline', transportEarnings: 12380, loaderEarnings: 980, commissionPaid: 2357, pendingPayout: 0, paidOut: 11003, completedOrders: 16 },
  { id: 3, name: 'Marek Svoboda', vehicle: 'Iveco Daily · 7AC 8821', category: 'Truck', verification: 'Approved', availability: 'Online', transportEarnings: 24760, loaderEarnings: 0, commissionPaid: 4369, pendingPayout: 1275, paidOut: 23185, completedOrders: 31 },
];
