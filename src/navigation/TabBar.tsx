import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, IconChart, IconGear, IconHome, IconList, IconPlus } from '../components';
import { useDispatch } from '../data/store';
import { useTheme } from '../theme/ThemeContext';

const TAB_META: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  HomeTab: { label: 'الرئيسية', Icon: IconHome },
  AnalyticsTab: { label: 'التحليلات', Icon: IconChart },
  TransactionsTab: { label: 'العمليات', Icon: IconList },
  SettingsTab: { label: 'حسابي', Icon: IconGear },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, shadow } = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const routes = state.routes.filter((r) => r.name !== 'AddTab');
  const leftRoutes = routes.slice(0, 2);
  const rightRoutes = routes.slice(2);

  const renderTab = (route: (typeof routes)[number]) => {
    const meta = TAB_META[route.name];
    if (!meta) return null;
    const routeIndex = state.routes.findIndex((r) => r.key === route.key);
    const focused = state.index === routeIndex;
    const { Icon, label } = meta;
    return (
      <TouchableOpacity
        key={route.key}
        onPress={() => navigation.navigate(route.name)}
        activeOpacity={0.8}
        style={{ flex: 1, alignItems: 'center', minWidth: 0 }}
      >
        <View
          style={{
            alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 6, paddingHorizontal: 4,
            borderRadius: 16, backgroundColor: focused ? colors.accentTint : 'transparent', width: '92%',
          }}
        >
          <Icon size={19} color={focused ? colors.accentRamp[700] : colors.text} />
          <AppText size={9.5} weight={focused ? 'bold' : 'medium'} color={focused ? colors.accentRamp[700] : colors.text} opacity={focused ? 1 : 0.55} numberOfLines={1}>
            {label}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingBottom: insets.bottom, paddingHorizontal: 16, alignItems: 'center' }}>
      <View style={{ width: '100%', position: 'relative' }}>
        <View
          style={[
            {
              flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
              borderRadius: 28, paddingVertical: 6, paddingHorizontal: 8, marginBottom: 8,
            },
            shadow.lg,
          ]}
        >
          {leftRoutes.map(renderTab)}
          <View style={{ width: 64 }} />
          {rightRoutes.map(renderTab)}
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => dispatch({ type: 'OPEN_ADD', txType: 'expense' })}
          style={[
            {
              position: 'absolute', alignSelf: 'center', top: -22, width: 56, height: 56, borderRadius: 28,
              backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
            },
            shadow.md,
          ]}
        >
          <IconPlus size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
