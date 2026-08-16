import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, CategoryIcon, EmptyState, SegmentedControl, Tag } from '../components';
import { IconEdit } from '../components/Icons';
import { DatePeriod } from '../data/helpers';
import { filteredTransactions, useFmt } from '../data/selectors';
import { catList, useDispatch, useStoreState } from '../data/store';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';

export function AllTransactionsScreen() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, shadow } = useTheme();
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [period, setPeriod] = useState<DatePeriod>('month');
  const [categoryId, setCategoryId] = useState('all');
  const [accountId, setAccountId] = useState('all');

  const fmt = useFmt(state);
  const cats = [...catList(state, 'expense'), ...catList(state, 'income')];
  const { rows, incomeTotal, expenseTotal } = filteredTransactions(state, { type, period, categoryId, accountId });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 12 }}>
        <AppText weight="bold" size={22}>العمليات</AppText>

        <SegmentedControl
          options={[{ key: 'all', label: 'الكل' }, { key: 'income', label: 'دخل' }, { key: 'expense', label: 'مصروف' }]}
          value={type}
          onChange={(v) => setType(v as any)}
        />
        <SegmentedControl
          options={[{ key: 'month', label: 'هذا الشهر' }, { key: 'quarter', label: 'آخر 3 أشهر' }, { key: 'all', label: 'الكل' }]}
          value={period}
          onChange={(v) => setPeriod(v as any)}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: rowDir('ar'), gap: 8 }}>
          <Tag label="كل الفئات" variant={categoryId === 'all' ? 'accent' : 'outline'} onPress={() => setCategoryId('all')} />
          {cats.map((c) => (
            <Tag key={c.id} label={c.name} variant={categoryId === c.id ? 'accent' : 'outline'} onPress={() => setCategoryId(c.id)} />
          ))}
        </ScrollView>

        <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
          <Tag label="كل الحسابات" variant={accountId === 'all' ? 'accent' : 'outline'} onPress={() => setAccountId('all')} />
          {state.accounts.map((a) => (
            <Tag key={a.id} label={a.icon + ' ' + a.name} variant={accountId === a.id ? 'accent' : 'outline'} onPress={() => setAccountId(a.id)} />
          ))}
        </View>

        <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>دخل الفترة</AppText>
            <AppText weight="bold" size={17} color={colors.accentRamp[700]} style={{ marginTop: 4 }}>{fmt(incomeTotal)}</AppText>
          </Card>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>مصروف الفترة</AppText>
            <AppText weight="bold" size={17} style={{ marginTop: 4 }}>{fmt(expenseTotal)}</AppText>
          </Card>
        </View>

        {rows.length === 0 ? <EmptyState text="لا توجد عمليات مطابقة لهذه الفلاتر" /> : (
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, ...shadow.sm }}>
            {rows.map((r, i) => (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
