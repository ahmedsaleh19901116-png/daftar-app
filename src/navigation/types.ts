import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  About: { from: 'auth' | 'main' };
  Main: undefined;
  Income: undefined;
  Tips: undefined;
  Debts: undefined;
  Tasks: undefined;
  Loans: undefined;
  LoanDetail: { loanId: number };
  Installments: undefined;
  InstallmentDetail: { planId: number };
  Goals: undefined;
  Charity: undefined;
  Assistant: undefined;
  Referral: undefined;
  PaymentMethods: undefined;
  WidgetSetup: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type MainTabParamList = {
  HomeTab: undefined;
  AnalyticsTab: undefined;
  TransactionsTab: undefined;
  SettingsTab: undefined;
};
