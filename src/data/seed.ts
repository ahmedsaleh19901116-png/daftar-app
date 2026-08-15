import {
  CharityLogEntry, Debt, InstallmentPlan, SavingsGoal, SharedLoan, Task, Transaction, UpfrontExpense,
} from './types';

// Seed/mock data ported verbatim from the prototype's initial state, for demo purposes.

export const seedTransactions: Transaction[] = [
  { id: 1, type: 'income', categoryId: 'salary', amount: 8500, note: 'راتب أغسطس', date: '2026-08-01' },
  { id: 2, type: 'expense', categoryId: 'bills', amount: 340, note: 'فاتورة الكهرباء', date: '2026-08-03' },
  { id: 3, type: 'expense', categoryId: 'food', amount: 85, note: 'غداء عمل', date: '2026-08-09' },
  { id: 4, type: 'expense', categoryId: 'transport', amount: 120, note: 'وقود السيارة', date: '2026-08-08' },
  { id: 5, type: 'income', categoryId: 'freelance', amount: 600, note: 'تصميم شعار', date: '2026-08-07' },
  { id: 6, type: 'expense', categoryId: 'shopping', amount: 210, note: 'ملابس', date: '2026-08-06' },
  { id: 7, type: 'expense', categoryId: 'health', amount: 95, note: 'صيدلية', date: '2026-08-05' },
  { id: 8, type: 'expense', categoryId: 'food', amount: 60, note: 'قهوة وفطور', date: '2026-08-11' },
  { id: 9, type: 'expense', categoryId: 'other', amount: 40, note: 'متفرقات', date: '2026-08-02' },
  { id: 10, type: 'expense', categoryId: 'taxi', amount: 75, note: 'تطبيق نقل', date: '2026-08-10' },
  { id: 11, type: 'income', categoryId: 'salary', amount: 8200, note: 'راتب يوليو', date: '2026-07-01' },
  { id: 12, type: 'expense', categoryId: 'bills', amount: 355, note: 'فاتورة الإنترنت', date: '2026-07-04' },
  { id: 13, type: 'expense', categoryId: 'food', amount: 130, note: 'مطعم عائلي', date: '2026-07-12' },
  { id: 14, type: 'expense', categoryId: 'shopping', amount: 480, note: 'أجهزة منزلية', date: '2026-07-15' },
  { id: 15, type: 'income', categoryId: 'freelance', amount: 450, note: 'تصميم بوستر', date: '2026-07-20' },
  { id: 16, type: 'expense', categoryId: 'health', amount: 70, note: 'كشف طبيب', date: '2026-07-22' },
  { id: 17, type: 'income', categoryId: 'salary', amount: 8200, note: 'راتب يونيو', date: '2026-06-01' },
  { id: 18, type: 'expense', categoryId: 'bills', amount: 300, note: 'فاتورة الماء والكهرباء', date: '2026-06-05' },
  { id: 19, type: 'expense', categoryId: 'transport', amount: 150, note: 'صيانة السيارة', date: '2026-06-10' },
  { id: 20, type: 'expense', categoryId: 'food', amount: 95, note: 'بقالة الأسبوع', date: '2026-06-14' },
  { id: 21, type: 'income', categoryId: 'sell_item', amount: 300, note: 'بيع أثاث مستعمل', date: '2026-06-18' },
  { id: 22, type: 'expense', categoryId: 'gifts', amount: 60, note: 'هدية عيد ميلاد', date: '2026-06-25' },
  { id: 23, type: 'income', categoryId: 'salary', amount: 8000, note: 'راتب مايو', date: '2026-05-01' },
  { id: 24, type: 'expense', categoryId: 'bills', amount: 310, note: 'فاتورة الكهرباء', date: '2026-05-06' },
  { id: 25, type: 'expense', categoryId: 'food', amount: 110, note: 'غداء عمل', date: '2026-05-13' },
  { id: 26, type: 'expense', categoryId: 'health', amount: 55, note: 'صيدلية', date: '2026-05-17' },
  { id: 27, type: 'income', categoryId: 'freelance', amount: 500, note: 'استشارة تصميم', date: '2026-05-20' },
  { id: 28, type: 'expense', categoryId: 'shopping', amount: 190, note: 'ملابس صيفية', date: '2026-05-24' },
];

export const seedDebts: Debt[] = [
  { id: 1, person: 'خالد', type: 'owed_to_me', amount: 400, note: 'سلفة شخصية', date: '2026-07-20', settled: false, paidSoFar: 0, payments: [] },
  { id: 2, person: 'سارة', type: 'owed_to_me', amount: 150, note: 'نصيب فاتورة مشتركة', date: '2026-08-02', settled: false, paidSoFar: 0, payments: [] },
  { id: 3, person: 'متجر الإلكترونيات', type: 'i_owe', amount: 620, note: 'شراء بالتقسيط', date: '2026-07-28', settled: false, paidSoFar: 200, payments: [{ date: '2026-06-15', amount: 200, linkedTransactionId: 0 }] },
  { id: 4, person: 'عمر', type: 'owed_to_me', amount: 250, note: 'سلفة سفر', date: '2026-06-10', settled: true, paidSoFar: 250, payments: [{ date: '2026-06-28', amount: 250, linkedTransactionId: 0 }] },
  { id: 5, person: 'محل الأدوات المنزلية', type: 'i_owe', amount: 300, note: 'قسط غسالة', date: '2026-05-15', settled: true, paidSoFar: 300, payments: [{ date: '2026-06-01', amount: 300, linkedTransactionId: 0 }] },
];

export function seedTasks(TODAY: string): Task[] {
  return [
    { id: 1, title: 'تحويل نسبة الادخار الشهرية', date: TODAY, priority: 'high', done: false },
    { id: 2, title: 'مراجعة فواتير الأسبوع', date: TODAY, priority: 'medium', done: true },
    { id: 3, title: 'سداد فاتورة الإنترنت', date: '2026-08-13', priority: 'high', done: false },
    { id: 4, title: 'تحديث ميزانية شهر أغسطس', date: '2026-08-15', priority: 'low', done: false },
  ];
}

export const seedSharedLoans: SharedLoan[] = [
  {
    id: 1, name: 'سلفة الموظفين - أغسطس', totalAmount: 1500, startDate: '2026-08-01', endDate: '2026-11-01', frequency: 'monthly',
    participants: [
      { id: 101, name: 'أحمد', share: 500 },
      { id: 102, name: 'منى', share: 500 },
      { id: 103, name: 'يوسف', share: 500 },
    ],
    order: [], payments: {},
  },
];

export const seedUpfrontExpenses: UpfrontExpense[] = [
  {
    id: 1, title: 'إيجار 6 أشهر', totalAmount: 1800000, periodsCount: 6, periodAmount: 300000, startDate: '2026-05-01', categoryId: 'bills',
    periods: [
      { index: 0, monthLabel: 'أيار 2026', amount: 300000 },
      { index: 1, monthLabel: 'حزيران 2026', amount: 300000 },
      { index: 2, monthLabel: 'تموز 2026', amount: 300000 },
      { index: 3, monthLabel: 'آب 2026', amount: 300000 },
      { index: 4, monthLabel: 'أيلول 2026', amount: 300000 },
      { index: 5, monthLabel: 'تشرين الأول 2026', amount: 300000 },
    ],
  },
];

export const seedInstallmentPlans: InstallmentPlan[] = [
  {
    id: 1, customerName: 'أحمد كريم', itemDescription: 'جهاز جوال', totalAmount: 900000, periodsCount: 3, periodAmount: 300000, startDate: '2026-05-10', status: 'active',
    periods: [
      { index: 0, monthLabel: 'أيار 2026', dueDate: '2026-05-10', amount: 300000, status: 'paid', paidDate: '2026-05-10', linkedTransactionId: 0 },
      { index: 1, monthLabel: 'حزيران 2026', dueDate: '2026-06-10', amount: 300000, status: 'paid', paidDate: '2026-06-11', linkedTransactionId: 0 },
      { index: 2, monthLabel: 'تموز 2026', dueDate: '2026-07-10', amount: 300000, status: 'pending' },
    ],
  },
  {
    id: 2, customerName: 'زينب علي', itemDescription: 'بضاعة متنوعة', totalAmount: 450000, periodsCount: 3, periodAmount: 150000, startDate: '2026-05-25', status: 'active',
    periods: [
      { index: 0, monthLabel: 'أيار 2026', dueDate: '2026-05-25', amount: 150000, status: 'paid', paidDate: '2026-05-26', linkedTransactionId: 0 },
      { index: 1, monthLabel: 'حزيران 2026', dueDate: '2026-06-25', amount: 150000, status: 'pending' },
      { index: 2, monthLabel: 'تموز 2026', dueDate: '2026-07-25', amount: 150000, status: 'pending' },
    ],
  },
];

export const seedSavingsGoals: SavingsGoal[] = [
  {
    id: 1, name: 'مدخرات الطوارئ', targetAmount: 2000000, currentSaved: 650000, targetDate: '2027-01-01', status: 'active',
    contributions: [{ date: '2026-08-01', amount: 350000 }, { date: '2026-07-01', amount: 200000 }, { date: '2026-06-01', amount: 100000 }],
  },
  {
    id: 2, name: 'رحلة عائلية', targetAmount: 800000, currentSaved: 800000, targetDate: '2026-07-01', status: 'achieved',
    contributions: [{ date: '2026-06-15', amount: 400000 }, { date: '2026-05-15', amount: 400000 }],
  },
];

export const seedCharityLog: CharityLogEntry[] = [
  { id: 1, date: '2026-08-01', amount: 212, note: 'صدقة راتب أغسطس' },
  { id: 2, date: '2026-07-01', amount: 205, note: 'صدقة راتب يوليو' },
  { id: 3, date: '2026-06-01', amount: 205, note: 'صدقة راتب يونيو' },
  { id: 4, date: '2026-05-01', amount: 200, note: 'صدقة راتب مايو' },
];

export const seedBudgets: Record<string, number> = { food: 1200, transport: 500, bills: 700, shopping: 600, health: 300, other: 300 };
