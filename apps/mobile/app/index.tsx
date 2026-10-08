import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppButton, Card, Screen, textStyles } from '@/components/ui';
import { useApp, type Role } from '@/context/AppContext';
import { LanguagePicker } from '@/components/LanguagePicker';

export default function RoleSelectionScreen() {
  const { setRole } = useApp();
  const { t } = useTranslation();

  const selectRole = (role: Exclude<Role, null>) => {
    setRole(role);
    router.replace(role === 'customer' ? '/customer/home' : '/driver/home');
  };

  return (
    <Screen title="CargoGo Prague" subtitle={t('roleSubtitle')}>
      <LanguagePicker />
      <Text style={styles.prompt}>{t('rolePrompt')}</Text>
      <Card>
        <Text style={textStyles.heading}>{t('customer')}</Text>
        <Text style={textStyles.muted}>{t('customerHint')}</Text>
        <AppButton label={t('continueCustomer')} onPress={() => selectRole('customer')} />
      </Card>
      <Card>
        <Text style={textStyles.heading}>{t('driver')}</Text>
        <Text style={textStyles.muted}>{t('driverHint')}</Text>
        <AppButton label={t('continueDriver')} onPress={() => selectRole('driver')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ prompt: { ...textStyles.body, fontWeight: '600', marginTop: 18 } });
