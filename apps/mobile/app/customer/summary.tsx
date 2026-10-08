import { router } from 'expo-router';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppButton, Card, LabelValue, Screen, textStyles } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { calculateLoaderCharge, calculateMobileOrderFinancials, pricingConfig } from '@/lib/orderPricing';

export default function OrderSummaryScreen() {
  const { t } = useTranslation();
  const { pickup, delivery, vehicle, cargo } = useApp();
  const transport = pricingConfig.transportPricesCzk[vehicle];
  const loader = calculateLoaderCharge(cargo.estimatedLoaderMinutes, cargo.loaderCount);
  const finance = calculateMobileOrderFinancials(transport, loader.chargeCzk, cargo.loaderMode);
  return <Screen title={t('orderSummary')} subtitle={t('summaryHint')}>
    <Card><LabelValue label={t('pickup')} value={pickup} /><LabelValue label={t('delivery')} value={delivery} /><LabelValue label={t('vehicle')} value={vehicle} /><LabelValue label={t('cargo')} value={cargo.description || t('notSpecified')} /><LabelValue label={t('mockDistance')} value="8.4 km" /></Card>
    <Card>
      <LabelValue label={t('transportPrice')} value={`${transport} CZK`} />
      <LabelValue label={t('loaderRequiredValue')} value={t(cargo.loaderRequired ? 'yes' : 'no')} />
      {cargo.loaderRequired ? <><LabelValue label={t('numberOfLoaders')} value={String(cargo.loaderCount)} /><LabelValue label={t('hourlyRate')} value={`${pricingConfig.loaderHourlyRatePerPersonCzk} CZK / h`} /><LabelValue label={t('estimatedLoaderTime')} value={t('minutes', { value: loader.billableMinutes })} /><LabelValue label={t('loaderCharge')} value={`${loader.chargeCzk} CZK`} /></> : null}
      <LabelValue label={t('serviceFee')} value={t('includedInPrice')} />
      <Text style={textStyles.muted}>{t('estimatedTotal')}</Text><Text style={textStyles.price}>{finance.customerTotalCzk} CZK</Text>
    </Card>
    <AppButton label={t('placeOrder')} onPress={() => router.replace('/customer/searching')} />
  </Screen>;
}
