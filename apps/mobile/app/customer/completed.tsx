import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton, Card, Field, LabelValue, Screen, textStyles } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { calculateLoaderCharge, calculateMobileOrderFinancials, pricingConfig } from '@/lib/orderPricing';
import { colors } from '@/lib/theme';
export default function CompletedOrderScreen() {
  const { t } = useTranslation(); const { resetOrder, cargo, vehicle } = useApp(); const [rating, setRating] = useState(5); const [comment, setComment] = useState('');
  const transport = pricingConfig.transportPricesCzk[vehicle]; const loader = calculateLoaderCharge(cargo.actualLoaderMinutes, cargo.loaderCount); const finance = calculateMobileOrderFinancials(transport, loader.chargeCzk, cargo.loaderMode);
  return <Screen title={t('completedTitle')} subtitle={t('completedHint')}><Card><LabelValue label={t('transportPrice')} value={`${transport} CZK`} /><LabelValue label={t('actualTime')} value={t('minutes', { value: cargo.loaderRequired ? cargo.actualLoaderMinutes : 0 })} /><LabelValue label={t('roundedTime')} value={t('minutes', { value: loader.billableMinutes })} /><LabelValue label={t('numberOfLoaders')} value={String(cargo.loaderCount)} /><LabelValue label={t('loaderCharge')} value={`${loader.chargeCzk} CZK`} /><LabelValue label={t('platformCommission')} value={`${finance.platformTotalCommissionCzk} CZK`} /><LabelValue label={t('customerTotal')} value={`${finance.customerTotalCzk} CZK`} /><LabelValue label={t('driverIncome')} value={`${finance.driverPayoutCzk} CZK`} />{finance.additionalLoaderPayoutCzk > 0 ? <LabelValue label={t('additionalLoaderIncome')} value={`${finance.additionalLoaderPayoutCzk} CZK`} /> : null}<Text style={textStyles.price}>{t('finalPrice')}: {finance.customerTotalCzk} CZK</Text></Card><Text style={textStyles.heading}>{t('rateExperience')}</Text><View style={styles.stars}>{[1,2,3,4,5].map((value) => <Pressable key={value} onPress={() => setRating(value)}><Text style={[styles.star, value > rating && styles.inactive]}>★</Text></Pressable>)}</View><Field label={t('shortComment')} value={comment} onChangeText={setComment} multiline /><AppButton label={t('returnHome')} onPress={() => { resetOrder(); router.replace('/customer/home'); }} /></Screen>;
}
const styles = StyleSheet.create({ stars: { flexDirection: 'row', gap: 8 }, star: { color: colors.accent, fontSize: 36 }, inactive: { color: colors.border } });
