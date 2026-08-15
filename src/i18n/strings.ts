export type Lang = 'ar' | 'en';

// Ported verbatim from the prototype's STR dictionary. Coverage is partial by design
// (nav bar, home, settings) -- Analytics/Budget/Tips/Debts/Tasks/Loans stay Arabic-only,
// matching the handoff's documented bilingual-coverage scope.
export const STR: Record<string, Record<Lang, string>> = {
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  available_balance: { ar: 'الرصيد المتاح', en: 'Available Balance' },
  income_month: { ar: 'الدخل هذا الشهر', en: 'Income this month' },
  expense_month: { ar: 'المصروف هذا الشهر', en: 'Expense this month' },
  income_log: { ar: 'سجل الراتب', en: 'Income Log' },
  budget: { ar: 'الميزانية', en: 'Budget' },
  tips: { ar: 'النصائح', en: 'Tips' },
  debts: { ar: 'الديون', en: 'Debts' },
  tasks: { ar: 'المهام', en: 'Tasks' },
  shared_loans: { ar: 'سلف مشتركة', en: 'Shared Loans' },
  tip_of_day: { ar: 'نصيحة اليوم', en: 'Tip of the Day' },
  refresh: { ar: 'تحديث', en: 'Refresh' },
  recent_tx: { ar: 'آخر العمليات', en: 'Recent Transactions' },
  view_all: { ar: 'عرض الكل', en: 'View all' },
  home: { ar: 'الرئيسية', en: 'Home' },
  analytics: { ar: 'التحليلات', en: 'Analytics' },
  account: { ar: 'حسابي', en: 'Account' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  currency: { ar: 'العملة', en: 'Currency' },
  notifications: { ar: 'الإشعارات', en: 'Notifications' },
  dark_mode: { ar: 'الوضع الليلي', en: 'Dark Mode' },
  logout: { ar: 'تسجيل الخروج', en: 'Log Out' },
  about: { ar: 'من نحن', en: 'About Us' },
  language: { ar: 'اللغة', en: 'Language' },
  premium: { ar: 'الاشتراك المميز', en: 'Premium Subscription' },
  active: { ar: 'مفعّل', en: 'Active' },
  activate_now: { ar: 'فعّل الآن', en: 'Activate' },
  choose_currency: { ar: 'اختر العملة', en: 'Choose Currency' },
  login: { ar: 'تسجيل الدخول', en: 'Log In' },
  signup: { ar: 'حساب جديد', en: 'Sign Up' },
};

export function t(key: string, lang: Lang): string {
  return STR[key]?.[lang] ?? key;
}
