import React, { useRef, useState } from 'react';
import { Animated, Easing, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, CenterModal, ScreenHeader, Tag } from '../components';
import { IconCheck, IconCompass } from '../components/Icons';
import { loanDetail, loanHasPayments, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { LoanParticipant } from '../data/types';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootScreenProps } from '../navigation/types';

const CELL = 30;

export function LoanDetailScreen({ route, navigation }: RootScreenProps<'LoanDetail'>) {
  const { loanId } = route.params;
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const fmt = useFmt(state);
  const [showLottery, setShowLottery] = useState(false);

  const detail = loanDetail(state, loanId);
  if (!detail) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="السلفة" onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title={detail.loan.name} onBack={() => navigation.goBack()} subtitle={`${detail.rangeLabel} · ${detail.freqLabel} · ${detail.periodCountLabel}`} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40, gap: 16 }}>
        <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>المبلغ الإجمالي</AppText>
            <AppText weight="bold" size={16} style={{ marginTop: 4 }}>{fmt(detail.loan.totalAmount)}</AppText>
          </Card>
          <Card style={{ flex: 1 }}>
            <AppText size={11} opacity={0.6}>عدد المشاركين</AppText>
            <AppText weight="bold" size={16} style={{ marginTop: 4 }}>{detail.loan.participants.length}</AppText>
          </Card>
        </View>

        <Button label={detail.hasOrder ? 'إعادة القرعة' : 'قرعة الترتيب'} variant="secondary" onPress={() => setShowLottery(true)} />

        {detail.hasOrder ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: rowDir('ar'), gap: 8 }}>
            {detail.orderList.map((o) => (
              <Tag key={o.rank} label={`#${o.rank} ${o.name}`} variant="accent" />
            ))}
          </ScrollView>
        ) : null}

        <View>
          <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>جدول الدفعات</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={{ flexDirection: rowDir('ar') }}>
                <View style={{ width: 110 }} />
                {detail.periods.map((p) => (
                  <View key={p.index} style={{ width: CELL, alignItems: 'center', marginHorizontal: 3 }}>
                    <AppText size={9} opacity={0.55} numberOfLines={1}>{p.label.replace('دفعة ', '').replace('أسبوع ', '')}</AppText>
                  </View>
                ))}
              </View>
              {detail.rows.map((r) => (
                <View key={r.participantId} style={{ flexDirection: rowDir('ar'), alignItems: 'center', paddingVertical: 6 }}>
                  <View style={{ width: 110 }}>
                    <AppText size={11.5} weight="semiBold" numberOfLines={1}>{r.orderLabel} {r.name}</AppText>
                    <AppText size={9.5} opacity={0.5}>{r.progressLabel}</AppText>
                  </View>
                  {r.cells.map((c) => (
                    <TouchableOpacity
                      key={c.periodIndex}
                      onPress={() => dispatch({ type: 'TOGGLE_LOAN_PAYMENT', loanId: detail.loan.id, participantId: r.participantId, periodIndex: c.periodIndex })}
                      style={{
                        width: CELL, height: CELL, marginHorizontal: 3, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: c.paid ? colors.accent : colors.surface,
                        borderWidth: c.paid ? 0 : 1, borderColor: colors.divider,
                      }}
                    >
                      {c.paid ? <IconCheck size={13} /> : null}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <LotteryModal
        visible={showLottery}
        onClose={() => setShowLottery(false)}
        participants={detail.loan.participants}
        hasExistingOrder={detail.hasOrder}
        hasPayments={loanHasPayments(detail.loan)}
        onDone={(order) => dispatch({ type: 'SET_LOAN_ORDER', loanId: detail.loan.id, order })}
      />
    </SafeAreaView>
  );
}

function LotteryModal({
  visible, onClose, participants, hasExistingOrder, hasPayments, onDone,
}: {
  visible: boolean; onClose: () => void; participants: LoanParticipant[]; hasExistingOrder: boolean; hasPayments: boolean;
  onDone: (order: number[]) => void;
}) {
  const { colors } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState<LoanParticipant[]>([]);
  const [confirmNeeded, setConfirmNeeded] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;

  const startSpinAnim = () => {
    spin.setValue(0);
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })).start();
  };

  const run = () => {
    if (hasExistingOrder && hasPayments && !confirmNeeded) { setConfirmNeeded(true); return; }
    setConfirmNeeded(false);
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setSpinning(true);
    setRevealed([]);
    startSpinAnim();
    shuffled.forEach((p, i) => {
      setTimeout(() => {
        setRevealed((r) => [...r, p]);
        if (i === shuffled.length - 1) {
          setTimeout(() => {
            setSpinning(false);
            spin.stopAnimation();
            onDone(shuffled.map((x) => x.id));
          }, 300);
        }
      }, (i + 1) * 450);
    });
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <CenterModal visible={visible} onClose={() => { onClose(); setRevealed([]); setSpinning(false); setConfirmNeeded(false); }}>
      <View style={{ alignItems: 'center', gap: 14 }}>
        <Animated.View style={{ transform: [{ rotate: spinning ? rotate : '0deg' }], width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <IconCompass size={30} />
        </Animated.View>
        <AppText weight="bold" size={16}>قرعة الترتيب</AppText>

        {confirmNeeded ? (
          <View style={{ gap: 10, width: '100%' }}>
            <AppText size={12.5} opacity={0.7} style={{ textAlign: 'center' }}>
              توجد دفعات مسجّلة بناءً على ترتيب القرعة الحالي. إعادة القرعة قد تجعل الترتيب لا يطابق الدفعات المسجّلة. إعادة القرعة؟
            </AppText>
            <Button label="نعم، إعادة القرعة" onPress={run} />
            <Button label="إلغاء" variant="secondary" onPress={() => setConfirmNeeded(false)} />
          </View>
        ) : (
          <>
            <View style={{ width: '100%', gap: 8, minHeight: 30 }}>
              {revealed.map((p, i) => (
                <AnimatedRow key={p.id} rank={i + 1} name={p.name} />
              ))}
            </View>
            <Button label={hasExistingOrder ? 'إعادة القرعة' : 'بدء القرعة'} onPress={run} disabled={spinning} block />
          </>
        )}
      </View>
    </CenterModal>
  );
}

function AnimatedRow({ rank, name }: { rank: number; name: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [opacity]);
  return (
    <Animated.View style={{ opacity, flexDirection: rowDir('ar'), justifyContent: 'space-between', backgroundColor: '#f6f5fb', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 }}>
      <AppText weight="semiBold" size={13}>{name}</AppText>
      <AppText weight="bold" size={13} color="#4632b0">#{rank}</AppText>
    </Animated.View>
  );
}
