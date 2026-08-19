export type TxType = 'income' | 'expense';
export type PayMethod = 'cash' | 'debt';

export interface Category {
  id: string;
  name: string;
  icon: string;
  group?: string;
}

export interface Transaction {
  id: number;
  type: TxType;
  categoryId: string;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
  method?: PayMethod;
  currency?: 'IQD' | 'USD';
  accountId?: string;
  isTransfer?: boolean;
}

export interface Account {
  id: string;
  name: string;
  icon: string;
}

export type DebtDirection = 'owed_to_me' | 'i_owe';

export interface DebtPayment {
  date: string;
  amount: number;
  linkedTransactionId: number;
}

export interface Debt {
  id: number;
  person: string;
  type: DebtDirection;
  amount: number;
  note: string;
  date: string;
  settled: boolean;
  categoryId?: string;
  paidSoFar?: number;
  payments?: DebtPayment[];
  linkedTransactionId?: number;
  dueDate?: string | null;
  notificationId?: string | null;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy' | 'other';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSource = 'commitment' | 'installment' | 'debt' | 'goal' | 'debt_collect';

export interface Task {
  id: number | string;
  title: string;
  date: string;
  priority: TaskPriority;
  done: boolean;
  source?: TaskSource;
  linkedEntityId?: number;
  amount?: number;
  categoryId?: string;
  notificationId?: string | null;
}

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface LoanParticipant {
  id: number;
  name: string;
  share: number;
  phone?: string;
  inviteStatus?: InviteStatus;
}

export type LoanFrequency = 'monthly' | 'weekly';

export interface SharedLoan {
  id: number;
  name: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  frequency: LoanFrequency;
  participants: LoanParticipant[];
  order: number[];
  payments: Record<number, Record<number, boolean>>;
}

export interface UpfrontPeriod {
  index: number;
  monthLabel: string;
  amount: number;
  dueDate?: string;
}

export interface UpfrontExpense {
  id: number;
  title: string;
  totalAmount: number;
  periodsCount: number;
  periodAmount: number;
  startDate: string;
  categoryId: string;
  periods: UpfrontPeriod[];
}

export type InstallmentStatus = 'pending' | 'paid';

export interface InstallmentPeriod {
  index: number;
  monthLabel: string;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  paidDate?: string;
  linkedTransactionId?: number;
  notificationId?: string | null;
}

export interface InstallmentPlan {
  id: number;
  customerName: string;
  customerPhone?: string;
  itemDescription?: string;
  totalAmount: number;
  periodsCount: number;
  periodAmount: number;
  startDate: string;
  periods: InstallmentPeriod[];
  status: 'active' | 'completed';
}

export interface SavingsContribution {
  date: string;
  amount: number;
}

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentSaved: number;
  targetDate?: string | null;
  status: 'active' | 'achieved';
  contributions: SavingsContribution[];
}

export interface CharityLogEntry {
  id: number;
  date: string;
  amount: number;
  note?: string;
}

export interface Currency {
  code: string;
  name: string;
  nameEn: string;
  symbol: string;
  flag: string;
}

// NOTE on architecture vs. the original HTML prototype: the prototype kept every bit of UI
// state (open/closed forms, in-progress form field values, which loan/installment is
// "selected", etc.) in one big component state object, because it had no router. This port
// uses React Navigation for screen state (selected loan/installment travel as route params)
// and local component state (useState) for ephemeral form-draft fields that only one screen
// ever reads. AppState below is intentionally slimmer: it holds domain data (transactions,
// debts, loans...) plus the handful of UI flags that are genuinely read/written from more
// than one place (e.g. the add/edit transaction sheet, which opens from many screens).

export interface AppState {
  showAdd: boolean;
  addType: TxType;
  addCategoryId: string | null;
  addAmount: string;
  addNote: string;
  addDate: string;
  addMethod: PayMethod;
  addPerson: string;
  editingId: number | null;

  tipIndex: number;
  balanceHidden: boolean;
  analyticsPeriod: 'week' | 'month' | 'year';
  categoryFilter: string;
  budgets: Record<string, number>;
  salaryFixed: number;
  notificationsOn: boolean;
  darkMode: boolean;

  customExpenseCats: Category[];

  debts: Debt[];

  tasks: Task[];
  autoTaskOverrides: Record<string, boolean>;
  quickLogTask: Task | null;
  quickLogAmount: string;

  sharedLoans: SharedLoan[];

  upfrontExpenses: UpfrontExpense[];

  installmentPlans: InstallmentPlan[];

  savingsGoals: SavingsGoal[];

  selectedCurrency: Currency | null;
  lang: 'ar' | 'en';

  charityEnabled: boolean;
  charityPercent: number;
  charityPending: number;
  charityLog: CharityLogEntry[];

  weatherLoading: boolean;
  weatherDenied: boolean;
  weatherTemp: number | null;
  weatherFeelsLike: number | null;
  weatherHumidity: number | null;
  weatherWind: number | null;
  weatherCondition: WeatherCondition;
  weatherDescLabel: string;
  weatherCity: string;

  ratesExpanded: boolean;
  ratesLoading: boolean;
  ratesOffline: boolean;
  usdParallel: number;
  usdOfficial: number;
  usdTrend: 'up' | 'down' | 'flat';
  gold21: number;
  gold24: number;
  gold18: number;
  goldTrend: 'up' | 'down' | 'flat';
  ratesUpdatedLabel: string;

  transactions: Transaction[];

  accounts: Account[];
  addCurrency: 'IQD' | 'USD';
  addAccountId: string;

  pinEnabled: boolean;
  pinCode: string;
  appLocked: boolean;
  pinSetupOpen: boolean;
  pinSetupValue: string;
  pinEntryValue: string;
  pinError: string;

  referralCount: number;
  referralCopyDone: boolean;

  voiceListening: boolean;

  resetFrequency: 'monthly' | 'quarterly' | 'yearly' | 'manual';
}
