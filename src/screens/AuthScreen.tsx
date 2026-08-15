import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { AppText, Button, SegmentedControl } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

export function AuthScreen({ navigation }: RootScreenProps<'Auth'>) {
  const { colors } = useTheme();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const enter = () => navigation.replace('Main');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 }}>
        <View style={{ alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={28} height={28} viewBox="0 0 20 20" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Circle cx={10} cy={10} r={7} />
              <Circle cx={10} cy={10} r={2.5} fill="#ffffff" />
            </Svg>
          </View>
          <AppText weight="extraBold" size={19}>دفتر</AppText>
        </View>

        <View style={{ marginBottom: 20 }}>
          <SegmentedControl
            options={[{ key: 'login', label: 'تسجيل الدخول' }, { key: 'signup', label: 'حساب جديد' }]}
            value={mode}
            onChange={(k) => setMode(k as 'login' | 'signup')}
          />
        </View>

        <AppText weight="bold" size={20} style={{ marginBottom: 16, textAlign: 'right' }}>
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </AppText>

        <Field label="البريد الإلكتروني" placeholder="example@mail.com" keyboardType="email-address" />
        <Field label="كلمة المرور" placeholder="••••••••" secureTextEntry />

        <Button label={mode === 'login' ? 'دخول' : 'إنشاء الحساب'} onPress={enter} size="lg" block style={{ marginTop: 8 }} />
        <Button label="الدخول كزائر" onPress={enter} variant="secondary" block style={{ marginTop: 10 }} />

        <View style={{ flex: 1 }} />

        <TouchableOpacity onPress={() => navigation.navigate('About', { from: 'auth' })} style={{ alignItems: 'center', marginTop: 20 }}>
          <AppText weight="semiBold" size={13} color={colors.accentRamp[700]}>من نحن</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Field({ label, ...rest }: { label: string; [key: string]: any }) {
  const { colors, radius } = useTheme();
  return (
    <View style={{ marginBottom: 14 }}>
      <AppText size={12} weight="semiBold" opacity={0.7} style={{ marginBottom: 6, textAlign: 'right' }}>{label}</AppText>
      <TextInput
        placeholderTextColor={colors.neutral[600]}
        style={{
          backgroundColor: colors.surface, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.divider,
          paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: colors.text, textAlign: 'right',
        }}
        {...rest}
      />
    </View>
  );
}
