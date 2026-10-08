import { router } from 'expo-router';

import { AppButton, Screen } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { LanguagePicker } from '@/components/LanguagePicker';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { setRole } = useApp();
  const { t } = useTranslation();
  return (
    <Screen title={t('settings')} subtitle={t('settingsHint')}>
      <LanguagePicker />
      <AppButton label={t('changeRole')} onPress={() => { setRole(null); router.replace('/'); }} />
    </Screen>
  );
}
