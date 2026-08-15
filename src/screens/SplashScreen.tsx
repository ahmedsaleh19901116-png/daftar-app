import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

export function SplashScreen({ navigation }: RootScreenProps<'Splash'>) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    const timer = setTimeout(() => navigation.replace('Auth'), 1700);
    return () => clearTimeout(timer);
  }, [navigation, opacity]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Animated.View style={{ opacity, alignItems: 'center', gap: 16 }}>
        <View style={{ width: 88, height: 88, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={42} height={42} viewBox="0 0 20 20" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx={10} cy={10} r={7} />
            <Circle cx={10} cy={10} r={2.5} fill="#ffffff" />
          </Svg>
        </View>
        <AppText weight="extraBold" size={24}>دفتر</AppText>
        <AppText size={13} opacity={0.6}>إدارة مصاريفك ودخلك بذكاء</AppText>
      </Animated.View>
    </View>
  );
}
