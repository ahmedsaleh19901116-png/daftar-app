import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, EmptyState, ProgressBar, ScreenHeader, Tag } from '../components';
import { useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';

export function GoalsScreen({ navigation }: RootScreenProps<'Goals'>) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const fmt = useFmt(state);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [date, setDate] = useState('');
  const [contribAmounts, setContribAmounts] = useState<Record<number, string>>({});

  const submit = () => {
    if (!name || !(Number(target) > 0)) return;
    dispatch({ type: 'CREATE_SAVINGS_GOAL', name, target: Number(target), date });
    setName(''); setTarget(''); setDate(''); setShowForm(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader
        title="أهداف الادخار"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => setShowForm((s) => !s)}>
            <AppText size={13} weight="bold" color={colors.accentRamp[700]}>{showForm ? 'إغلاق' : '+ هدف جديد'}</AppText>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40, gap: 14 }}>
        {showForm ? (
          <Card style={{ gap: 10 }}>
            <TextInput value={name} onChangeText={setName} placeholder="اسم الهدف" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <TextInput value={target} onChangeText={setTarget} placeholder="المبلغ المستهدف" keyboardType="numeric" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <TextInput value={date} onChangeText={setDate} placeholder="تاريخ مستهدف (اختياري) YYYY-MM-DD" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <Button label="إنشاء الهدف" onPress={submit} />
          </Card>
        ) : null}

        {state.savingsGoals.length === 0 ? <EmptyState text="لا توجد أهداف ادخار بعد" /> : (
          <View style={{ gap: 10 }}>
            {state.savingsGoals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentSaved / g.targetAmount) * 100));
              const achieved = g.status === 'achieved';
              return (
                <Card key={g.id}>
                  <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between', alignItems: 'center' }}>
                    <AppText weight="bold" size={14}>{g.name}</AppText>
                    {achieved ? <Tag label="تم تحقيقه" variant="accent" /> : null}
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <ProgressBar pct={pct} />
                    <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 4 }}>{fmt(g.currentSaved)} من {fmt(g.targetAmount)}</AppText>
                  </View>
                  {achieved ? (
                    <Button label="تم الشراء ✓" onPress={() => dispatch({ type: 'COMPLETE_SAVINGS_GOAL', goalId: g.id })} style={{ marginTop: 12 }} />
                  ) : (
                    <View style={{ flexDirection: rowDir('ar'), gap: 8, marginTop: 12 }}>
                      <TextInput
                        value={contribAmounts[g.id] || ''}
                        onChangeText={(v) => setContribAmounts((s) => ({ ...s, [g.id]: v }))}
                        keyboardType="numeric" placeholder="مبلغ" placeholderTextColor={colors.neutral[500]}
                        style={[inputStyle(colors, radius), { flex: 1 }]}
                      />
                      <Button
                        label="مساهمة"
                        onPress={() => {
                          const amt = Number(contribAmounts[g.id]) || 0;
                          if (amt > 0) { dispatch({ type: 'ADD_CONTRIBUTION', goalId: g.id, amount: amt }); setContribAmounts((s) => ({ ...s, [g.id]: '' })); }
                        }}
                      />
                    </View>
                  )}
                  {g.currentSaved > 0 ? (
                    <TouchableOpacity onPress={() => dispatch({ type: 'WITHDRAW_FROM_GOAL', goalId: g.id })} style={{ marginTop: 10 }}>
                      <AppText size={11.5} color="#c23566" weight="semiBold" style={{ textAlign: 'right' }}>سحب الرصيد</AppText>
                    </TouchableOpacity>
                  ) : null}
                </Card>
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
