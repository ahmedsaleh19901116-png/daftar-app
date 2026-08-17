import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, DateField, EmptyState, ProgressBar, ScreenHeader, SegmentedControl } from '../components';
import { IconClose } from '../components/Icons';
import { loansList, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootStackParamList } from '../navigation/types';
import { LoanFrequency } from '../data/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoansScreen() {
  const navigation = useNavigation<Nav>();
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const fmt = useFmt(state);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState('');
  const [freq, setFreq] = useState<LoanFrequency>('monthly');
  const [participants, setParticipants] = useState([{ name: '', share: '', phone: '' }, { name: '', share: '', phone: '' }]);
  const [error, setError] = useState('');

  const list = loansList(state);

  const updateParticipant = (idx: number, patch: Partial<{ name: string; share: string; phone: string }>) => {
    setParticipants((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const submit = () => {
    const valid = participants.filter((p) => p.name && Number(p.share) > 0);
    if (!name || !(Number(amount) > 0) || !start || !end || valid.length < 2) {
      setError('تحقق من تعبئة كل الحقول ووجود مشاركين صالحين (٢ على الأقل)');
      return;
    }
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRe.test(start) || !dateRe.test(end)) {
      setError('صيغة التاريخ يجب أن تكون YYYY-MM-DD، مثال: 2026-08-16');
      return;
    }
    if (end <= start) {
      setError('تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء');
      return;
    }
    const sharesTotal = valid.reduce((a, p) => a + Number(p.share), 0);
    if (Math.round(sharesTotal) !== Math.round(Number(amount))) {
      setError(`مجموع حصص المشاركين (${fmt(sharesTotal)}) لا يطابق مبلغ السلفة الإجمالي (${fmt(Number(amount))})`);
      return;
    }
    setError('');
    const id = Date.now();
    dispatch({
      type: 'CREATE_SHARED_LOAN', id, name, amount: Number(amount), start, end, freq,
      participants: valid.map((p) => ({ name: p.name, share: Number(p.share), phone: p.phone || undefined })),
    });
    // Simulate OTP-verification-linked invite acceptance for participants added with a phone number.
    valid.forEach((p, i) => {
      if (p.phone) {
        setTimeout(() => dispatch({ type: 'ACCEPT_INVITE', loanId: id, participantId: id + i + 1 }), 4000 + Math.random() * 3000);
      }
    });
    setName(''); setAmount(''); setStart(today()); setEnd(''); setFreq('monthly');
    setParticipants([{ name: '', share: '', phone: '' }, { name: '', share: '', phone: '' }]);
    setShowForm(false);
    navigation.navigate('LoanDetail', { loanId: id });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader
        title="السلف المشتركة"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => setShowForm((s) => !s)}>
            <AppText size={13} weight="bold" color={colors.accentRamp[700]}>{showForm ? 'إغلاق' : '+ سلفة جديدة'}</AppText>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40, gap: 16 }}>
        {showForm ? (
          <Card style={{ gap: 10 }}>
            <TextInput value={name} onChangeText={setName} placeholder="اسم السلفة" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <TextInput value={amount} onChangeText={setAmount} placeholder="المبلغ الإجمالي" keyboardType="numeric" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors, radius)} />
            <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
              <View style={{ flex: 1 }}>
                <DateField value={start} onChange={setStart} placeholder="تاريخ البدء" />
              </View>
              <View style={{ flex: 1 }}>
                <DateField value={end} onChange={setEnd} placeholder="تاريخ الانتهاء" minimumDate={start || undefined} />
              </View>
            </View>
            <SegmentedControl options={[{ key: 'monthly', label: 'شهري' }, { key: 'weekly', label: 'أسبوعي' }]} value={freq} onChange={(f) => setFreq(f as LoanFrequency)} />

            <AppText weight="semiBold" size={12} style={{ textAlign: 'right', marginTop: 4 }}>المشاركون</AppText>
            {participants.map((p, idx) => (
              <View key={idx} style={{ flexDirection: rowDir('ar'), gap: 8, alignItems: 'center' }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AppText size={11} weight="bold" color={colors.accentRamp[700]}>{idx + 1}</AppText>
                </View>
                <TextInput
                  value={p.name} onChangeText={(v) => updateParticipant(idx, { name: v })} placeholder="الاسم"
                  placeholderTextColor={colors.neutral[500]} style={[inputStyle(colors, radius), { flex: 2 }]}
                />
                <TextInput
                  value={p.share} onChangeText={(v) => updateParticipant(idx, { share: v })} placeholder="الحصة" keyboardType="numeric"
                  placeholderTextColor={colors.neutral[500]} style={[inputStyle(colors, radius), { flex: 1 }]}
                />
                <TextInput
                  value={p.phone} onChangeText={(v) => updateParticipant(idx, { phone: v })} placeholder="جوال (اختياري)" keyboardType="phone-pad"
                  placeholderTextColor={colors.neutral[500]} style={[inputStyle(colors, radius), { flex: 1.4 }]}
                />
                {participants.length > 2 ? (
                  <TouchableOpacity onPress={() => setParticipants((rows) => rows.filter((_, i) => i !== idx))} style={{ flexShrink: 0 }}>
                    <IconClose size={16} color={colors.neutral[600]} />
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
            <TouchableOpacity onPress={() => setParticipants((rows) => [...rows, { name: '', share: '', phone: '' }])}>
              <AppText size={12} weight="semiBold" color={colors.accentRamp[700]} style={{ textAlign: 'right' }}>+ مشارك آخر</AppText>
            </TouchableOpacity>

            {error ? <AppText size={11.5} color="#c23566" style={{ textAlign: 'right' }}>{error}</AppText> : null}
            <Button label="إنشاء السلفة" onPress={submit} />
          </Card>
        ) : null}

        {list.length === 0 ? <EmptyState text="لا توجد سلف مشتركة بعد" /> : (
          <View style={{ gap: 10 }}>
            {list.map((l) => (
              <TouchableOpacity key={l.id} onPress={() => navigation.navigate('LoanDetail', { loanId: l.id })}>
                <Card>
                  <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
                    <AppText weight="bold" size={14}>{l.name}</AppText>
                    <AppText weight="bold" size={14}>{fmt(l.totalAmount)}</AppText>
                  </View>
                  <AppText size={11.5} opacity={0.55} style={{ textAlign: 'right', marginTop: 4 }}>
                    {l.freqLabel} · {l.participantsCount} مشاركين
                  </AppText>
                  <View style={{ marginTop: 10 }}>
                    <ProgressBar pct={l.progressPct} />
                    <AppText size={10.5} opacity={0.55} style={{ textAlign: 'right', marginTop: 4 }}>{l.progressLabel}</AppText>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function inputStyle(colors: any, radius: any) {
  return { backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' as const };
}
