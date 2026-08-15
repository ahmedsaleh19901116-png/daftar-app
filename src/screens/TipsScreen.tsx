import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, ScreenHeader } from '../components';
import { IconLightbulb, IconRefresh } from '../components/Icons';
import { combinedTips, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme/tokens';

export function TipsScreen({ navigation }: RootScreenProps<'Tips'>) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const fmt = useFmt(state);
  const tips = combinedTips(state, fmt);
  const idx = state.tipIndex % tips.length;
  const tip = tips[idx];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="نصائح وتقنيات مالية" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 18 }}>
        <LinearGradient colors={gradients.brand as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.hero, padding: 20 }}>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
              <IconLightbulb size={14} color="#fff" />
              <AppText color="#fff" size={11} weight="bold">بطاقة اليوم</AppText>
            </View>
            <TouchableOpacity
              onPress={() => dispatch({ type: 'SET_TIP_INDEX', index: (idx + 1) % tips.length })}
              style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}
            >
              <IconRefresh size={13} color="#fff" />
              <AppText color="#fff" size={11} weight="semiBold">تحديث</AppText>
            </TouchableOpacity>
          </View>
          <AppText color="#fff" weight="bold" size={17} style={{ textAlign: 'right', marginBottom: 8 }}>{tip.title}</AppText>
          <AppText color="#fff" opacity={0.9} size={13} style={{ textAlign: 'right', lineHeight: 21 }}>{tip.body}</AppText>
          <AppText color="#fff" opacity={0.7} size={11} style={{ textAlign: 'right', marginTop: 12 }}>{idx + 1} / {tips.length}</AppText>
        </LinearGradient>

        <View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>كل التقنيات</AppText>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, overflow: 'hidden' }}>
            {tips.map((t, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => dispatch({ type: 'SET_TIP_INDEX', index: i })}
                style={{ padding: 14, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.divider }}
              >
                <AppText weight={i === idx ? 'bold' : 'medium'} size={13} color={i === idx ? colors.accentRamp[700] : colors.text} style={{ textAlign: 'right' }}>
                  {t.title}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
