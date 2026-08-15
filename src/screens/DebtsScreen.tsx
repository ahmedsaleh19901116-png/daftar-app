import React, { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, EmptyState, ProgressBar, ScreenHeader, SegmentedControl, Tag } from '../components';
import { accountBalance, debtRows, debtsTotal, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';

export function DebtsScreen({ navigation }: RootScreenProps<'Debts'>) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const fmt = useFmt(state);
  const [direction, setDirection] = useState<'owed_to_me' | 'i_owe'>('owed_to_me');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [accountId, setAccountId] = useState(state.accounts[0]?.id ?? 'cash');
  const [error, setError] = useState('');
  const [payAmounts, setPayAmounts] = useState<Record<number, string>>({});

  const owedToMe = debtRows(state, 'owed_to_me');
  const iOwe = debtRows(state, 'i_owe');

  const submit = () => {
    const amountNum = Number(amount);
    if (!name || !(amountNum > 0)) return;
    if (direction === 'owed_to_me' && amountNum > accountBalance(state, accountId)) {
      setError('الرصيد غير كافٍ بهذا الحساب لإعطاء القرض');
      return;
    }
    setError('');
    dispatch({ type: 'ADD_DEBT', person: name, amount: amountNum, direction, note, accountId });
    setName(''); setAmount(''); setNote('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="الديون" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>
        <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>أطلب</AppText>
            <AppText weight="bold" size={16} color={colors.positive} style={{ marginTop: 4 }}>{fmt(debtsTotal(state, 'owed_to_me'))}</AppText>
          </Card>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>مطلوب</AppText>
            <AppText weight="bold" size={16} style={{ marginTop: 4 }}>{fmt(debtsTotal(state, 'i_owe'))}</AppText>
          </Card>
        </View>

        <Card style={{ gap: 10 }}>
          <AppText weight="bold" size={14} style={{ textAlign: 'right' }}>إضافة دين جديد</AppText>
          <SegmentedControl
            options={[{ key: 'owed_to_me', label: 'أطلب' }, { key: 'i_owe', label: 'مطلوب' }]}
            value={direction}
            onChange={(d) => setDirection(d as any)}
          />
          <TextInput value={name} onChangeText={setName} placeholder="الاسم" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
          <TextInput value={amount} onChangeText={setAmount} placeholder="المبلغ" keyboardType="numeric" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
          <TextInput value={note} onChangeText={setNote} placeholder="ملاحظة (اختياري)" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
          <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
            {state.accounts.map((a) => (
              <Tag key={a.id} label={a.icon + ' ' + a.name} variant={a.id === accountId ? 'accent' : 'outline'} onPress={() => setAccountId(a.id)} />
            ))}
          </View>
          {error ? <AppText size={11.5} color="#c23566" style={{ textAlign: 'right' }}>{error}</AppText> : null}
          <Button label="إضافة" onPress={submit} />
        </Card>

        <DebtGroup
          title="أطلب"
          rows={owedToMe}
          fmt={fmt}
          payAmounts={payAmounts}
          setPayAmounts={setPayAmounts}
          onPay={(id: number, amt: number) => dispatch({ type: 'COLLECT_DEBT_PARTIAL', id, amount: amt })}
          onWriteOff={(id: number) => dispatch({ type: 'WRITE_OFF_OWED_TO_ME', id })}
          payLabel="سجل تحصيل"
          writeOffLabel="تحصيل الكل"
        />
        <DebtGroup
          title="مطلوب"
          rows={iOwe}
          fmt={fmt}
          payAmounts={payAmounts}
          setPayAmounts={setPayAmounts}
          onPay={(id: number, amt: number) => dispatch({ type: 'PAY_DEBT_INSTALLMENT', id, amount: amt })}
          onWriteOff={(id: number) => dispatch({ type: 'WRITE_OFF_DEBT', id })}
          payLabel="سجل دفعة"
          writeOffLabel="شطب"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function DebtGroup({ title, rows, fmt, payAmounts, setPayAmounts, onPay, onWriteOff, payLabel, writeOffLabel }: any) {
  const { colors, radius } = useTheme();
  return (
    <View>
      <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>{title}</AppText>
      {rows.length === 0 ? <EmptyState text="لا توجد عناصر بعد" /> : (
        <View style={{ gap: 10 }}>
          {rows.map(({ debt, paidPct }: any) => (
            <Card key={debt.id} style={debt.settled ? { opacity: 0.45 } : undefined}>
              <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
                <AppText weight="semiBold" size={13.5} style={debt.settled ? { textDecorationLine: 'line-through' } : undefined}>{debt.person}</AppText>
                <AppText weight="bold" size={13.5}>{fmt(debt.amount)}</AppText>
              </View>
              {debt.note ? <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 2 }}>{debt.note}</AppText> : null}
              {!debt.settled ? (
                <>
                  <View style={{ marginTop: 10 }}>
                    <ProgressBar pct={paidPct} />
                    <AppText size={10.5} opacity={0.55} style={{ textAlign: 'right', marginTop: 4 }}>
                      {fmt(debt.paidSoFar || 0)} من {fmt(debt.amount)}
                    </AppText>
                  </View>
                  <View style={{ flexDirection: rowDir('ar'), gap: 8, marginTop: 10 }}>
                    <TextInput
                      value={payAmounts[debt.id] || ''}
                      onChangeText={(v) => setPayAmounts((s: any) => ({ ...s, [debt.id]: v }))}
                      keyboardType="numeric"
                      placeholder="مبلغ"
                      placeholderTextColor={colors.neutral[500]}
                      style={{ flex: 1, backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 8, textAlign: 'right' }}
                    />
                    <Button
                      label={payLabel}
                      size="md"
                      onPress={() => {
                        const amt = Number(payAmounts[debt.id]) || 0;
                        if (amt > 0) { onPay(debt.id, amt); setPayAmounts((s: any) => ({ ...s, [debt.id]: '' })); }
                      }}
                    />
                    <Button label={writeOffLabel} size="md" variant="secondary" onPress={() => onWriteOff(debt.id)} />
                  </View>
                </>
              ) : null}
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

function inputStyle(colors: any, radius: any) {
  return { backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' as const };
}
