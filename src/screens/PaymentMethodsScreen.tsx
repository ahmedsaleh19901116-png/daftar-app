import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, ScreenHeader } from '../components';
import { rowDir } from '../theme/rtl';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

const PAYMENT_METHODS = [
  { short: 'GP', name: 'Google Play Billing', desc: 'الدفع عبر رصيد أو بطاقة حساب Google Play', bg: '#e8f0fe', fg: '#1a73e8' },
  { short: 'App', name: 'Apple In-App Purchase', desc: 'الدفع عبر حساب Apple ID', bg: '#f2f2f2', fg: '#000000' },
  { short: 'ZC', name: 'ZainCash', desc: 'محفظة زين كاش المحلية', bg: '#fdeaea', fg: '#c0392b' },
  { short: 'Qi', name: 'Qi Card', desc: 'بطاقة كي كارد المسبقة الدفع', bg: '#e8f6ee', fg: '#1f8a4c' },
  { short: 'FIB', name: 'First Iraqi Bank', desc: 'تحويل مباشر عبر تطبيق FIB', bg: '#eef2fb', fg: '#2d4a9e' },
];

export function PaymentMethodsScreen({ navigation }: RootScreenProps<'PaymentMethods'>) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="طرق الدفع للاشتراك" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 10 }}>
        <AppText size={13} opacity={0.65} style={{ textAlign: 'right', marginBottom: 8, lineHeight: 20 }}>
          اختر الطريقة الأنسب لك عند تفعيل النسخة المدفوعة لاحقًا. لا يوجد حالياً أي قفل على ميزات التطبيق.
        </AppText>
        {PAYMENT_METHODS.map((pm) => (
          <Card key={pm.short} style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: pm.bg, alignItems: 'center', justifyContent: 'center' }}>
              <AppText weight="extraBold" size={13} color={pm.fg}>{pm.short}</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="semiBold" size={14} style={{ textAlign: 'right' }}>{pm.name}</AppText>
              <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 2 }}>{pm.desc}</AppText>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
