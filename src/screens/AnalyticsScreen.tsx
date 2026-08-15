import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, ProgressBar, SegmentedControl, Tag } from '../components';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  allExpenseCats, categoryBreakdown, categoryDetail, debtsTotal, expenseTotal, incomeTotal, installmentRemaining,
  netWorth, taskProgress, useFmt, weeklyTrend,
} from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { isOverdue, today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function AnalyticsScreen() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const { colors, radius, shadow } = useTheme();
  const fmt = useFmt(state);

  const expense = expenseTotal(state);
  const income = incomeTotal(state);
  const breakdown = categoryBreakdown(state);
  const detail = categoryDetail(state, state.categoryFilter);
  const weekBars = weeklyTrend(state);
  const cats = allExpenseCats(state);
  const filteredExpense = state.categoryFilter === 'all' ? expense : (breakdown.find((b) => b.id === state.categoryFilter)?.amount ?? 0);
  const filteredLabel = state.categoryFilter === 'all' ? 'إجمالي المصروف' : detail?.name ?? '';

  const installDue = state.installmentPlans.reduce((a, p) => a + p.periods.filter((per) => per.status === 'pending').reduce((b, per) => b + per.amount, 0), 0);
  const installOverdue = state.installmentPlans.reduce((a, p) => a + p.periods.filter((per) => isOverdue(per, today())).reduce((b, per) => b + per.amount, 0), 0);
  const savingsTotal = state.savingsGoals.reduce((a, g) => a + g.currentSaved, 0);
  const tp = taskProgress(state);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 16 }}>
        <AppText weight="bold" size={22}>التحليلات</AppText>

        <SegmentedControl
          options={[{ key: 'week', label: 'أسبوع' }, { key: 'month', label: 'شهر' }, { key: 'year', label: 'سنة' }]}
          value={state.analyticsPeriod}
          onChange={(p) => dispatch({ type: 'SET_ANALYTICS_PERIOD', period: p as any })}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: rowDir('ar'), gap: 8 }}>
          <Tag label="الكل" variant={state.categoryFilter === 'all' ? 'accent' : 'outline'} onPress={() => dispatch({ type: 'SET_CATEGORY_FILTER', id: 'all' })} />
          {cats.map((c) => (
            <Tag key={c.id} label={c.name} variant={state.categoryFilter === c.id ? 'accent' : 'outline'} onPress={() => dispatch({ type: 'SET_CATEGORY_FILTER', id: c.id })} />
          ))}
        </ScrollView>

        {detail ? (
          <Card>
            <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <CategoryIcon icon={detail.icon} size={36} />
              <AppText weight="bold" size={15}>{detail.name}</AppText>
            </View>
            <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
              <Stat label="الإجمالي" value={fmt(detail.total)} />
              <Stat label="عدد العمليات" value={String(detail.count)} />
              <Stat label="المعدل" value={fmt(detail.avg)} />
            </View>
            <View style={{ marginTop: 12, gap: 8 }}>
              {detail.txs.slice(0, 5).map((t) => (
                <View key={t.id} style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
                  <AppText size={12} opacity={0.7}>{t.note} · {t.dateLabel}</AppText>
                  <AppText size={12} weight="semiBold">{fmt(t.amount)}</AppText>
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>{filteredLabel}</AppText>
            <AppText weight="bold" size={17} style={{ marginTop: 4 }}>{fmt(filteredExpense)}</AppText>
          </Card>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>إجمالي الدخل</AppText>
            <AppText weight="bold" size={17} color={colors.positive} style={{ marginTop: 4 }}>{fmt(income)}</AppText>
          </Card>
        </View>

        <View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>التوزيع حسب الفئة</AppText>
          <Card style={{ gap: 12 }}>
            {breakdown.map((b) => (
              <View key={b.id}>
                <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between', marginBottom: 6 }}>
                  <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 8 }}>
                    <CategoryIcon icon={b.icon} size={26} />
                    <AppText size={12.5} weight="semiBold">{b.name}</AppText>
                  </View>
                  <AppText size={12} opacity={0.7}>{b.pct}% · {fmt(b.amount)}</AppText>
                </View>
                <ProgressBar pct={b.barPct} />
              </View>
            ))}
          </Card>
        </View>

        <View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>الاتجاه الأسبوعي للمصروف</AppText>
          <Card style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8, paddingTop: 10 }}>
            {weekBars.map((d, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <View style={{ width: '100%', height: 80, justifyContent: 'flex-end' }}>
                  <View style={{ height: `${d.heightPct}%`, backgroundColor: colors.accent, borderRadius: 6 }} />
                </View>
                <AppText size={10} opacity={0.5}>{d.label}</AppText>
              </View>
            ))}
          </Card>
        </View>

        <View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>الصورة المالية الشاملة</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <OverviewTile label="صافي الثروة" value={fmt(netWorth(state))} onPress={() => {}} />
            <OverviewTile label="إجمالي المدخرات" value={fmt(savingsTotal)} onPress={() => navigation.navigate('Goals')} />
            <OverviewTile label="أطلب" value={fmt(debtsTotal(state, 'owed_to_me'))} onPress={() => navigation.navigate('Debts')} />
            <OverviewTile label="أنا مدين" value={fmt(debtsTotal(state, 'i_owe'))} onPress={() => navigation.navigate('Debts')} />
            <OverviewTile label="أقساط مستحقة" value={fmt(installDue)} onPress={() => navigation.navigate('Installments')} />
            <OverviewTile label="أقساط متأخرة" value={fmt(installOverdue)} onPress={() => navigation.navigate('Installments')} />
            <OverviewTile label="صدقة معلّقة" value={fmt(state.charityPending)} onPress={() => navigation.navigate('Charity')} />
            <OverviewTile label="مهام اليوم" value={tp.done + ' / ' + tp.total} onPress={() => navigation.navigate('Tasks')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <AppText size={10.5} opacity={0.55}>{label}</AppText>
      <AppText weight="bold" size={13} style={{ marginTop: 2 }}>{value}</AppText>
    </View>
  );
}

function OverviewTile({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  const { colors, radius, shadow } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[{ width: '47%', backgroundColor: colors.surface, borderRadius: radius.card, padding: 14 }, shadow.sm]}>
      <AppText size={11} opacity={0.6} style={{ textAlign: 'right' }}>{label}</AppText>
      <AppText weight="bold" size={14} style={{ textAlign: 'right', marginTop: 4 }}>{value}</AppText>
    </TouchableOpacity>
  );
}
