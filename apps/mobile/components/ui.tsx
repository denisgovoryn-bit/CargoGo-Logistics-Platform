import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/lib/theme';

export function Screen({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, selected = false }: { children: ReactNode; selected?: boolean }) {
  return <View style={[styles.card, selected && styles.cardSelected]}>{children}</View>;
}

export function AppButton({ label, onPress, variant = 'primary', disabled = false }: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={[styles.buttonText, variant !== 'primary' && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#93A09D" style={[styles.input, props.multiline && styles.multiline]} {...props} />
    </View>
  );
}

export function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.body}>{label}</Text>
      <Switch trackColor={{ false: '#CCD5D2', true: colors.accentSoft }} thumbColor={value ? colors.accent : '#FFFFFF'} value={value} onValueChange={onValueChange} />
    </View>
  );
}

export function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.labelValue}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export const textStyles = StyleSheet.create({
  body: { color: colors.text, fontSize: 16, lineHeight: 23 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  price: { color: colors.accent, fontSize: 20, fontWeight: '700' },
});

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  screen: { gap: 14, padding: 20, paddingBottom: 36 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23, marginBottom: 4 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, gap: 8, padding: 16 },
  cardSelected: { backgroundColor: colors.accentSoft, borderColor: colors.accent, borderWidth: 2 },
  button: { alignItems: 'center', borderRadius: 14, minHeight: 52, justifyContent: 'center', paddingHorizontal: 18 },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
  danger: { backgroundColor: '#FFF1F1', borderColor: '#F0CACA', borderWidth: 1 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryText: { color: colors.text },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
  fieldWrap: { gap: 7 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.text, fontSize: 16, minHeight: 50, paddingHorizontal: 14, paddingVertical: 12 },
  multiline: { minHeight: 92, textAlignVertical: 'top' },
  toggleRow: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 54, paddingHorizontal: 14 },
  body: { color: colors.text, flex: 1, fontSize: 15 },
  labelValue: { gap: 3 },
  muted: { color: colors.muted, fontSize: 13 },
  value: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
