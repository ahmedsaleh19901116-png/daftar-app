import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, ScreenHeader, Tag } from '../components';
import { installmentRemaining, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { isOverdue, today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';
import { cancelReminder } from '../utils/notifications';

export function InstallmentDetailScreen({ route, navigation }: RootScreenProps<'InstallmentDetail'>) {
  const { planId } = route.params;
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius, shadow } = useTheme();
  const fmt = useFmt(state);
  const plan = state.installmentPlans.find((p) => p.id === planId);

  if (!plan) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="خطة الأقساط" onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const remaining = installmentRemaining(plan);

  const recordPayment = async (periodIndex: number) => {
    const period = plan.periods.find((p) => p.index === periodIndex);
    if (period) await cancelReminder(period.notificationId);
    dispatch({ type: 'RECORD_PERIOD_PAYMENT', planId: plan.id, periodIndex });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title={plan.customerName} subtitle={plan.itemDescription} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40, gap: 16 }}>
        <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>الإجمالي</AppText>
            <AppText weight="bold" size={16} style={{ marginTop: 4 }}>{fmt(plan.totalAmount)}</AppText>
          </Card>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>المتبقي</AppText>
            <AppText weight="bold" size={16} style={{ marginTop: 4 }}>{fmt(remaining)}</AppText>
          </Card>
        </View>

        <View style={{ gap: 8 }}>
          {plan.periods.map((p) => {
            const overdue = isOverdue(p, today());
            const statusLabel = p.status === 'paid' ? 'مدفوع' : overdue ? 'متأخر' : 'قادم';
            return (
              <TouchableOpacity
                key={p.index}
                disabled={p.status === 'paid'}
                onPress={() => recordPayment(p.index)}
                style={[{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: colors.surface, borderRadius: radius.card }, shadow.sm]}
              >
                <View>
                  <AppText weight="semiBold" size={13}>{p.monthLabel}</AppText>
                  <AppText size={11} opacity={0.5} style={{ marginTop: 2 }}>{fmt(p.amount)}</AppText>
                </View>
                <Tag label={statusLabel} variant={p.status === 'paid' ? 'neutral' : overdue ? 'outline' : 'accent'} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
