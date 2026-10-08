import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppButton, Card, LabelValue, Screen, textStyles, ToggleRow } from '@/components/ui';
import { availableOrders } from '@/data/mockOrders';

export default function DriverHomeScreen() {
  const [online, setOnline] = useState(true);
  const { t } = useTranslation();
  return (
    <Screen title={t('helloDriver')} subtitle={t('driverReady')}>
      <ToggleRow label={t(online ? 'online' : 'offline')} value={online} onValueChange={setOnline} />
      <View style={styles.row}>
        <Card><LabelValue label={t('todayEarnings')} value="2,030 CZK" /></Card>
        <Card><LabelValue label={t('completed')} value={`3 ${t('orders')}`} /></Card>
      </View>
      <Text style={textStyles.heading}>{t('availableOrders')}</Text>
      {online ? availableOrders.map((order) => (
        <Pressable key={order.id} onPress={() => router.push({ pathname: '/driver/order/[id]', params: { id: order.id } })}>
          <Card>
            <Text style={textStyles.heading}>{order.id} · {order.vehicle}</Text>
            <Text style={textStyles.body}>{order.pickup} → {order.delivery}</Text>
            <Text style={textStyles.muted}>{t('loaderRequiredValue')}: {t(order.loaderRequired ? 'yes' : 'no')} · {order.loaderCount} · {order.billableLoaderMinutes} min</Text>
            <Text style={textStyles.muted}>{t('platformCommission')}: {order.platformTotalCommissionCzk} CZK</Text>
            <Text style={textStyles.price}>{order.driverPayoutCzk} CZK</Text>
          </Card>
        </Pressable>
      )) : <Card><Text style={textStyles.muted}>{t('goOnline')}</Text></Card>}
      <AppButton label={t('viewEarnings')} variant="secondary" onPress={() => router.push('/driver/earnings')} />
      <AppButton label={t('settingsRole')} variant="secondary" onPress={() => router.push('/settings')} />
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: 10 }, });
