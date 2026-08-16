import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { AllTransactionsScreen } from '../screens/AllTransactionsScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MainTabParamList } from './types';
import { TabBar } from './TabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="AnalyticsTab" component={AnalyticsScreen} />
      <Tab.Screen name="TransactionsTab" component={AllTransactionsScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
