import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useStoreState } from '../data/store';
import { rowDir } from '../theme/rtl';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';
import { SegmentedControl } from './SegmentedControl';
import { CenterModal } from './SheetModal';
import { Tag } from './Tag';

export type ToolsTab = 'currency' | 'unit' | 'calc';

const UNIT_GROUPS: Record<'length' | 'weight', { label: string; units: Record<string, number> }> = {
  length: { label: 'الطول', units: { km: 1, mile: 1.60934, m: 0.001, ft: 0.0003048 } },
  weight: { label: 'الوزن', units: { kg: 1, lb: 0.453592, g: 0.001, oz: 0.0283495 } },
};

const CALC_KEYS = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'];

export function ToolsModal({ visible, initialTab, onClose }: { visible: boolean; initialTab: ToolsTab; onClose: () => void }) {
  const state = useStoreState();
  const { colors, radius } = useTheme();
  const [tab, setTab] = useState<ToolsTab>(initialTab);

  const [convFrom, setConvFrom] = useState<'IQD' | 'USD'>('IQD');
  const [convTo, setConvTo] = useState<'IQD' | 'USD'>('USD');
  const [convAmount, setConvAmount] = useState('');

  const [unitCategory, setUnitCategory] = useState<'length' | 'weight'>('length');
  const [unitFrom, setUnitFrom] = useState('km');
  const [unitTo, setUnitTo] = useState('mile');
  const [unitAmount, setUnitAmount] = useState('');

  const [calcExpr, setCalcExpr] = useState('');

  useEffect(() => {
    if (visible) setTab(initialTab);
  }, [visible, initialTab]);

  const swapConv = () => { setConvFrom(convTo); setConvTo(convFrom); };
  const convResult = (() => {
    const amount = Number(convAmount) || 0;
    if (convFrom === convTo) return amount;
    if (convFrom === 'IQD' && convTo === 'USD') return amount / state.usdParallel;
    if (convFrom === 'USD' && convTo === 'IQD') return amount * state.usdParallel;
    return amount;
  })();

  const changeUnitCategory = (cat: 'length' | 'weight') => {
    const first = Object.keys(UNIT_GROUPS[cat].units);
    setUnitCategory(cat);
    setUnitFrom(first[0]);
    setUnitTo(first[1]);
  };
  const unitResult = (() => {
    const units = UNIT_GROUPS[unitCategory].units;
    const amount = Number(unitAmount) || 0;
    return (amount * units[unitFrom]) / units[unitTo];
  })();

  const calcPress = (key: string) => {
    setCalcExpr((expr) => {
      if (key === 'C') return '';
      if (key === '=') {
        try {
          const safe = expr.replace(/[^0-9.+\-*/() ]/g, '');
          const result = Function('"use strict";return (' + safe + ')')();
          return Number.isFinite(result) ? String(Math.round(result * 1e6) / 1e6) : 'خطأ';
        } catch {
          return 'خطأ';
        }
      }
      return expr + key;
    });
  };

  return (
    <CenterModal visible={visible} onClose={onClose}>
      <View style={{ gap: 14 }}>
        <AppText weight="bold" size={16} style={{ textAlign: 'right' }}>أدوات التحويل</AppText>

        <SegmentedControl
          options={[{ key: 'currency', label: 'عملات' }, { key: 'unit', label: 'وحدات' }, { key: 'calc', label: 'حاسبة' }]}
          value={tab}
          onChange={(k) => setTab(k as ToolsTab)}
        />

        {tab === 'currency' ? (
          <View style={{ gap: 10 }}>
            <View>
              <AppText size={11} opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>من</AppText>
              <SegmentedControl
                options={[{ key: 'IQD', label: '🇮🇶 د.ع' }, { key: 'USD', label: '🇺🇸 $' }]}
                value={convFrom}
                onChange={(k) => setConvFrom(k as any)}
              />
              <TextInput
                value={convAmount}
                onChangeText={setConvAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.neutral[500]}
                style={{ marginTop: 8, fontSize: 20, fontWeight: '700' as any, color: colors.text, textAlign: 'right', backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 10 }}
              />
            </View>

            <TouchableOpacity
              onPress={swapConv}
              style={{ alignSelf: 'center', width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}
            >
              <AppText color={colors.accentRamp[700]}>⇄</AppText>
            </TouchableOpacity>

            <View>
              <AppText size={11} opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>إلى</AppText>
              <SegmentedControl
                options={[{ key: 'IQD', label: '🇮🇶 د.ع' }, { key: 'USD', label: '🇺🇸 $' }]}
                value={convTo}
                onChange={(k) => setConvTo(k as any)}
              />
              <View style={{ marginTop: 8, backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 10 }}>
                <AppText weight="bold" size={20} style={{ textAlign: 'right' }}>
                  {convResult.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </AppText>
              </View>
            </View>
          </View>
        ) : null}

        {tab === 'unit' ? (
          <View style={{ gap: 10 }}>
            <SegmentedControl
              options={[{ key: 'length', label: 'الطول' }, { key: 'weight', label: 'الوزن' }]}
              value={unitCategory}
              onChange={(k) => changeUnitCategory(k as any)}
            />
            <TextInput
              value={unitAmount}
              onChangeText={setUnitAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.neutral[500]}
              style={{ fontSize: 20, fontWeight: '700' as any, color: colors.text, textAlign: 'right', backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 10 }}
            />
            <View>
              <AppText size={11} opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>من</AppText>
              <View style={{ flexDirection: rowDir('ar'), gap: 8, flexWrap: 'wrap' }}>
                {Object.keys(UNIT_GROUPS[unitCategory].units).map((u) => (
                  <Tag key={u} label={u} variant={u === unitFrom ? 'accent' : 'outline'} onPress={() => setUnitFrom(u)} />
                ))}
              </View>
            </View>
            <View>
              <AppText size={11} opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>إلى</AppText>
              <View style={{ flexDirection: rowDir('ar'), gap: 8, flexWrap: 'wrap' }}>
                {Object.keys(UNIT_GROUPS[unitCategory].units).map((u) => (
                  <Tag key={u} label={u} variant={u === unitTo ? 'accent' : 'outline'} onPress={() => setUnitTo(u)} />
                ))}
              </View>
            </View>
            <View style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 10 }}>
              <AppText weight="bold" size={20} style={{ textAlign: 'right' }}>
                {unitResult.toLocaleString('en-US', { maximumFractionDigits: 4 }) + ' ' + unitTo}
              </AppText>
            </View>
          </View>
        ) : null}

        {tab === 'calc' ? (
          <View style={{ gap: 10 }}>
            <View style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 16, direction: 'ltr' as any }}>
              <AppText weight="bold" size={26} style={{ textAlign: 'left' }}>{calcExpr || '0'}</AppText>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, direction: 'ltr' as any }}>
              {CALC_KEYS.map((k) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => calcPress(k)}
                  style={{ width: '22.5%', paddingVertical: 14, borderRadius: radius.sm, backgroundColor: colors.neutral[200], alignItems: 'center' }}
                >
                  <AppText weight="bold" size={16}>{k}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </CenterModal>
  );
}
