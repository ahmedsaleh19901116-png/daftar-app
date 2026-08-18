import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { accountBalance, toBase, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { rowDir } from '../theme/rtl';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';
import { Button } from './Button';
import { SegmentedControl } from './SegmentedControl';
import { CenterModal } from './SheetModal';
import { Tag } from './Tag';

export function TransferDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const accounts = state.accounts;
  const [from, setFrom] = useState(accounts[0]?.id ?? 'cash');
  const [to, setTo] = useState(accounts[1]?.id ?? accounts[0]?.id ?? 'card');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'IQD' | 'USD'>('IQD');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const swap = () => { setFrom(to); setTo(from); };
  const fromBalance = accountBalance(state, from);
  const fromName = accounts.find((a) => a.id === from)?.name ?? from;
  const fmt = useFmt(state);

  const reset = () => { setAmount(''); setNote(''); setError(''); };
  const close = () => { reset(); onClose(); };

  const confirm = () => {
    const amountNum = Number(amount);
    if (!(amountNum > 0)) { setError('أدخل مبلغًا صحيحًا'); return; }
    if (from === to) { setError('اختر حسابين مختلفين'); return; }
    if (toBase(state, amountNum, currency) > fromBalance) { setError('الرصيد غير كافٍ بالحساب المصدر'); return; }
    dispatch({ type: 'CREATE_TRANSFER', from, to, amount: amountNum, currency, note });
    close();
  };

  return (
    <CenterModal visible={visible} onClose={close}>
      <View style={{ gap: 14 }}>
        <AppText weight="bold" size={16} style={{ textAlign: 'right' }}>تحويل بين الحسابات</AppText>
        <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, gap: 6 }}>
            <AppText size={11} opacity={0.6} style={{ textAlign: 'right' }}>من</AppText>
            {accounts.map((a) => (
              <Tag key={a.id} label={a.icon + ' ' + a.name} variant={a.id === from ? 'accent' : 'outline'} onPress={() => setFrom(a.id)} />
            ))}
          </View>
          <TouchableOpacity
            onPress={swap}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center', marginTop: 18 }}
          >
            <AppText color={colors.accentRamp[700]}>⇄</AppText>
          </TouchableOpacity>
          <View style={{ flex: 1, gap: 6 }}>
            <AppText size={11} opacity={0.6} style={{ textAlign: 'right' }}>إلى</AppText>
            {accounts.map((a) => (
              <Tag key={a.id} label={a.icon + ' ' + a.name} variant={a.id === to ? 'accent' : 'outline'} onPress={() => setTo(a.id)} />
            ))}
          </View>
        </View>

        <View>
          <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>المبلغ</AppText>
          <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.neutral[500]}
              style={{ flex: 1, fontSize: 20, fontWeight: '700' as any, color: colors.text, textAlign: 'right', backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 10 }}
            />
            <View style={{ width: 110 }}>
              <SegmentedControl
                options={[{ key: 'IQD', label: 'د.ع' }, { key: 'USD', label: '$' }]}
                value={currency}
                onChange={(k) => setCurrency(k as any)}
              />
            </View>
          </View>
        </View>

        <View>
          <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>ملاحظة (اختياري)</AppText>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="مثال: سحب من البطاقة"
            placeholderTextColor={colors.neutral[500]}
            style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 10, textAlign: 'right' }}
          />
        </View>

        <AppText size={11} opacity={0.55} style={{ textAlign: 'right' }}>الرصيد الحالي بحساب "{fromName}": {fmt(fromBalance)}</AppText>
        {error ? <AppText size={12} color="#c23566" style={{ textAlign: 'right' }}>{error}</AppText> : null}

        <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
          <Button label="إلغاء" variant="secondary" onPress={close} style={{ flex: 1 }} />
          <Button label="تحويل" onPress={confirm} style={{ flex: 1 }} />
        </View>
      </View>
    </CenterModal>
  );
}
