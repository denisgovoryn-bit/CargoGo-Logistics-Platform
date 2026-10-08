import { calculateLoaderCharge, calculateMobileOrderFinancials, pricingConfig, type LoaderCount, type LoaderMode } from '@/lib/orderPricing';
type MockOrderInput = { id: string; pickup: string; delivery: string; distance: string; vehicle: keyof typeof pricingConfig.transportPricesCzk; cargo: string; loaderCount: LoaderCount; loaderMode: LoaderMode; estimatedLoaderMinutes: number };
const inputs: MockOrderInput[] = [
  { id: 'CG-1042', pickup: 'Karlín, Prague 8', delivery: 'Smíchov, Prague 5', distance: '9.2 km', vehicle: 'Small Van', cargo: 'Desk, chair and 4 boxes', loaderCount: 1, loaderMode: 'driver', estimatedLoaderMinutes: 61 },
  { id: 'CG-1043', pickup: 'Žižkov, Prague 3', delivery: 'Dejvice, Prague 6', distance: '11.8 km', vehicle: 'Large Van', cargo: 'Two wardrobes', loaderCount: 2, loaderMode: 'additional', estimatedLoaderMinutes: 90 },
  { id: 'CG-1044', pickup: 'Holešovice, Prague 7', delivery: 'Nusle, Prague 4', distance: '8.6 km', vehicle: 'Truck', cargo: 'Restaurant equipment', loaderCount: 0, loaderMode: 'none', estimatedLoaderMinutes: 0 },
];
export const availableOrders = inputs.map((order) => {
  const loader = calculateLoaderCharge(order.estimatedLoaderMinutes, order.loaderCount);
  const finance = calculateMobileOrderFinancials(pricingConfig.transportPricesCzk[order.vehicle], loader.chargeCzk, order.loaderMode);
  return { ...order, loaderRequired: order.loaderCount > 0, loaderHourlyRateCzk: pricingConfig.loaderHourlyRatePerPersonCzk, billableLoaderMinutes: loader.billableMinutes, loaderChargeCzk: loader.chargeCzk, ...finance };
});
export const completedDriverOrders = [{ id: 'CG-1038', route: 'Vinohrady → Karlín', amount: 580 }, { id: 'CG-1039', route: 'Smíchov → Dejvice', amount: 760 }, { id: 'CG-1040', route: 'Nusle → Holešovice', amount: 690 }];
