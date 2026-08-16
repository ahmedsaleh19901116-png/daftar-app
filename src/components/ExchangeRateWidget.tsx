import React from 'react';
import { View } from 'react-native';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { rowDir } from '../theme/rtl';
import { AppText } from './AppText';
import { Card } from './Card';

export function ExchangeRateWidget() {
  const { data, loading, isStale } = useExchangeRate();

  if (loading && !data) {
    return (
      <Card>
        <AppText size={12} opacity={0.55} style={{ textAlign: 'center' }}>جاري تحميل سعر الصرف...</AppText>
      </Card>
    );
  }

  if (!data) {
    return null; // لا تعرض شي لو ما فيه بيانات إطلاقاً (بدل رسالة خطأ مربكة)
  }

  return (
    <Card style={{ gap: 8 }}>
      <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
        <AppText size={12} opacity={0.6}>الرسمي</AppText>
        <AppText size={13.5} weight="bold">{data.official.toLocaleString('ar-IQ')} د.ع</AppText>
      </View>
      <View style={{ flexDirection: rowDir('ar'), justifyContent: 'space-between' }}>
        <AppText size={12} opacity={0.6}>الموازي</AppText>
        <AppText size={13.5} weight="bold">{data.parallel.toLocaleString('ar-IQ')} د.ع</AppText>
      </View>
      {isStale ? (
        <AppText size={11} color="#c98a1f" style={{ textAlign: 'center', marginTop: 4 }}>
          ⚠ آخر تحديث أقدم من يوم
        </AppText>
      ) : null}
    </Card>
  );
}
