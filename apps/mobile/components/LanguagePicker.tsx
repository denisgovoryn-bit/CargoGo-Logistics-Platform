import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { languages, setLanguage, type LanguageCode } from '@/i18n';
import { colors } from '@/lib/theme';

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const current = languages.find(([code]) => code === i18n.resolvedLanguage)?.[1] ?? 'English';
  const choose = async (code: LanguageCode) => { await setLanguage(code); setVisible(false); };
  return (
    <>
      <Pressable accessibilityRole="button" onPress={() => setVisible(true)} style={[styles.trigger, compact && styles.compact]}><Text style={styles.triggerText}>{t('language')}: {current}</Text></Pressable>
      <Modal animationType="slide" transparent visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}><View style={styles.sheet}><View style={styles.header}><Text style={styles.title}>{t('selectLanguage')}</Text><Pressable onPress={() => setVisible(false)}><Text style={styles.close}>{t('close')}</Text></Pressable></View><ScrollView>{languages.map(([code, label]) => <Pressable key={code} onPress={() => void choose(code)} style={[styles.option, i18n.resolvedLanguage === code && styles.selected]}><Text style={styles.optionText}>{label}</Text>{i18n.resolvedLanguage === code ? <Text style={styles.check}>✓</Text> : null}</Pressable>)}</ScrollView></View></View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, minHeight: 48, justifyContent: 'center', paddingHorizontal: 14 },
  compact: { alignSelf: 'flex-start', minHeight: 40 }, triggerText: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  overlay: { backgroundColor: 'rgba(0,0,0,.35)', flex: 1, justifyContent: 'flex-end' }, sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '82%', padding: 20 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }, title: { color: colors.text, fontSize: 21, fontWeight: '800' }, close: { color: colors.accent, fontWeight: '700' },
  option: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 50, paddingHorizontal: 8 }, selected: { backgroundColor: colors.accentSoft }, optionText: { color: colors.text, fontSize: 16 }, check: { color: colors.accent, fontSize: 18, fontWeight: '800' },
});
