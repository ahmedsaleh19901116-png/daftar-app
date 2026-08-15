import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, ScreenHeader } from '../components';
import { IconPlus, IconWallet } from '../components/Icons';
import { useStoreState } from '../data/store';
import { totalBalance, useFmt } from '../data/selectors';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

export function WidgetSetupScreen({ navigation }: RootScreenProps<'WidgetSetup'>) {
  const state = useStoreState();
  const { colors } = useTheme();
  const fmt = useFmt(state);
  const [added, setAdded] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="ويدجت الشاشة الرئيسية" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0 }}>
        <AppText size={13} opacity={0.65} style={{ textAlign: 'right', marginBottom: 22, lineHeight: 22 }}>
          أضف الويدجت لشاشة هاتفك الرئيسية لتسجيل مصروف بنقرة واحدة، بدون فتح التطبيق — أقل من 3 ثوانٍ.
        </AppText>

        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <View style={{ width: 220, borderRadius: 24, backgroundColor: colors.text, padding: 16 }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 14, gap: 10 }}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                <AppText weight="bold" size={14}>دفتر</AppText>
                <AppText size={11} opacity={0.5}>الرصيد {fmt(totalBalance(state))}</AppText>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1, borderRadius: 12, backgroundColor: colors.accent, paddingVertical: 10, alignItems: 'center', gap: 4 }}>
                  <IconPlus size={16} color="#ffffff" />
                  <AppText size={11} color="#ffffff">مصروف</AppText>
                </View>
                <View style={{ flex: 1, borderRadius: 12, borderWidth: 1, borderColor: colors.divider, paddingVertical: 10, alignItems: 'center', gap: 4 }}>
                  <IconWallet size={16} color={colors.text} />
                  <AppText size={11}>دخل</AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Card style={{ marginBottom: 16 }}>
          <AppText weight="bold" size={14} style={{ marginBottom: 8, textAlign: 'right' }}>طريقة الإضافة</AppText>
          <AppText size={12} opacity={0.75} style={{ textAlign: 'right', lineHeight: 22 }}>
            اضغط مطولاً على الشاشة الرئيسية ← ويدجت ← ابحث عن "دفتر" ← اسحبه لمكانه. اختر حجم 2×2 للاختصار السريع، أو
            4×2 لعرض الرصيد كذلك.
          </AppText>
        </Card>

        <Button label={added ? 'أُضيف ✓' : 'أضف الويدجت الآن'} block onPress={() => setAdded(true)} />
      </ScrollView>
    </SafeAreaView>
  );
}
