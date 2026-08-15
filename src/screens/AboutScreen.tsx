import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, ScreenHeader } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

export function AboutScreen({ navigation }: RootScreenProps<'About'>) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="من نحن" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Card>
          <AppText weight="bold" size={16} style={{ marginBottom: 8, textAlign: 'right' }}>دفتر</AppText>
          <AppText size={13} opacity={0.75} style={{ textAlign: 'right', lineHeight: 22 }}>
            دفتر تطبيق شخصي لإدارة المصاريف والدخل، يساعدك على متابعة إنفاقك اليومي، ميزانيتك الشهرية، الديون
            المتبادلة، السلف المشتركة مع الزملاء والأصدقاء، أهداف الادخار، والمهام المالية — كل ذلك في مكان واحد
            بواجهة عربية بسيطة.
          </AppText>
        </Card>
        <Card>
          <AppText weight="bold" size={14} style={{ marginBottom: 6, textAlign: 'right' }}>الخصوصية</AppText>
          <AppText size={13} opacity={0.75} style={{ textAlign: 'right', lineHeight: 22 }}>
            بياناتك تبقى على جهازك ما لم تفعّل مزامنة سحابية. يمكنك تصدير نسخة احتياطية من الإعدادات في أي وقت.
          </AppText>
        </Card>
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <AppText size={11} opacity={0.4}>الإصدار 1.0.0</AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
