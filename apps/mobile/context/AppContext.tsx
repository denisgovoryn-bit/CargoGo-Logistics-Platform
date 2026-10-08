import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import type { LoaderCount, LoaderMode } from '@/lib/orderPricing';

export type Role = 'customer' | 'driver' | null;
export type VehicleType = 'Small Van' | 'Large Van' | 'Truck';
export type OrderStatus = 'Driver assigned' | 'Driving to pickup' | 'Arrived' | 'Delivering';

type CargoDetails = {
  description: string;
  weight: string;
  pickupFloor: string;
  deliveryFloor: string;
  pickupElevator: boolean;
  deliveryElevator: boolean;
  driverHelp: boolean;
  comment: string;
  loaderRequired: boolean;
  loaderCount: LoaderCount;
  loaderMode: LoaderMode;
  estimatedLoaderMinutes: number;
  actualLoaderMinutes: number;
};

type AppState = {
  role: Role;
  pickup: string;
  delivery: string;
  vehicle: VehicleType;
  cargo: CargoDetails;
  orderStatus: OrderStatus;
  setRole: (role: Role) => void;
  setPickup: (value: string) => void;
  setDelivery: (value: string) => void;
  setVehicle: (value: VehicleType) => void;
  updateCargo: (value: Partial<CargoDetails>) => void;
  setOrderStatus: (value: OrderStatus) => void;
  resetOrder: () => void;
};

const initialCargo: CargoDetails = {
  description: '',
  weight: '',
  pickupFloor: '0',
  deliveryFloor: '0',
  pickupElevator: false,
  deliveryElevator: false,
  driverHelp: false,
  comment: '',
  loaderRequired: false,
  loaderCount: 0,
  loaderMode: 'none',
  estimatedLoaderMinutes: 105,
  actualLoaderMinutes: 105,
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [pickup, setPickup] = useState('Vinohradská 26, Prague 2');
  const [delivery, setDelivery] = useState('Dělnická 12, Prague 7');
  const [vehicle, setVehicle] = useState<VehicleType>('Small Van');
  const [cargo, setCargo] = useState<CargoDetails>(initialCargo);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Driver assigned');

  const value = useMemo<AppState>(() => ({
    role,
    pickup,
    delivery,
    vehicle,
    cargo,
    orderStatus,
    setRole,
    setPickup,
    setDelivery,
    setVehicle,
    updateCargo: (update) => setCargo((current) => ({ ...current, ...update })),
    setOrderStatus,
    resetOrder: () => {
      setCargo(initialCargo);
      setOrderStatus('Driver assigned');
    },
  }), [cargo, delivery, orderStatus, pickup, role, vehicle]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
