import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppButton, Field, Screen } from '@/components/ui';
import { useApp } from '@/context/AppContext';
export default function CustomerHomeScreen() { const { t } = useTranslation(); const { pickup, delivery, setPickup, setDelivery } = useApp(); return <Screen title="CargoGo Prague" subtitle={t('customerHomeSubtitle')}><Field label={t('pickupAddress')} value={pickup} onChangeText={setPickup} /><Field label={t('deliveryAddress')} value={delivery} onChangeText={setDelivery} /><AppButton label={t('useLocation')} variant="secondary" onPress={() => setPickup(t('currentLocation'))} /><AppButton label={t('continue')} disabled={!pickup.trim() || !delivery.trim()} onPress={() => router.push('/customer/vehicle')} /><AppButton label={t('settingsRole')} variant="secondary" onPress={() => router.push('/settings')} /></Screen>; }
