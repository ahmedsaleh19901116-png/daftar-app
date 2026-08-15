import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold } from '@expo-google-fonts/cairo';
import React from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AddEditTransactionSheet } from './src/sheets/AddEditTransactionSheet';
import { QuickLogSheet } from './src/sheets/QuickLogSheet';
import { AppText } from './src/components';
import { StoreProvider, useDispatch, useStoreState } from './src/data/store';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function LockScreen() {
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  return (
    <View style={{ position: 'absolute', inset: 0, backgroundColor: colors.surface, zIndex: 300, alignItems: 'center', justifyContent: 'center', gap: 16 } as any}>
      <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={26} height={26} viewBox="0 0 20 20" fill="none" stroke="#ffffff" strokeWidth={1.8}>
          <Rect x={3} y={9} width={14} height={8} rx={1} />
          <Path d="M6 9V6a4 4 0 018 0v3" />
        </Svg>
      </View>
      <AppText size={14} opacity={0.7}>أدخل الرمز السري لفتح دفتر</AppText>
      <TextInput
        value={state.pinEntryValue}
        onChangeText={(v) => dispatch({ type: 'SET_PIN_ENTRY_VALUE', value: v })}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        placeholder="••••"
        placeholderTextColor={colors.neutral[500]}
        style={{ letterSpacing: 8, textAlign: 'center', fontSize: 22, width: 140, color: colors.text, borderBottomWidth: 1, borderBottomColor: colors.divider, paddingVertical: 6 }}
      />
      {state.pinError ? <AppText size={12} color="#c23566">{state.pinError}</AppText> : null}
    </View>
  );
}

function Shell() {
  const state = useStoreState();
  const { colors, dark } = useTheme();
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <RootNavigator />
        <AddEditTransactionSheet />
        <QuickLogSheet />
        {state.appLocked ? <LockScreen /> : null}
        <StatusBar style={dark ? 'light' : 'dark'} />
      </View>
    </NavigationContainer>
  );
}

function ThemedShell() {
  const state = useStoreState();
  return (
    <ThemeProvider dark={state.darkMode}>
      <Shell />
    </ThemeProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f5fb' }}>
        <ActivityIndicator color="#6c5ce7" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ThemedShell />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
