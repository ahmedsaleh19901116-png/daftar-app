import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, EmptyState, ScreenHeader, SegmentedControl } from '../components';
import { useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { dateWithMonth, today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';

export function CharityScreen({ navigation }: RootScreenProps<'Charity'>) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius, shadow } = useTheme();
  const fmt = useFmt(state);
  const [filter, setFilter] = useState<'year' | 'all'>('year');

  const currentYear = today().slice(0, 4);
  const log = filter === 'year' ? state.charityLog.filter((c) => c.date.startsWith(currentYear)) : state.charityLog;
  const total = log.reduce((a, c) => a + c.amount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="الصدقة" onBack={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 20, gap: 16 }}>
        <Card>
          <AppText size={12} opacity={0.6} style={{ textAlign: 'right' }}>الرصيد المعلّق</AppText>
          <AppText weight="bold" size={26} style={{ textAlign: 'right', marginTop: 6 }}>{fmt(state.charityPending)}</AppText>
          {state.charityPending > 0.5 ? (
            <Button label="تم الإعطاء ✓" onPress={() => dispatch({ type: 'MARK_CHARITY_GIVEN' })} style={{ marginTop: 12 }} />
          ) : null}
        </Card>

        <SegmentedControl
          options={[{ key: 'year', label: 'هالسنة' }, { key: 'all', label: 'كل الأوقات' }]}
          value={filter}
          onChange={(f) => setFilter(f as 'year' | 'all')}
        />
        <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
          <AppText size={12} weight="semiBold" opacity={0.6}>الإجمالي</AppText>
          <AppText size={13} weight="bold">{fmt(total)}</AppText>
        </View>
      </View>

      <FlatList
        data={log}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ padding: 20, gap: 8 }}
        ListEmptyComponent={<EmptyState text="لا يوجد سجل صدقة بعد" />}
        renderItem={({ item }) => (
          <View style={[{ flexDirection: rowDir('ar'), justifyContent: 'space-between', padding: 14, backgroundColor: colors.surface, borderRadius: radius.card }, shadow.sm]}>
            <View>
              <AppText weight="semiBold" size={13}>{item.note || 'صدقة'}</AppText>
              <AppText size={11} opacity={0.5} style={{ marginTop: 2 }}>{dateWithMonth(item.date)}</AppText>
            </View>
            <AppText weight="bold" size={13} color={colors.positive}>{fmt(item.amount)}</AppText>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
