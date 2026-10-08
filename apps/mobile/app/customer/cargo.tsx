import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppButton, Card, Field, LabelValue, Screen, textStyles, ToggleRow } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { calculateLoaderCharge, estimatedLoaderMinutes, pricingConfig, type LoaderCount } from '@/lib/orderPricing';
import { colors } from '@/lib/theme';

export default function CargoDetailsScreen() {
  const { t } = useTranslation();
  const { cargo, updateCargo } = useApp();
  const loader = calculateLoaderCharge(cargo.estimatedLoaderMinutes, cargo.loaderCount);
  const toggleLoader = (enabled: boolean) => updateCargo({
    loaderRequired: enabled,
    loaderCount: enabled ? 1 : 0,
    loaderMode: enabled ? 'driver' : 'none',
    estimatedLoaderMinutes,
    actualLoaderMinutes: estimatedLoaderMinutes,
  });
  const selectCount = (loaderCount: Exclude<LoaderCount, 0>) => updateCargo({ loaderCount });

  return (
    <Screen title={t('cargoDetails')} subtitle={t('cargoHint')}>
      <Field label={t('cargoDescription')} value={cargo.description} onChangeText={(description) => updateCargo({ description })} placeholder="e.g. sofa and 6 boxes" />
      <Field label={t('weight')} value={cargo.weight} onChangeText={(weight) => updateCargo({ weight })} keyboardType="numeric" placeholder="e.g. 120" />
      <View style={styles.row}>
        <View style={styles.flex}><Field label={t('pickupFloor')} value={cargo.pickupFloor} onChangeText={(pickupFloor) => updateCargo({ pickupFloor })} keyboardType="number-pad" /></View>
        <View style={styles.flex}><Field label={t('deliveryFloor')} value={cargo.deliveryFloor} onChangeText={(deliveryFloor) => updateCargo({ deliveryFloor })} keyboardType="number-pad" /></View>
      </View>
      <ToggleRow label={t('pickupElevator')} value={cargo.pickupElevator} onValueChange={(pickupElevator) => updateCargo({ pickupElevator })} />
      <ToggleRow label={t('deliveryElevator')} value={cargo.deliveryElevator} onValueChange={(deliveryElevator) => updateCargo({ deliveryElevator })} />
      <ToggleRow label={t('driverHelp')} value={cargo.driverHelp} onValueChange={(driverHelp) => updateCargo({ driverHelp })} />

      <Card>
        <ToggleRow label={t('loaderRequired')} value={cargo.loaderRequired} onValueChange={toggleLoader} />
        {cargo.loaderRequired ? <>
          <Text style={textStyles.heading}>{t('loadersCount')}</Text>
          <View style={styles.segments}>
            {([1, 2] as const).map((count) => (
              <Pressable key={count} onPress={() => selectCount(count)} style={[styles.segment, cargo.loaderCount === count && styles.segmentSelected]}>
                <Text style={[styles.segmentText, cargo.loaderCount === count && styles.segmentTextSelected]}>{t(count === 1 ? 'oneLoader' : 'twoLoaders')}</Text>
              </Pressable>
            ))}
          </View>
          <LabelValue label={t('hourlyRate')} value={`${pricingConfig.loaderHourlyRatePerPersonCzk} CZK / h`} />
          <Text style={textStyles.muted}>{t('loaderBillingNote')}</Text>
          <View style={styles.breakdown}>
            <LabelValue label={t('arrivalTime')} value={t('minutes', { value: pricingConfig.estimatedArrivalMinutes })} />
            <LabelValue label={t('loadingTime')} value={t('minutes', { value: pricingConfig.standardLoadingMinutes })} />
            <LabelValue label={t('transportTime')} value={t('minutes', { value: pricingConfig.estimatedTransportMinutes })} />
            <LabelValue label={t('unloadingTime')} value={t('minutes', { value: pricingConfig.standardUnloadingMinutes })} />
            <LabelValue label={t('estimatedTotalTime')} value={t('minutes', { value: cargo.estimatedLoaderMinutes })} />
            <LabelValue label={t('billableTime')} value={t('minutes', { value: loader.billableMinutes })} />
          </View>
          <Text style={textStyles.price}>{t('loaderCharge')}: {loader.chargeCzk} CZK</Text>
        </> : null}
      </Card>

      <Field label={t('comment')} value={cargo.comment} onChangeText={(comment) => updateCargo({ comment })} multiline placeholder="Access details or special instructions" />
      <Card><Text style={textStyles.heading}>{t('cargoPhoto')}</Text><Text style={textStyles.muted}>{t('photoLater')}</Text><AppButton label={t('addPhoto')} variant="secondary" onPress={() => undefined} /></Card>
      <AppButton label={t('reviewOrder')} disabled={!cargo.description.trim()} onPress={() => router.push('/customer/summary')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 }, flex: { flex: 1 }, segments: { flexDirection: 'row', gap: 8 },
  segment: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, flex: 1, padding: 12 },
  segmentSelected: { backgroundColor: colors.accent, borderColor: colors.accent }, segmentText: { color: colors.text, fontWeight: '700', textAlign: 'center' }, segmentTextSelected: { color: '#fff' },
  breakdown: { borderTopColor: colors.border, borderTopWidth: 1, gap: 8, paddingTop: 10 },
});
