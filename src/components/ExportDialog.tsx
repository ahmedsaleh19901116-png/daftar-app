import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { exportTransactionsCsv, exportTransactionsPdf } from '../data/backup';
import { useStoreState } from '../data/store';
import { rowDir } from '../theme/rtl';
import { AppText } from './AppText';
import { Button } from './Button';
import { SegmentedControl } from './SegmentedControl';
import { CenterModal } from './SheetModal';

export function ExportDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const state = useStoreState();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'all'>('month');
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      if (format === 'csv') await exportTransactionsCsv(state, period);
      else await exportTransactionsPdf(state, period);
      onClose();
    } catch {
      Alert.alert('حدث خطأ أثناء التصدير');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenterModal visible={visible} onClose={onClose}>
      <View style={{ gap: 14 }}>
        <AppText weight="bold" size={16} style={{ textAlign: 'right' }}>تصدير التقرير</AppText>
        <View>
          <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>الفترة</AppText>
          <SegmentedControl
            options={[{ key: 'month', label: 'هذا الشهر' }, { key: 'quarter', label: 'آخر 3 أشهر' }, { key: 'all', label: 'كل الفترة' }]}
            value={period}
            onChange={(k) => setPeriod(k as any)}
          />
        </View>
        <View>
          <AppText size={12} weight="semiBold" opacity={0.6} style={{ textAlign: 'right', marginBottom: 6 }}>الصيغة</AppText>
          <SegmentedControl
            options={[{ key: 'csv', label: 'Excel/CSV' }, { key: 'pdf', label: 'PDF' }]}
            value={format}
            onChange={(k) => setFormat(k as any)}
          />
        </View>
        <View style={{ flexDirection: rowDir('ar'), gap: 8 }}>
          <Button label="إلغاء" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
          <Button label="تصدير" onPress={run} loading={loading} style={{ flex: 1 }} />
        </View>
      </View>
    </CenterModal>
  );
}
