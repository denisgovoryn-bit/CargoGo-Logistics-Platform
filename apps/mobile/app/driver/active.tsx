import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton, Card, LabelValue, Screen } from '@/components/ui';
import { availableOrders } from '@/data/mockOrders';
import { calculateLoaderCharge, calculateMobileOrderFinancials, pricingConfig } from '@/lib/orderPricing';
const steps = ['Accepted', 'Driving to pickup', 'Arrived', 'Delivering'] as const;
export default function DriverActiveOrderScreen() {
  const { t } = useTranslation(); const [step, setStep] = useState(0); const [minutes, setMinutes] = useState(availableOrders[0].estimatedLoaderMinutes); const order = availableOrders[0];
  const loader = calculateLoaderCharge(minutes, order.loaderCount); const finance = calculateMobileOrderFinancials(pricingConfig.transportPricesCzk[order.vehicle], loader.chargeCzk, order.loaderMode);
  const labels = [t('startDriving'), t('arrived'), t('startDelivery'), t('completeOrder')]; const advance = () => step === steps.length - 1 ? router.replace('/driver/earnings') : setStep((value) => value + 1);
  return <Screen title={t('activeDelivery')} subtitle={steps[step]}><Card><LabelValue label={t('customerDetails')} value="Anna K. · +420 700 000 000" /><LabelValue label={t('pickup')} value={order.pickup} /><LabelValue label={t('delivery')} value={order.delivery} /><LabelValue label={t('cargo')} value={order.cargo} /></Card><Card><LabelValue label={t('paidTimeStarted')} value="10:15 (mock)" /><LabelValue label={t('currentDuration')} value={t('minutes', { value: minutes })} /><LabelValue label={t('currentCharge')} value={`${loader.chargeCzk} CZK`} /><LabelValue label={t('numberOfLoaders')} value={String(order.loaderCount)} /><LabelValue label={t('platformCommission')} value={`${finance.platformTotalCommissionCzk} CZK`} /><LabelValue label={t('driverIncome')} value={`${finance.driverPayoutCzk} CZK`} /><AppButton label={t('add15')} variant="secondary" onPress={() => setMinutes((value) => value + 15)} /><AppButton label={t('add30')} variant="secondary" onPress={() => setMinutes((value) => value + 30)} /></Card><AppButton label={labels[step]} onPress={advance} /></Screen>;
}
