import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, CategoryIcon, EmptyState, ScreenHeader } from '../components';
import { IconEdit } from '../components/Icons';
import { allTransactionsSorted, catIcon, fmtTx } from '../data/selectors';
import { catName, useDispatch, useStoreState } from '../data/store';
import { dateWithMonth } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';

export function AllTransactionsScreen({ navigation }: RootScreenProps<'AllTransactions'>) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, shadow } = useTheme();
  const list = allTransactionsSorted(state);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="كل العمليات" onBack={() => navigation.goBack()} />
      <FlatList
        data={list}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListEmptyComponent={<EmptyState text="لا توجد عمليات بعد" />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => dispatch({ type: 'OPEN_EDIT', tx: item })}
            style={[
              { flexDirection: rowDir('ar'), alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.surface, borderRadius: 16, marginBottom: 8 },
              shadow.sm,
            ]}
          >
            <CategoryIcon icon={catIcon(state, item.type, item.categoryId)} size={38} />
            <View style={{ flex: 1 }}>
              <AppText weight="semiBold" size={13.5} style={{ textAlign: 'right' }}>{item.note}</AppText>
              <AppText size={11} opacity={0.55} style={{ textAlign: 'right', marginTop: 2 }}>
                {catName(state, item.type, item.categoryId)} · {dateWithMonth(item.date)}
              </AppText>
            </View>
            <AppText weight="bold" size={13.5} color={item.type === 'income' ? colors.positive : colors.negative}>
              {(item.type === 'income' ? '+' : '-') + fmtTx(state, item)}
            </AppText>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
              <IconEdit size={14} color={colors.accentRamp[700]} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
