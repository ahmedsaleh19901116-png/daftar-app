import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AboutScreen } from '../screens/AboutScreen';
import { AssistantScreen } from '../screens/AssistantScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { CharityScreen } from '../screens/CharityScreen';
import { DebtsScreen } from '../screens/DebtsScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { IncomeScreen } from '../screens/IncomeScreen';
import { InstallmentDetailScreen } from '../screens/InstallmentDetailScreen';
import { InstallmentsScreen } from '../screens/InstallmentsScreen';
import { LoanDetailScreen } from '../screens/LoanDetailScreen';
import { LoansScreen } from '../screens/LoansScreen';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';
import { ReferralScreen } from '../screens/ReferralScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { WidgetSetupScreen } from '../screens/WidgetSetupScreen';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_left' }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Income" component={IncomeScreen} />
      <Stack.Screen name="Tips" component={TipsScreen} />
      <Stack.Screen name="Debts" component={DebtsScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen name="Loans" component={LoansScreen} />
      <Stack.Screen name="LoanDetail" component={LoanDetailScreen} />
      <Stack.Screen name="Installments" component={InstallmentsScreen} />
      <Stack.Screen name="InstallmentDetail" component={InstallmentDetailScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="Charity" component={CharityScreen} />
      <Stack.Screen name="Assistant" component={AssistantScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="WidgetSetup" component={WidgetSetupScreen} />
    </Stack.Navigator>
  );
}
