import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Share, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '../components';
import { IconBack } from '../components/Icons';
import { useDispatch, useStoreState } from '../data/store';
import { rowDir } from '../theme/rtl';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

const REFERRAL_CODE = 'DAFTAR-7X2K';

export function ReferralScreen({ navigation }: RootScreenProps<'Referral'>) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();

  const copyCode = async () => {
    await Clipboard.setStringAsync(REFERRAL_CODE);
    dispatch({ type: 'COPY_REFERRAL_CODE' });
  };
  const share = () => {
    Share.share({ message: 'جرّب تطبيق دفتر لإدارة مصاريفك، واستخدم كود الدعوة ' + REFERRAL_CODE });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
        >
          <IconBack size={18} color={colors.accentRamp[700]} />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#d9a441', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <AppText size={28}>👥</AppText>
          </View>
          <AppText weight="bold" size={18} style={{ textAlign: 'center', marginBottom: 4 }}>ادعُ 3 أصدقاء، اكسب شهرًا مجانيًا</AppText>
          <AppText size={13} opacity={0.65} style={{ textAlign: 'center' }}>
            لما يسجّل 3 أصدقاء بكود دعوتك، تحصل تلقائياً على شهر كامل من النسخة المدفوعة.
          </AppText>
        </View>

        <Card style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <AppText weight="bold" size={18} style={{ letterSpacing: 2 }}>{REFERRAL_CODE}</AppText>
          <Button label={state.referralCopyDone ? 'تم النسخ ✓' : 'نسخ الكود'} variant="secondary" size="md" onPress={copyCode} />
        </Card>

        <View style={{ flexDirection: rowDir('ar'), gap: 10, marginBottom: 18 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: i < state.referralCount ? colors.accent : colors.neutral[200], borderWidth: 1, borderColor: colors.divider }} />
          ))}
        </View>
        <AppText size={12} opacity={0.6} style={{ textAlign: 'center', marginBottom: 20 }}>{state.referralCount} من 3 أصدقاء سجّلوا</AppText>

        <Button label="مشاركة كود الدعوة" block onPress={share} />
      </View>
    </SafeAreaView>
  );
}
