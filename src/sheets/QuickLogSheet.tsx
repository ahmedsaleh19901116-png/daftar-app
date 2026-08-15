import React from 'react';
import { TextInput, View } from 'react-native';
import { AppText, Button, SheetModal } from '../components';
import { useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { useTheme } from '../theme/ThemeContext';

export function QuickLogSheet() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const fmt = useFmt(state);
  const task = state.quickLogTask;

  return (
    <SheetModal visible={!!task} onClose={() => dispatch({ type: 'CLOSE_QUICK_LOG' })} maxHeight={340}>
      <View style={{ padding: 20 }}>
        <AppText weight="bold" size={17} style={{ textAlign: 'right', marginBottom: 6 }}>تسجيل سريع</AppText>
        <AppText size={13} opacity={0.65} style={{ textAlign: 'right', marginBottom: 16 }}>{task?.title}</AppText>
        <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>
          المبلغ {task?.amount ? '(المقترح: ' + fmt(task.amount) + ')' : ''}
        </AppText>
        <TextInput
          value={state.quickLogAmount}
          onChangeText={(v) => dispatch({ type: 'SET_QUICK_LOG_AMOUNT', value: v })}
          keyboardType="numeric"
          placeholder={task?.amount ? String(task.amount) : '0'}
          placeholderTextColor={colors.neutral[500]}
          style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right', fontSize: 18, marginBottom: 18 }}
        />
        <Button label="تسجيل العملية" block size="lg" onPress={() => dispatch({ type: 'CONFIRM_QUICK_LOG' })} />
      </View>
    </SheetModal>
  );
}
