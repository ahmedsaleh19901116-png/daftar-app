import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText, Button, CategoryIcon, SegmentedControl, SheetModal } from '../components';
import { IconClose } from '../components/Icons';
import { allExpenseCats } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { EXPENSE_GROUP_ORDER, INCOME_CATS } from '../data/constants';
import { categoryPalette, expenseGroups } from '../theme/tokens';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { ICON_KEYS } from '../data/constants';

export function AddEditTransactionSheet() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors, radius } = useTheme();
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('tag');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const close = () => { setShowNewCat(false); dispatch({ type: 'CLOSE_ADD' }); };
  const cats = state.addType === 'expense' ? allExpenseCats(state) : INCOME_CATS;
  const canSave = !!state.addCategoryId && Number(state.addAmount) > 0;
  const isEditing = !!state.editingId;

  const selectedCat = cats.find((c) => c.id === state.addCategoryId);
  const activeGroup = expandedGroup ?? selectedCat?.group ?? EXPENSE_GROUP_ORDER[0];

  const startVoice = () => {
    dispatch({ type: 'START_VOICE_INPUT' });
    setTimeout(() => {
      const samples = [
        { amount: '25000', categoryId: 'generator', note: 'مولدة أهلية', phrase: 'سجلت 25 ألف مولدة' },
        { amount: '50000', categoryId: 'topup', note: 'كارت شحن موبايل', phrase: 'دفعت 50 ألف كارت شحن' },
        { amount: '5000', categoryId: 'taxi', note: 'تكسي', phrase: 'دفعت 5 آلاف تكسي' },
      ];
      const sample = samples[Math.floor(Math.random() * samples.length)];
      dispatch({ type: 'APPLY_VOICE_RESULT', amount: sample.amount, txType: 'expense', categoryId: sample.categoryId, note: sample.note });
      setExpandedGroup(cats.find((c) => c.id === sample.categoryId)?.group ?? null);
    }, 1800);
  };

  return (
    <SheetModal visible={state.showAdd} onClose={close}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 36 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <AppText weight="bold" size={18}>{isEditing ? 'تعديل عملية' : 'إضافة عملية'}</AppText>
          <TouchableOpacity onPress={close} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
            <IconClose size={16} color={colors.accentRamp[700]} />
          </TouchableOpacity>
        </View>

        <SegmentedControl
          options={[{ key: 'expense', label: 'مصروف' }, { key: 'income', label: 'دخل' }]}
          value={state.addType}
          onChange={(k) => dispatch({ type: 'SET_ADD_FORM', patch: { addType: k as any, addCategoryId: null } })}
        />

        <View style={{ marginTop: 18 }}>
          <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>المبلغ</AppText>
          <View style={{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 10 }}>
            <TextInput
              value={state.addAmount}
              onChangeText={(v) => dispatch({ type: 'SET_ADD_FORM', patch: { addAmount: v } })}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.neutral[500]}
              style={{ flex: 1, fontSize: 26, fontWeight: '700' as any, color: colors.text, textAlign: 'right', paddingVertical: 8 }}
            />
            {!isEditing ? (
              <TouchableOpacity
                onPress={startVoice}
                disabled={state.voiceListening}
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: state.voiceListening ? '#ff5470' : colors.accent, alignItems: 'center', justifyContent: 'center' }}
              >
                <AppText size={18}>🎙️</AppText>
              </TouchableOpacity>
            ) : null}
          </View>
          {state.voiceListening ? (
            <AppText size={11.5} color="#ff5470" style={{ textAlign: 'right', marginTop: 6 }}>
              ● يستمع الآن... جرّب: "دفعت 25 ألف بنزين"
            </AppText>
          ) : null}
        </View>

        {!isEditing ? (
          <View style={{ marginTop: 16, gap: 10 }}>
            <SegmentedControl
              options={[{ key: 'IQD', label: 'د.ع' }, { key: 'USD', label: '$' }]}
              value={state.addCurrency}
              onChange={(k) => dispatch({ type: 'SET_ADD_FORM', patch: { addCurrency: k as any } })}
            />
            <View>
              <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>مكان الصرف/الاستلام</AppText>
              <SegmentedControl
                options={state.accounts.map((a) => ({ key: a.id, label: a.icon + ' ' + a.name }))}
                value={state.addAccountId}
                onChange={(k) => dispatch({ type: 'SET_ADD_FORM', patch: { addAccountId: k } })}
              />
            </View>
          </View>
        ) : null}

        <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginTop: 16, marginBottom: 10 }}>الفئة</AppText>

        {state.addType === 'expense' ? (
          <View style={{ gap: 8 }}>
            {EXPENSE_GROUP_ORDER.map((gid) => {
              const meta = expenseGroups[gid];
              const groupCats = cats.filter((c) => (c.group || 'other') === gid);
              if (!groupCats.length) return null;
              const expanded = activeGroup === gid;
              const selectedInGroup = groupCats.find((c) => c.id === state.addCategoryId);
              return (
                <View key={gid} style={{ borderRadius: radius.sm, overflow: 'hidden', backgroundColor: meta.bg }}>
                  <TouchableOpacity
                    onPress={() => setExpandedGroup(expanded ? null : gid)}
                    style={{ flexDirection: rowDir('ar'), alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 14 }}
                  >
                    <AppText size={12} color={meta.fg}>{expanded ? '▾' : '◂'}</AppText>
                    <AppText size={12.5} weight="semiBold" color={meta.fg} style={{ flex: 1, textAlign: 'right', marginRight: 8 }} numberOfLines={1}>
                      {selectedInGroup ? selectedInGroup.name : groupCats.length + ' فئة'}
                    </AppText>
                    <AppText weight="bold" size={13} color={meta.fg}>{meta.name}</AppText>
                  </TouchableOpacity>
                  {expanded ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end', backgroundColor: colors.surface, padding: 12 }}>
                      {groupCats.map((c) => {
                        const selected = c.id === state.addCategoryId;
                        return (
                          <TouchableOpacity
                            key={c.id}
                            onPress={() => dispatch({ type: 'SET_ADD_FORM', patch: { addCategoryId: c.id } })}
                            style={{
                              width: '30%', alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: radius.sm,
                              backgroundColor: meta.bg, borderWidth: 2, borderColor: selected ? colors.accent : 'transparent',
                              transform: [{ scale: selected ? 1.04 : 1 }],
                            }}
                          >
                            <CategoryIcon icon={c.icon} size={28} />
                            <AppText size={10.5} weight={selected ? 'bold' : 'medium'} numberOfLines={1}>{c.name}</AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
            <TouchableOpacity
              onPress={() => setShowNewCat((s) => !s)}
              style={{
                alignItems: 'center', justifyContent: 'center', flexDirection: rowDir('ar'), gap: 6, paddingVertical: 12, borderRadius: radius.sm,
                borderWidth: 1.5, borderColor: colors.divider, borderStyle: 'dashed', marginTop: 4,
              }}
            >
              <AppText size={16} color={colors.accent}>+</AppText>
              <AppText size={12} weight="medium">فئة جديدة</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end' }}>
            {cats.map((c) => {
              const selected = c.id === state.addCategoryId;
              const bg = categoryPalette[c.icon]?.bg ?? categoryPalette.tag.bg;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => dispatch({ type: 'SET_ADD_FORM', patch: { addCategoryId: c.id } })}
                  style={{
                    width: '22%', alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: radius.sm,
                    backgroundColor: bg, borderWidth: 2, borderColor: selected ? colors.accent : 'transparent',
                    transform: [{ scale: selected ? 1.04 : 1 }],
                  }}
                >
                  <CategoryIcon icon={c.icon} size={30} />
                  <AppText size={11} weight={selected ? 'bold' : 'medium'} numberOfLines={1}>{c.name}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {showNewCat ? (
          <View style={{ marginTop: 14, backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12 }}>
            <TextInput
              value={newCatName}
              onChangeText={setNewCatName}
              placeholder="اسم الفئة"
              placeholderTextColor={colors.neutral[600]}
              style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 10, textAlign: 'right', marginBottom: 10 }}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', marginBottom: 10 }}>
              {ICON_KEYS.map((k) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => setNewCatIcon(k)}
                  style={{ padding: 6, borderRadius: 10, backgroundColor: k === newCatIcon ? colors.accent : colors.surface }}
                >
                  <CategoryIcon icon={k} size={26} tile={false} />
                </TouchableOpacity>
              ))}
            </View>
            <Button
              label="إضافة الفئة"
              onPress={() => {
                dispatch({ type: 'ADD_EXPENSE_CATEGORY', name: newCatName, icon: newCatIcon });
                setNewCatName(''); setNewCatIcon('tag'); setShowNewCat(false);
              }}
            />
          </View>
        ) : null}

        <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginTop: 18, marginBottom: 6 }}>ملاحظة</AppText>
        <TextInput
          value={state.addNote}
          onChangeText={(v) => dispatch({ type: 'SET_ADD_FORM', patch: { addNote: v } })}
          placeholder={state.addType === 'income' ? 'مثال: راتب شهر آب' : 'مثال: غداء عمل'}
          placeholderTextColor={colors.neutral[500]}
          style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' }}
        />

        <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginTop: 14, marginBottom: 6 }}>التاريخ</AppText>
        <TextInput
          value={state.addDate}
          onChangeText={(v) => dispatch({ type: 'SET_ADD_FORM', patch: { addDate: v } })}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.neutral[500]}
          style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' }}
        />

        <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginTop: 14, marginBottom: 6 }}>طريقة الدفع</AppText>
        <SegmentedControl
          options={[{ key: 'cash', label: 'كاش' }, { key: 'debt', label: 'دين' }]}
          value={state.addMethod}
          onChange={(k) => dispatch({ type: 'SET_ADD_FORM', patch: { addMethod: k as any } })}
        />
        {state.addMethod === 'debt' ? (
          <View style={{ marginTop: 12 }}>
            <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>الجهة / الشخص</AppText>
            <TextInput
              value={state.addPerson}
              onChangeText={(v) => dispatch({ type: 'SET_ADD_FORM', patch: { addPerson: v } })}
              placeholder="اسم الشخص أو الجهة"
              placeholderTextColor={colors.neutral[500]}
              style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12, textAlign: 'right' }}
            />
          </View>
        ) : null}

        <Button
          label={isEditing ? 'حفظ التعديلات' : 'حفظ العملية'}
          onPress={() => dispatch({ type: 'SAVE_TRANSACTION' })}
          block size="lg"
          style={{ marginTop: 22 }}
        />
        {!canSave ? (
          <AppText size={11} opacity={0.5} style={{ textAlign: 'center', marginTop: 8 }}>
            أدخل المبلغ واختر الفئة لتفعيل الحفظ
          </AppText>
        ) : null}
        {isEditing ? (
          <Button label="حذف العملية" variant="danger" block style={{ marginTop: 10 }} onPress={() => dispatch({ type: 'DELETE_TRANSACTION' })} />
        ) : null}
      </ScrollView>
    </SheetModal>
  );
}
