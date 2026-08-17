import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { AppText, SheetModal } from '../components';
import { CURRENCIES } from '../data/constants';
import { useDispatch, useStoreState } from '../data/store';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';

export function CurrencyPickerSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const selectedCode = state.selectedCurrency?.code ?? 'IQD';

  return (
    <SheetModal visible={visible} onClose={onClose} maxHeight="75%">
      <View style={{ padding: 20, paddingBottom: 8 }}>
        <AppText weight="bold" size={17} style={{ textAlign: 'right' }}>اختر العملة</AppText>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap: 8 }}>
        {CURRENCIES.map((c) => {
          const selected = c.code === selectedCode;
          return (
            <TouchableOpacity
              key={c.code}
              onPress={() => dispatch({ type: 'PICK_CURRENCY', currency: c })}
              style={{
                flexDirection: rowDir('ar'), alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.sm,
                backgroundColor: selected ? colors.accentTint : colors.surface,
              }}
            >
              <AppText size={20}>{c.flag}</AppText>
              <View style={{ flex: 1 }}>
                <AppText weight="semiBold" size={13} style={{ textAlign: 'right' }}>{c.name}</AppText>
                <AppText size={11} opacity={0.55} style={{ textAlign: 'right' }}>{c.code} · {c.symbol}</AppText>
              </View>
              {selected ? <AppText color={colors.accentRamp[700]} weight="bold">✓</AppText> : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SheetModal>
  );
}
