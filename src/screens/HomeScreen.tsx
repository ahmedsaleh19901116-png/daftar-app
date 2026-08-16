import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { AppText, CategoryIcon, Tag } from '../components';
import { IconEdit, IconEye, IconEyeOff, IconGear, IconLightbulb, IconRefresh, IconTrendDown, IconTrendUp } from '../components/Icons';
import { accountBalanceRows, combinedTips, expenseTotal, incomeTotal, recentTransactions, totalBalance, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { dateWithMonth, today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootStackParamList } from '../navigation/types';
import { gradients } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_LINKS: { key: keyof RootStackParamList; label: string; icon: string; bg: string; fg: string; wide?: boolean }[] = [
  { key: 'TransactionsTab' as any, label: 'العمليات', icon: 'list', bg: '#d7f5df', fg: '#1f8a4c', wide: true },
  { key: 'Income', label: 'سجل الراتب', icon: 'salary', bg: '#e3ddfb', fg: '#5b3fc4', wide: true },
  { key: 'Loans', label: 'سلف مشتركة', icon: 'people', bg: '#ffe0d6', fg: '#d9542a' },
  { key: 'Tasks', label: 'المهام', icon: 'check', bg: '#cdeafc', fg: '#1f6fb0' },
  { key: 'Debts', label: 'الديون', icon: 'arrowUpRight', bg: '#ffd9df', fg: '#c23566' },
  { key: 'Goals', label: 'أهدافي', icon: 'lock', bg: '#d7f5df', fg: '#1f8a4c', wide: true },
  { key: 'Installments', label: 'أقساط الزبائن', icon: 'card', bg: '#cdeafc', fg: '#1f6fb0', wide: true },
];

/** Dedicated Home quick-link tile glyphs (distinct from CategoryIcon, which is for transaction categories). */
function QuickLinkGlyph({ icon, fg, bg, size = 17 }: { icon: string; fg: string; bg: string; size?: number }) {
  switch (icon) {
    case 'target':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20">
          <Circle cx={10} cy={10} r={8} fill={fg} />
          <Circle cx={10} cy={10} r={5} fill={bg} />
          <Circle cx={10} cy={10} r={2.2} fill={fg} />
        </Svg>
      );
    case 'people':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20">
          <Circle cx={7.3} cy={6.6} r={3} fill={fg} />
          <Path d="M2 16.2c0-3.1 2.4-5.3 5.3-5.3s5.3 2.2 5.3 5.3" fill={fg} />
          <Circle cx={14.2} cy={7.6} r={2.4} fill={fg} fillOpacity={0.55} />
          <Path d="M11.6 16.2c.3-2.6 2-4.3 3.9-4.3s3.6 1.9 3.8 4.3" fill={fg} fillOpacity={0.55} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Path d="M4 10.3l3.8 3.8L16 5.8" stroke={fg} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'arrowUpRight':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Path d="M5.5 14.5l9-9M8 5.5h6.5V12" stroke={fg} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20">
          <Path d="M6 9V7a4 4 0 018 0v2" stroke={fg} strokeWidth={2} strokeLinecap="round" fill="none" />
          <Rect x={4.5} y={9} width={11} height={7.5} rx={2} fill={fg} />
        </Svg>
      );
    case 'card':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20">
          <Rect x={2} y={5} width={16} height={11} rx={2} fill={fg} />
          <Rect x={2} y={7.8} width={16} height={2.4} fill={bg} />
          <Rect x={4} y={12.8} width={5} height={1.6} rx={0.8} fill={bg} />
        </Svg>
      );
    case 'list':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Path d="M7 5h11M7 10h11M7 15h11" stroke={fg} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={3} cy={5} r={1.2} fill={fg} />
          <Circle cx={3} cy={10} r={1.2} fill={fg} />
          <Circle cx={3} cy={15} r={1.2} fill={fg} />
        </Svg>
      );
    default:
      return <CategoryIcon icon={icon} size={size} tile={false} />;
  }
}

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius, shadow } = useTheme();
  const fmt = useFmt(state);

  const income = incomeTotal(state);
  const expense = expenseTotal(state);
  const balance = totalBalance(state);
  const accountRows = accountBalanceRows(state, fmt);
  const recent = recentTransactions(state, fmt);
  const tips = combinedTips(state, fmt);
  const tipIdx = state.tipIndex % tips.length;
  const tip = tips[tipIdx];

  const goQuickLink = (key: keyof RootStackParamList) => {
    if (key === ('TransactionsTab' as any)) { navigation.navigate('Main', { screen: 'TransactionsTab' } as any); return; }
    navigation.navigate(key as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 16 }}>
        <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <AppText weight="bold" size={23}>لوحة التحكم</AppText>
            <AppText size={12} opacity={0.55} style={{ marginTop: 2 }}>{dateWithMonth(today())}</AppText>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'SettingsTab' } as any)}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}
          >
            <IconGear size={19} color={colors.accentRamp[700]} />
          </TouchableOpacity>
        </View>

        <RatesStrip />

        {/* Balance hero card */}
        <LinearGradient colors={gradients.balanceHero as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.hero, padding: 20, overflow: 'hidden' }}>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between' }}>
            <AppText color="#ffffff" opacity={0.85} size={13} weight="semiBold">الرصيد المتاح</AppText>
            <TouchableOpacity onPress={() => dispatch({ type: 'TOGGLE_BALANCE_HIDDEN' })}>
              {state.balanceHidden ? <IconEyeOff /> : <IconEye />}
            </TouchableOpacity>
          </View>
          <AppText color="#ffffff" weight="bold" size={36} style={{ marginTop: 6 }}>
            {state.balanceHidden ? '••••••' : fmt(balance)}
          </AppText>
          {!state.balanceHidden ? (
            <View style={{ flexDirection: rowDir('ar'), gap: 14, marginTop: 4, marginBottom: 4, flexWrap: 'wrap' }}>
              {accountRows.map((a) => (
                <AppText key={a.id} color="rgba(255,255,255,0.8)" size={11}>
                  {a.icon} {a.name} <AppText color="#ffffff" weight="semiBold" size={11}>{a.balanceLabel}</AppText>
                </AppText>
              ))}
            </View>
          ) : null}
          <View style={{ flexDirection: rowDir('ar'), gap: 10, marginTop: 16 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.sm, padding: 12 }}>
              <AppText color="#ffffff" opacity={0.85} size={11}>الدخل هذا الشهر</AppText>
              <AppText color="#ffffff" weight="bold" size={16} style={{ marginTop: 4 }}>{fmt(income)}</AppText>
            </View>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.sm, padding: 12 }}>
              <AppText color="#ffffff" opacity={0.85} size={11}>المصروف هذا الشهر</AppText>
              <AppText color="#ffffff" weight="bold" size={16} style={{ marginTop: 4 }}>{fmt(expense)}</AppText>
            </View>
          </View>
        </LinearGradient>

        {/* Quick link grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {QUICK_LINKS.map((q) => (
            <TouchableOpacity
              key={q.label}
              onPress={() => goQuickLink(q.key)}
              style={{ width: q.wide ? '48%' : '31%', backgroundColor: q.bg, borderRadius: 18, padding: 14, gap: 8, alignItems: 'flex-end' }}
            >
              <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.45)', alignItems: 'center', justifyContent: 'center' }}>
                <QuickLinkGlyph icon={q.icon} fg={q.fg} bg={q.bg} />
              </View>
              <AppText size={11.5} weight="semiBold" style={{ textAlign: 'right' }}>{q.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {state.charityPending > 0.5 ? (
          <TouchableOpacity onPress={() => navigation.navigate('Charity')} style={{ backgroundColor: '#eaf7ee', borderRadius: radius.card, padding: 16 }}>
            <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between' }}>
              <AppText weight="bold" size={13} color="#1f8a4c">صدقة معلّقة: {fmt(state.charityPending)}</AppText>
              <Tag label="تم الإعطاء ✓" variant="accent" onPress={() => dispatch({ type: 'MARK_CHARITY_GIVEN' })} />
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Tip of the day / AI assistant teaser — tapping the card opens the Assistant screen
            (matches goAssistant); a separate small link keeps the full Tips archive reachable. */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Assistant')} style={{ backgroundColor: colors.accentTint, borderRadius: radius.card, padding: 16 }}>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
              <AppText size={11} weight="extraBold" color={colors.accentRamp[700]}>🤖 المساعد المالي الذكي</AppText>
            </View>
            <AppText size={16} color={colors.accentRamp[700]}>‹</AppText>
          </View>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 6 }}>
              <IconLightbulb size={13} color={colors.accentRamp[700]} />
              <AppText size={10.5} weight="bold" color={colors.accentRamp[700]}>نصيحة اليوم</AppText>
            </View>
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); dispatch({ type: 'SET_TIP_INDEX', index: (state.tipIndex + 1) % tips.length }); }}
              style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 4, backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}
            >
              <IconRefresh size={13} />
              <AppText size={11} weight="semiBold">تحديث</AppText>
            </TouchableOpacity>
          </View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 4 }}>{tip.title}</AppText>
          <AppText size={12.5} opacity={0.75} style={{ textAlign: 'right', lineHeight: 20 }}>{tip.body}</AppText>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); navigation.navigate('Tips'); }} style={{ marginTop: 8 }}>
            <AppText size={11} weight="semiBold" color={colors.accentRamp[700]} style={{ textAlign: 'right' }}>كل النصائح ›</AppText>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Recent transactions */}
        <View>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <AppText weight="bold" size={15}>آخر العمليات</AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'TransactionsTab' } as any)}>
              <AppText size={12} weight="semiBold" color={colors.accentRamp[700]}>عرض الكل</AppText>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.card, ...shadow.sm }}>
            {recent.map((r, i) => (
              <TouchableOpacity
                key={r.tx.id}
                onPress={() => dispatch({ type: 'OPEN_EDIT', tx: r.tx })}
                style={{
                  flexDirection: rowDir('ar'), alignItems: 'center', gap: 12, padding: 14,
                  borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.divider,
                }}
              >
                <CategoryIcon icon={r.icon} size={38} />
                <View style={{ flex: 1 }}>
                  <AppText weight="semiBold" size={13.5} style={{ textAlign: 'right' }}>{r.title}</AppText>
                  <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 2 }}>{r.meta}</AppText>
                </View>
                <AppText weight="bold" size={13.5} color={r.isIncome ? colors.positive : colors.negative}>{r.amountLabel}</AppText>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
                  <IconEdit size={14} color={colors.accentRamp[700]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RatesStrip() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();

  const refresh = () => {
    dispatch({ type: 'REFRESH_RATES_START' });
    setTimeout(() => dispatch({ type: 'REFRESH_RATES_APPLY' }), 900);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => dispatch({ type: 'SET_RATES_EXPANDED', value: !state.ratesExpanded })}
      style={{ backgroundColor: colors.surface, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16 }}
    >
      <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 14 }}>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 4 }}>
            <AppText size={12} weight="bold">$ {state.usdParallel.toLocaleString('en-US')}</AppText>
            {state.usdTrend === 'up' ? <IconTrendUp /> : state.usdTrend === 'down' ? <IconTrendDown /> : null}
          </View>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 4 }}>
            <AppText size={12} weight="bold">ذهب 21 {state.gold21.toLocaleString('en-US')}</AppText>
            {state.goldTrend === 'up' ? <IconTrendUp /> : state.goldTrend === 'down' ? <IconTrendDown /> : null}
          </View>
        </View>
        <TouchableOpacity onPress={refresh}>
          <IconRefresh size={14} />
        </TouchableOpacity>
      </View>
      {state.ratesExpanded ? (
        <View style={{ marginTop: 10, gap: 10, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 10 }}>
          <View style={{ gap: 6 }}>
            <AppText size={11} weight="bold" opacity={0.6} style={{ textAlign: 'right' }}>دولار</AppText>
            <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
              <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10, alignItems: 'flex-end' }}>
                <AppText size={10.5} opacity={0.55}>موازي</AppText>
                <AppText size={15} weight="bold" style={{ marginTop: 2 }}>{state.usdParallel.toLocaleString('en-US')}</AppText>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10, alignItems: 'flex-end' }}>
                <AppText size={10.5} opacity={0.55}>رسمي</AppText>
                <AppText size={15} weight="bold" style={{ marginTop: 2 }}>{state.usdOfficial.toLocaleString('en-US')}</AppText>
              </View>
            </View>
          </View>
          <View style={{ gap: 6 }}>
            <AppText size={11} weight="bold" opacity={0.6} style={{ textAlign: 'right' }}>ذهب (دينار للغرام)</AppText>
            <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
              <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10, alignItems: 'flex-end' }}>
                <AppText size={10.5} opacity={0.55}>عيار 24</AppText>
                <AppText size={14} weight="bold" style={{ marginTop: 2 }}>{state.gold24.toLocaleString('en-US')}</AppText>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10, alignItems: 'flex-end' }}>
                <AppText size={10.5} opacity={0.55}>عيار 21</AppText>
                <AppText size={14} weight="bold" style={{ marginTop: 2 }}>{state.gold21.toLocaleString('en-US')}</AppText>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 10, alignItems: 'flex-end' }}>
                <AppText size={10.5} opacity={0.55}>عيار 18</AppText>
                <AppText size={14} weight="bold" style={{ marginTop: 2 }}>{state.gold18.toLocaleString('en-US')}</AppText>
              </View>
            </View>
          </View>
          <AppText size={10.5} opacity={0.5} style={{ textAlign: 'right' }}>
            {state.ratesOffline ? 'آخر تحديث: أمس' : 'آخر تحديث: ' + state.ratesUpdatedLabel}
          </AppText>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
