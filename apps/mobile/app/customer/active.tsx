import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppButton, Card, LabelValue, Screen, textStyles } from '@/components/ui';
import { useApp, type OrderStatus } from '@/context/AppContext';
import { calculateLoaderCharge } from '@/lib/orderPricing';
import { colors } from '@/lib/theme';
const statusSteps: OrderStatus[] = ['Driver assigned', 'Driving to pickup', 'Arrived', 'Delivering'];
export default function ActiveOrderScreen() {
  const { t } = useTranslation(); const { orderStatus, setOrderStatus, cargo, updateCargo } = useApp();
  const index = statusSteps.indexOf(orderStatus); const loader = calculateLoaderCharge(cargo.actualLoaderMinutes, cargo.loaderCount);
  const advance = () => index === statusSteps.length - 1 ? router.replace('/customer/completed') : setOrderStatus(statusSteps[index + 1]);
  return <Screen title={t('activeOrder')} subtitle={orderStatus}>
    <View style={styles.map}><Text style={textStyles.muted}>{t('liveMap')}</Text><Text style={styles.route}>Pickup ••• Driver ••• Delivery</Text></View>
    <Card><LabelValue label={t('driver')} value="Petr Novák" /><LabelValue label={t('rating')} value="4.9 ★" /><LabelValue label={t('vehicle')} value="White Ford Transit" /><LabelValue label={t('registration')} value="8AB 2468" /></Card>
    {cargo.loaderRequired ? <Card><LabelValue label={t('paidTimeStarted')} value="10:15 (mock)" /><LabelValue label={t('currentDuration')} value={t('minutes', { value: cargo.actualLoaderMinutes })} /><LabelValue label={t('currentCharge')} value={`${loader.chargeCzk} CZK`} /><LabelValue label={t('numberOfLoaders')} value={String(cargo.loaderCount)} /><View style={styles.buttons}><AppButton label={t('add15')} variant="secondary" onPress={() => updateCargo({ actualLoaderMinutes: cargo.actualLoaderMinutes + 15 })} /><AppButton label={t('add30')} variant="secondary" onPress={() => updateCargo({ actualLoaderMinutes: cargo.actualLoaderMinutes + 30 })} /></View></Card> : null}
    <AppButton label={t('callDriver')} variant="secondary" onPress={() => undefined} /><AppButton label={index === statusSteps.length - 1 ? t('completeDelivery') : t('nextStatus', { status: statusSteps[index + 1] })} onPress={advance} /><AppButton label={t('cancelOrder')} variant="danger" onPress={() => router.replace('/customer/home')} />
  </Screen>;
}
const styles = StyleSheet.create({ map: { alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: 18, height: 190, justifyContent: 'center', padding: 20 }, route: { color: colors.accent, fontSize: 14, fontWeight: '700', marginTop: 14 }, buttons: { gap: 8 } });
