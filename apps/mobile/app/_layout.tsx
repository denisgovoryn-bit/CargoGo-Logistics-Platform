import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '@/context/AppContext';
import '@/i18n';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerBackTitle: 'Back', headerShadowVisible: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="customer/home" options={{ headerShown: false }} />
          <Stack.Screen name="driver/home" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
