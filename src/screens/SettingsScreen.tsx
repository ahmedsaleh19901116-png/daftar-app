import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, CenterModal, ExportDialog, SegmentedControl, ToggleSwitch, TransferDialog } from '../components';
import { IconUser } from '../components/Icons';
import { exportBackup, importBackup, runPeriodReset } from '../data/backup';
import { accountBalanceRows, useFmt } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { CurrencyPickerSheet } from '../sheets/CurrencyPickerSheet';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const RESET_LABELS: Record<string, string> = { monthly: 'شهري', quarterly: 'كل 3 أشهر', yearly: 'سنوي', manual: 'يدوي فقط' };

export function SettingsScreen() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const { colors, radius } = useTheme();
  const [showCurrency, setShowCurrency] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const fmt = useFmt(state);
  const accountRows = accountBalanceRows(state, fmt);

  const currencyName = state.selectedCurrency ? state.selectedCurrency.name : 'دينار عراقي';

  const onExport = async () => {
    try { await exportBackup(state); } catch { Alert.alert('حدث خطأ أثناء التصدير'); }
  };
  const onImport = async () => {
    try {
      const payload = await importBackup();
      if (payload) dispatch({ type: 'IMPORT_STATE', payload });
    } catch { Alert.alert('ملف غير صالح'); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 16 }}>
        <AppText weight="bold" size={22}>الإعدادات</AppText>

        <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 12 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
            <IconUser size={26} color={colors.accentRamp[700]} />
          </View>
          <View>
            <AppText weight="bold" size={15}>مستخدم دفتر</AppText>
            <AppText size={12} opacity={0.5}>guest@daftar.app</AppText>
          </View>
        </View>

        <View style={{ flexDirection: rowDir('ar'), gap: 10 }}>
          {accountRows.map((a) => (
            <Card key={a.id} style={{ flex: 1, gap: 2 }}>
              <AppText size={11} opacity={0.6}>{a.icon} {a.name}</AppText>
              <AppText weight="bold" size={15}>{a.balanceLabel}</AppText>
            </Card>
          ))}
        </View>

        <Card style={{ gap: 0 }}>
          <Row label="تحويل بين الحسابات" onPress={() => setShowTransfer(true)} right={<AppText size={14} opacity={0.5}>⇄</AppText>} />
        </Card>

        <Card style={{ gap: 0 }}>
          <Row label="العملة" onPress={() => setShowCurrency(true)} right={<AppText size={12.5} opacity={0.6}>{currencyName}</AppText>} />
          <Divider />
          <Row label="اللغة" custom>
            <SegmentedControl
              options={[{ key: 'ar', label: 'العربية' }, { key: 'en', label: 'English' }]}
              value={state.lang}
              onChange={(l) => dispatch({ type: 'SET_LANG', lang: l as any })}
            />
          </Row>
          <Divider />
          <Row label="الإشعارات" right={<ToggleSwitch value={state.notificationsOn} onChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })} />} />
          <Divider />
          <Row label="الوضع الليلي" right={<ToggleSwitch value={state.darkMode} onChange={() => dispatch({ type: 'TOGGLE_DARK_MODE' })} />} />
        </Card>

        <Card style={{ gap: 0 }}>
          <Row label="الصدقة التلقائية" right={<ToggleSwitch value={state.charityEnabled} onChange={() => dispatch({ type: 'TOGGLE_CHARITY_ENABLED' })} />} />
          {state.charityEnabled ? (
            <>
              <Divider />
              <Row label="النسبة" custom>
                <TextInput
                  value={String(state.charityPercent)}
                  onChangeText={(v) => dispatch({ type: 'SET_CHARITY_PERCENT', value: Number(v) || 0 })}
                  keyboardType="numeric"
                  style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 8, width: 70, textAlign: 'center' }}
                />
              </Row>
              <Divider />
              <Row label="سجل الصدقة" onPress={() => navigation.navigate('Charity')} right={<AppText size={12} color={colors.accentRamp[700]}>عرض ›</AppText>} />
            </>
          ) : null}
        </Card>

        <Card style={{ gap: 0 }}>
          <Row label="ويدجت الشاشة الرئيسية" onPress={() => navigation.navigate('WidgetSetup')} right={<AppText size={14} opacity={0.4}>›</AppText>} />
          <Divider />
          <Row label="ادعُ صديق" onPress={() => navigation.navigate('Referral')} right={<AppText size={14} opacity={0.4}>›</AppText>} />
          <Divider />
          <Row label="طرق الدفع" onPress={() => navigation.navigate('PaymentMethods')} right={<AppText size={14} opacity={0.4}>›</AppText>} />
          <Divider />
          <Row label="تصدير التقرير" onPress={() => setShowExport(true)} right={<AppText size={14} opacity={0.5}>⬇</AppText>} />
          <Divider />
          <Row
            label="قفل التطبيق برمز سري"
            right={<ToggleSwitch value={state.pinEnabled} onChange={() => dispatch({ type: 'TOGGLE_PIN_ENABLED' })} />}
          />
          {state.pinEnabled ? (
            <>
              <Divider />
              <View style={{ paddingVertical: 10 }}>
                <Button label="🔒 قفل التطبيق الآن (تجربة)" variant="secondary" onPress={() => dispatch({ type: 'LOCK_APP_NOW' })} />
              </View>
            </>
          ) : null}
          <Divider />
          <Row
            label="تصفير الحركات وبدء سجل جديد"
            onPress={() => setShowReset(true)}
            right={<AppText size={10} weight="semiBold" color={colors.accentRamp[700]} style={{ backgroundColor: colors.accentTint, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>{RESET_LABELS[state.resetFrequency]}</AppText>}
          />
        </Card>

        <Card style={{ gap: 0 }}>
          <Row label="تصدير نسخة احتياطية" onPress={onExport} />
          <Divider />
          <Row label="استيراد" onPress={onImport} />
        </Card>

        <Card style={{ gap: 0 }}>
          <Row label="من نحن" onPress={() => navigation.navigate('About', { from: 'main' })} />
        </Card>

        <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 14 }} onPress={() => navigation.navigate('Auth' as any)}>
          <AppText weight="bold" size={13} color="#c23566">تسجيل الخروج</AppText>
        </TouchableOpacity>
      </ScrollView>
      <CurrencyPickerSheet visible={showCurrency} onClose={() => setShowCurrency(false)} />
      <TransferDialog visible={showTransfer} onClose={() => setShowTransfer(false)} />
      <ExportDialog visible={showExport} onClose={() => setShowExport(false)} />
      <ResetDialog visible={showReset} onClose={() => setShowReset(false)} />
      <PinSetupDialog />
    </SafeAreaView>
  );
}

function ResetDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const state = useStoreState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const transactions = await runPeriodReset(state);
      dispatch({ type: 'RUN_PERIOD_RESET', transactions });
      onClose();
    } catch {
      Alert.alert('حدث خطأ أثناء التصفير');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenterModal visible={visible} onClose={onClose}>
      <View style={{ gap: 14 }}>
        <AppText weight="bold" size={16} style={{ textAlign: 'right' }}>تصفير الحركات وبدء سجل جديد</AppText>
        <AppText size={12} opacity={0.7} style={{ textAlign: 'right', lineHeight: 20 }}>
          يصدّر كل عملياتك الحالية كملف، ثم يبدأ سجل جديد فارغ مع ترحيل رصيدك الحالي كرصيد افتتاحي. لا يؤثر هذا على
          الديون أو أقساط الزبائن أو السلف المشتركة أو أهداف الادخار — تبقى كما هي.
        </AppText>
        <View>
          <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>دورية التصفير</AppText>
          <SegmentedControl
            options={[{ key: 'monthly', label: 'شهري' }, { key: 'quarterly', label: 'كل 3 أشهر' }, { key: 'yearly', label: 'سنوي' }, { key: 'manual', label: 'يدوي فقط' }]}
            value={state.resetFrequency}
            onChange={(k) => dispatch({ type: 'SET_RESET_FREQUENCY', freq: k as any })}
          />
        </View>
        <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
          <Button label="إلغاء" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
          <Button label="تصدير وبدء من جديد الآن" onPress={run} loading={loading} style={{ flex: 1 }} />
        </View>
      </View>
    </CenterModal>
  );
}

function PinSetupDialog() {
  const state = useStoreState();
  const dispatch = useDispatch();
  return (
    <CenterModal visible={state.pinSetupOpen} onClose={() => dispatch({ type: 'CANCEL_PIN_SETUP' })}>
      <View style={{ gap: 14 }}>
        <AppText weight="bold" size={16} style={{ textAlign: 'right' }}>تعيين رمز سري (4 أرقام)</AppText>
        <View>
          <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>الرمز</AppText>
          <TextInput
            value={state.pinSetupValue}
            onChangeText={(v) => dispatch({ type: 'SET_PIN_SETUP_VALUE', value: v })}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            placeholder="••••"
            style={{ letterSpacing: 8, textAlign: 'center', fontSize: 22, borderBottomWidth: 1, paddingVertical: 8 }}
          />
        </View>
        {state.pinError ? <AppText size={12} color="#c23566" style={{ textAlign: 'right' }}>{state.pinError}</AppText> : null}
        <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
          <Button label="إلغاء" variant="secondary" onPress={() => dispatch({ type: 'CANCEL_PIN_SETUP' })} style={{ flex: 1 }} />
          <Button label="حفظ" onPress={() => dispatch({ type: 'CONFIRM_PIN_SETUP' })} style={{ flex: 1 }} />
        </View>
      </View>
    </CenterModal>
  );
}

function Row({ label, right, onPress, custom, children }: { label: string; right?: React.ReactNode; onPress?: () => void; custom?: boolean; children?: React.ReactNode }) {
  const Comp: any = onPress ? TouchableOpacity : View;
  return (
    <Comp onPress={onPress} style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13 }}>
      <AppText size={13.5} weight="semiBold">{label}</AppText>
      {custom ? children : right}
    </Comp>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.divider }} />;
}
