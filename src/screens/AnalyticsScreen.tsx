import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, EmptyState, ExportDialog, ProgressBar, SegmentedControl, Tag } from '../components';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  allExpenseCats, budgetRows, categoryBreakdown, categoryDetail, debtsTotal, expenseTotal, forecast,
  incomeTotal, netWorth, taskProgress, totalBalance, totalBudget, useFmt, weeklyTrend,
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
  const [showExport, setShowExport] = useState(false);
  const [showUpfrontForm, setShowUpfrontForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [periods, setPeriods] = useState('6');
  const [start, setStart] = useState(today());
  const [categoryId, setCategoryId] = useState('bills');

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

  const budget = totalBudget(state);
  const rows = budgetRows(state);
  const f = forecast(state);

  const submitUpfront = () => {
    const amt = Number(amount);
    const count = Math.max(1, Number(periods) || 1);
    if (!title || !(amt > 0)) return;
    dispatch({ type: 'CREATE_UPFRONT_EXPENSE', title, amount: amt, periodsCount: count, startDate: start, categoryId });
    setTitle(''); setAmount(''); setPeriods('6'); setShowUpfrontForm(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 16 }}>
        <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between' }}>
          <AppText weight="bold" size={22}>التحليلات والميزانية</AppText>
          <TouchableOpacity
            onPress={() => setShowExport(true)}
            style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 5, backgroundColor: colors.accentTint, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 }}
          >
            <AppText size={11} weight="bold" color={colors.accentRamp[700]}>تصدير</AppText>
          </TouchableOpacity>
        </View>

        <SegmentedControl
          options={[{ key: 'week', label: 'أسبوع' }, { key: 'month', label: 'شهر' }, { key: 'year', label: 'سنة' }]}
          value={state.analyticsPeriod}
          onChange={(p) => dispatch({ type: 'SET_ANALYTICS_PERIOD', period: p as any })}
        />

        <View style={{ borderRadius: radius.hero, padding: 18, backgroundColor: colors.accent }}>
          <AppText color="rgba(255,255,255,0.85)" size={11} weight="semiBold">الرصيد المتاح</AppText>
          <AppText color="#ffffff" weight="bold" size={30} style={{ marginTop: 4, marginBottom: 14 }}>{fmt(totalBalance(state))}</AppText>
          <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, padding: 10 }}>
              <AppText color="rgba(255,255,255,0.85)" size={10}>الدخل</AppText>
              <AppText color="#ffffff" weight="bold" size={15} style={{ marginTop: 2 }}>{fmt(income)}</AppText>
            </View>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, padding: 10 }}>
              <AppText color="rgba(255,255,255,0.85)" size={10}>المصروف</AppText>
              <AppText color="#ffffff" weight="bold" size={15} style={{ marginTop: 2 }}>{fmt(expense)}</AppText>
            </View>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, padding: 10 }}>
              <AppText color="rgba(255,255,255,0.85)" size={10}>صافي المركز</AppText>
              <AppText color="#ffffff" weight="bold" size={15} style={{ marginTop: 2 }}>{fmt(netWorth(state))}</AppText>
            </View>
          </View>
        </View>

        <AppText weight="bold" size={15}>📊 الإنفاق حسب الفئة</AppText>

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

        <AppText weight="bold" size={15}>💰 الميزانية الشهرية</AppText>

        <Card>
          <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between', marginBottom: 8 }}>
            <AppText weight="semiBold" size={13}>إجمالي الإنفاق</AppText>
            <AppText weight="bold" size={13}>{fmt(expense)} / {fmt(budget)}</AppText>
          </View>
          <ProgressBar pct={budget ? Math.min(100, Math.round((expense / budget) * 100)) : 0} height={10} />
        </Card>

        <View style={{ backgroundColor: '#eeecfb', borderRadius: radius.card, padding: 16 }}>
          <AppText size={12} opacity={0.7} color="#4632b0" style={{ textAlign: 'right' }}>صافي متوقع بعد كل الالتزامات</AppText>
          <AppText weight="bold" size={20} color={f.forecastNet >= 0 ? '#2c2160' : '#c23566'} style={{ textAlign: 'right', marginTop: 6 }}>
            {fmt(f.forecastNet)}
          </AppText>
          {f.hasFactors ? (
            <AppText size={11} color="#4632b0" style={{ textAlign: 'right', marginTop: 8, lineHeight: 18 }}>
              يشمل حصص التزامات مسبقة ({fmt(f.upfrontMonthlyShare)})، ديون مستحقة ({fmt(f.pendingIOweTotal)})، وتدفقات متوقعة ({fmt(f.expectedInflows)})
            </AppText>
          ) : null}
        </View>

        {f.savingsSuggestion ? (
          <View style={{ backgroundColor: '#e0f0e8', borderRadius: radius.lg, padding: 14 }}>
            <AppText size={12} weight="semiBold" color="#1f7a52" style={{ textAlign: 'right' }}>توصية توفير — {f.savingsSuggestion.name}</AppText>
            <AppText size={12} color="#1f7a52" style={{ textAlign: 'right', marginTop: 2 }}>
              وفّر {fmt(f.savingsSuggestion.monthly)} شهريًا لتحقيق الهدف خلال {f.savingsSuggestion.months} شهر
            </AppText>
          </View>
        ) : null}

        <Card style={{ gap: 16 }}>
          {rows.map((r) => (
            <View key={r.id}>
              <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <CategoryIcon icon={r.icon} size={28} />
                <View style={{ flex: 1 }}>
                  <AppText size={12.5} weight="semiBold" style={{ textAlign: 'right' }}>{r.name}</AppText>
                  <AppText size={11} opacity={0.55} style={{ textAlign: 'right' }}>{fmt(r.spent)} / {fmt(r.limit)}</AppText>
                </View>
              </View>
              <ProgressBar pct={r.pct} />
              <Slider
                minimumValue={0}
                maximumValue={3000}
                step={50}
                value={r.limit}
                onSlidingComplete={(v) => dispatch({ type: 'SET_BUDGET', categoryId: r.id, value: v })}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.neutral[300]}
                thumbTintColor={colors.accent}
                style={{ marginTop: 8, height: 24 }}
              />
            </View>
          ))}
        </Card>

        <AppText weight="bold" size={15}>🧭 نظرة شاملة</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <OverviewTile label="مدخرات القاصة" value={fmt(savingsTotal)} onPress={() => navigation.navigate('Goals')} />
          <OverviewTile label="مهام اليوم" value={tp.done + ' / ' + tp.total} onPress={() => navigation.navigate('Tasks')} />
          <OverviewTile label="أطلب من الناس" value={fmt(debtsTotal(state, 'owed_to_me'))} onPress={() => navigation.navigate('Debts')} titleColor={colors.accentRamp[700]} valueColor={colors.accentRamp[700]} />
          <OverviewTile label="مطلوب" value={fmt(debtsTotal(state, 'i_owe'))} onPress={() => navigation.navigate('Debts')} />
          <OverviewTile
            label="مستحق من الزبائن"
            value={fmt(installDue)}
            onPress={() => navigation.navigate('Installments')}
            subtitle={installOverdue > 0 ? 'متأخر: ' + fmt(installOverdue) : undefined}
            subtitleColor="#c23566"
          />
          <OverviewTile label="الصدقة المعلّقة" value={fmt(state.charityPending)} onPress={() => navigation.navigate('Charity')} titleColor="#0f6b3c" valueColor="#0f6b3c" />
        </View>

        <View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>📈 الاتجاه الأسبوعي للمصروف</AppText>
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
          <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <AppText weight="bold" size={14}>🏠 التزامات مقدّمة (إيجار، تأمين...)</AppText>
            <TouchableOpacity onPress={() => setShowUpfrontForm((s) => !s)}>
              <AppText size={12} weight="semiBold" color={colors.accentRamp[700]}>+ التزام جديد</AppText>
            </TouchableOpacity>
          </View>

          {showUpfrontForm ? (
            <Card style={{ marginBottom: 12, gap: 10 }}>
              <TextInput value={title} onChangeText={setTitle} placeholder="العنوان (مثال: إيجار 6 أشهر)" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
              <TextInput value={amount} onChangeText={setAmount} placeholder="المبلغ الإجمالي" keyboardType="numeric" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
              <TextInput value={periods} onChangeText={setPeriods} placeholder="عدد الدفعات الشهرية" keyboardType="numeric" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
              <TextInput value={start} onChangeText={setStart} placeholder="تاريخ البدء YYYY-MM-DD" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: rowDir('ar'), gap: 8 }}>
                {cats.map((c) => (
                  <Tag key={c.id} label={c.name} variant={categoryId === c.id ? 'accent' : 'outline'} onPress={() => setCategoryId(c.id)} />
                ))}
              </ScrollView>
              <Button label="تسجيل الالتزام" onPress={submitUpfront} />
            </Card>
          ) : null}

          {state.upfrontExpenses.length === 0 ? <EmptyState text="لا توجد التزامات مقدّمة حالياً" /> : (
            <View style={{ gap: 10 }}>
              {state.upfrontExpenses.map((u) => (
                <Card key={u.id}>
                  <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
                    <AppText weight="semiBold" size={13}>{u.title}</AppText>
                    <AppText weight="bold" size={13}>{fmt(u.totalAmount)}</AppText>
                  </View>
                  <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 4 }}>
                    {u.periodsCount} شهر · حصة الشهر {fmt(u.periodAmount)}
                  </AppText>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <ExportDialog visible={showExport} onClose={() => setShowExport(false)} />
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

function OverviewTile({
  label, value, onPress, titleColor, valueColor, subtitle, subtitleColor,
}: {
  label: string; value: string; onPress: () => void; titleColor?: string; valueColor?: string; subtitle?: string; subtitleColor?: string;
}) {
  const { colors, radius, shadow } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[{ width: '47%', backgroundColor: colors.surface, borderRadius: radius.card, padding: 14 }, shadow.sm]}>
      <AppText size={11} opacity={titleColor ? 1 : 0.6} color={titleColor} style={{ textAlign: 'right' }}>{label}</AppText>
      <AppText weight="bold" size={14} color={valueColor} style={{ textAlign: 'right', marginTop: 4 }}>{value}</AppText>
      {subtitle ? <AppText size={10} color={subtitleColor} style={{ textAlign: 'right', marginTop: 2 }}>{subtitle}</AppText> : null}
    </TouchableOpacity>
  );
}

function inputStyle(colors: any, radius: any) {
  return { backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' as const };
}
