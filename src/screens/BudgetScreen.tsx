import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, CategoryIcon, EmptyState, ProgressBar, Tag } from '../components';
import { allExpenseCats, budgetRows, expenseTotal, forecast, totalBudget, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';

export function BudgetScreen() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius, shadow } = useTheme();
  const fmt = useFmt(state);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [periods, setPeriods] = useState('6');
  const [start, setStart] = useState(today());
  const [categoryId, setCategoryId] = useState('bills');

  const expense = expenseTotal(state);
  const budget = totalBudget(state);
  const rows = budgetRows(state);
  const f = forecast(state);
  const cats = allExpenseCats(state);

  const submit = () => {
    const amt = Number(amount);
    const count = Math.max(1, Number(periods) || 1);
    if (!title || !(amt > 0)) return;
    dispatch({ type: 'CREATE_UPFRONT_EXPENSE', title, amount: amt, periodsCount: count, startDate: start, categoryId });
    setTitle(''); setAmount(''); setPeriods('6'); setShowForm(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 16 }}>
        <AppText weight="bold" size={22}>الميزانية الشهرية</AppText>

        <Card>
          <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between', marginBottom: 8 }}>
            <AppText weight="semiBold" size={13}>إجمالي الإنفاق</AppText>
            <AppText weight="bold" size={13}>{fmt(expense)} / {fmt(budget)}</AppText>
          </View>
          <ProgressBar pct={budget ? Math.min(100, Math.round((expense / budget) * 100)) : 0} height={10} />
        </Card>

        <Card>
          <AppText size={12} opacity={0.6} style={{ textAlign: 'right' }}>صافي متوقع بعد كل الالتزامات</AppText>
          <AppText weight="bold" size={20} color={f.forecastNet >= 0 ? colors.positive : colors.negative} style={{ textAlign: 'right', marginTop: 6 }}>
            {fmt(f.forecastNet)}
          </AppText>
          {f.hasFactors ? (
            <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 6 }}>
              يشمل حصص التزامات مسبقة ({fmt(f.upfrontMonthlyShare)})، ديون مستحقة ({fmt(f.pendingIOweTotal)})، وتدفقات متوقعة ({fmt(f.expectedInflows)})
            </AppText>
          ) : null}
        </Card>

        {f.savingsSuggestion ? (
          <Card>
            <AppText size={12} opacity={0.6} style={{ textAlign: 'right' }}>توصية توفير</AppText>
            <AppText weight="bold" size={14} style={{ textAlign: 'right', marginTop: 6 }}>
              وفّر {fmt(f.savingsSuggestion.monthly)} شهريًا للوصول لهدف "{f.savingsSuggestion.name}" خلال {f.savingsSuggestion.months} شهر
            </AppText>
          </Card>
        ) : null}

        <View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>حدود الفئات — اضغط +/- للتعديل</AppText>
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
                <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <Stepper onPress={() => dispatch({ type: 'SET_BUDGET', categoryId: r.id, value: Math.max(0, r.limit - 50) })} label="−" />
                  <AppText size={12} weight="bold">{fmt(r.limit)}</AppText>
                  <Stepper onPress={() => dispatch({ type: 'SET_BUDGET', categoryId: r.id, value: r.limit + 50 })} label="+" />
                </View>
              </View>
            ))}
          </Card>
        </View>

        <View>
          <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <AppText weight="bold" size={14}>الالتزامات المسبقة</AppText>
            <TouchableOpacity onPress={() => setShowForm((s) => !s)}>
              <AppText size={12} weight="semiBold" color={colors.accentRamp[700]}>+ التزام جديد</AppText>
            </TouchableOpacity>
          </View>

          {showForm ? (
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
              <Button label="إنشاء الالتزام" onPress={submit} />
            </Card>
          ) : null}

          {state.upfrontExpenses.length === 0 ? <EmptyState text="لا توجد التزامات مسبقة بعد" /> : (
            <View style={{ gap: 10 }}>
              {state.upfrontExpenses.map((u) => (
                <Card key={u.id}>
                  <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
                    <AppText weight="semiBold" size={13}>{u.title}</AppText>
                    <AppText weight="bold" size={13}>{fmt(u.totalAmount)}</AppText>
                  </View>
                  <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 4 }}>
                    {fmt(u.periodAmount)} / شهر · {u.periodsCount} دفعات
                  </AppText>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stepper({ onPress, label }: { onPress: () => void; label: string }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.neutral[200], alignItems: 'center', justifyContent: 'center' }}>
      <AppText weight="bold" size={16}>{label}</AppText>
    </TouchableOpacity>
  );
}

function inputStyle(colors: any, radius: any) {
  return { backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' as const };
}
