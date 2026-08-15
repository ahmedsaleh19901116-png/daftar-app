import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, EmptyState, ScreenHeader } from '../components';
import { IconEdit } from '../components/Icons';
import { fmtTx, useFmt } from '../data/selectors';
import { catName, useDispatch, useStoreState } from '../data/store';
import { dateWithMonth } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';

export function IncomeScreen({ navigation }: RootScreenProps<'Income'>) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, shadow } = useTheme();
  const fmt = useFmt(state);
  const entries = [...state.transactions].filter((t) => t.type === 'income').sort((a, b) => b.date.localeCompare(a.date));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader
        title="سجل الراتب والمداخيل"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => dispatch({ type: 'OPEN_ADD', txType: 'income' })}>
            <AppText size={13} weight="bold" color={colors.accentRamp[700]}>+ دخل جديد</AppText>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={entries}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 8 }}
        ListHeaderComponent={
          <Card style={{ marginBottom: 14 }}>
            <AppText size={12} opacity={0.6} style={{ textAlign: 'right' }}>الراتب الشهري الثابت</AppText>
            <AppText weight="bold" size={20} style={{ textAlign: 'right', marginTop: 6 }}>{fmt(state.salaryFixed)}</AppText>
          </Card>
        }
        ListEmptyComponent={<EmptyState text="لا يوجد دخل مسجل بعد" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'OPEN_EDIT', tx: item })}
            style={[{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.surface, borderRadius: 16 }, shadow.sm]}
          >
            <View style={{ flex: 1 }}>
              <AppText weight="semiBold" size={13.5} style={{ textAlign: 'right' }}>{item.note}</AppText>
              <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 2 }}>
                {catName(state, 'income', item.categoryId)} · {dateWithMonth(item.date)}
              </AppText>
            </View>
            <AppText weight="bold" size={13.5} color={colors.positive}>+{fmtTx(state, item)}</AppText>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
              <IconEdit size={14} color={colors.accentRamp[700]} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
