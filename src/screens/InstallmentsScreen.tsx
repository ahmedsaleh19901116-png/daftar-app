import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, EmptyState, ScreenHeader, Tag } from '../components';
import { installmentRemaining, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { monthlyPeriods, today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootStackParamList } from '../navigation/types';
import { scheduleReminder } from '../utils/notifications';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function InstallmentsScreen() {
  const navigation = useNavigation<Nav>();
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius, shadow } = useTheme();
  const fmt = useFmt(state);

  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [periods, setPeriods] = useState('6');
  const [start, setStart] = useState(today());

  const totalDue = state.installmentPlans.reduce((a, p) => a + p.periods.filter((per) => per.status === 'pending').reduce((b, per) => b + per.amount, 0), 0);

  const submit = async () => {
    const amt = Number(amount);
    const count = Math.max(1, Number(periods) || 1);
    if (!customerName || !(amt > 0)) return;
    const id = Date.now();
    const periodAmount = amt / count;
    const computedPeriods = monthlyPeriods(count, start, periodAmount);
    const periodNotificationIds = await Promise.all(computedPeriods.map((p) => scheduleReminder({
      id: `installment_${id}_${p.index}`,
      type: 'installment',
      title: 'تذكير قسط',
      body: `موعد استحقاق قسط ${customerName} بقيمة ${Math.round(p.amount).toLocaleString('en-US')} د.ع اليوم`,
      dueDate: new Date(p.dueDate as string),
    })));
    dispatch({ type: 'CREATE_INSTALLMENT_PLAN', id, customerName, amount: amt, periodsCount: count, startDate: start, item, periodNotificationIds });
    setCustomerName(''); setItem(''); setAmount(''); setPeriods('6'); setShowForm(false);
    navigation.navigate('InstallmentDetail', { planId: id });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader
        title="أقساط العملاء"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => setShowForm((s) => !s)}>
            <AppText size={13} weight="bold" color={colors.accentRamp[700]}>{showForm ? 'إغلاق' : '+ خطة جديدة'}</AppText>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40, gap: 16 }}>
        <Card>
          <AppText size={11} opacity={0.6}>إجمالي المستحق</AppText>
          <AppText weight="bold" size={17} style={{ marginTop: 4 }}>{fmt(totalDue)}</AppText>
        </Card>

        {showForm ? (
          <Card style={{ gap: 10 }}>
            <TextInput value={customerName} onChangeText={setCustomerName} placeholder="اسم العميل" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <TextInput value={item} onChangeText={setItem} placeholder="وصف البضاعة (اختياري)" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <TextInput value={amount} onChangeText={setAmount} placeholder="المبلغ الإجمالي" keyboardType="numeric" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <TextInput value={periods} onChangeText={setPeriods} placeholder="عدد الدفعات" keyboardType="numeric" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <TextInput value={start} onChangeText={setStart} placeholder="تاريخ البدء YYYY-MM-DD" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <Button label="إنشاء الخطة" onPress={submit} />
          </Card>
        ) : null}

        {state.installmentPlans.length === 0 ? <EmptyState text="لا توجد خطط أقساط بعد" /> : (
          <View style={{ gap: 10 }}>
            {state.installmentPlans.map((p) => {
              const remaining = installmentRemaining(p);
              const remainingCount = p.periods.filter((per) => per.status === 'pending').length;
              return (
                <TouchableOpacity key={p.id} onPress={() => navigation.navigate('InstallmentDetail', { planId: p.id })}>
                  <Card>
                    <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
                      <AppText weight="bold" size={14}>{p.customerName}</AppText>
                      <Tag label={p.status === 'completed' ? 'مكتملة' : 'نشطة'} variant={p.status === 'completed' ? 'neutral' : 'accent'} />
                    </View>
                    <AppText size={11.5} opacity={0.55} style={{ textAlign: 'right', marginTop: 6 }}>
                      متبقي {fmt(remaining)} على {remainingCount} دفعات
                    </AppText>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function inputStyle(colors: any, radius: any) {
  return { backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' as const };
}
