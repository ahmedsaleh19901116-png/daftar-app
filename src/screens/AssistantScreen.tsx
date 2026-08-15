import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, ScreenHeader } from '../components';
import { assistantInsightRows, useFmt } from '../data/selectors';
import { useStoreState } from '../data/store';
import { rowDir } from '../theme/rtl';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

export function AssistantScreen({ navigation }: RootScreenProps<'Assistant'>) {
  const state = useStoreState();
  const { colors } = useTheme();
  const fmt = useFmt(state);
  const insights = assistantInsightRows(state, fmt);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="المساعد المالي الذكي" subtitle="تحليل تلقائي لحركاتك وتذكير بما يحتاج انتباهك" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 10 }}>
        {insights.map((ins, i) => (
          <Card key={i} style={{ flexDirection: rowDir('ar'), gap: 12, alignItems: 'flex-start' }}>
            <AppText size={22}>{ins.icon}</AppText>
            <View style={{ flex: 1 }}>
              <AppText weight="bold" size={13} style={{ textAlign: 'right', marginBottom: 4 }}>{ins.title}</AppText>
              <AppText size={12} opacity={0.7} style={{ textAlign: 'right', lineHeight: 20 }}>{ins.body}</AppText>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
