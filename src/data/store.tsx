import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { today } from './helpers';
import { EXPENSE_CATS, INCOME_CATS } from './constants';
import {
  seedBudgets, seedCharityLog, seedDebts, seedInstallmentPlans, seedSavingsGoals, seedSharedLoans, seedTasks,
  seedTransactions, seedUpfrontExpenses,
} from './seed';
import {
  AppState, Category, Currency, Debt, DebtDirection, InstallmentPlan, LoanFrequency, LoanParticipant, PayMethod,
  SavingsGoal, SharedLoan, Task, TaskPriority, Transaction, TxType, UpfrontExpense,
} from './types';
import { monthlyPeriods } from './helpers';

function createInitialState(): AppState {
  const TODAY = today();
  return {
    showAdd: false,
    addType: 'expense',
    addCategoryId: null,
    addAmount: '',
    addNote: '',
    addDate: TODAY,
    addMethod: 'cash',
    addPerson: '',
    editingId: null,

    tipIndex: 0,
    balanceHidden: false,
    analyticsPeriod: 'month',
    categoryFilter: 'all',
    budgets: { ...seedBudgets },
    salaryFixed: 8500,
    notificationsOn: true,
    darkMode: false,

    customExpenseCats: [],

    debts: seedDebts,

    tasks: seedTasks(TODAY),
    autoTaskOverrides: {},
    quickLogTask: null,
    quickLogAmount: '',

    sharedLoans: seedSharedLoans,

    upfrontExpenses: seedUpfrontExpenses,

    installmentPlans: seedInstallmentPlans,

    savingsGoals: seedSavingsGoals,

    selectedCurrency: null,
    lang: 'ar',

    charityEnabled: true,
    charityPercent: 2.5,
    charityPending: 0,
    charityLog: seedCharityLog,

    weatherLoading: true,
    weatherDenied: false,
    weatherTemp: null,
    weatherCondition: 'sunny',
    weatherCity: '',

    ratesExpanded: false,
    ratesLoading: false,
    ratesOffline: false,
    usdParallel: 1530,
    usdOfficial: 1310,
    usdTrend: 'up',
    gold21: 181000,
    gold24: 207000,
    gold18: 155000,
    goldTrend: 'down',
    ratesUpdatedLabel: 'قبل 12 دقيقة',

    transactions: seedTransactions,

    accounts: [
      { id: 'cash', name: 'نقد', icon: '💵' },
      { id: 'card', name: 'بطاقة ماستركارد', icon: '💳' },
    ],
    addCurrency: 'IQD',
    addAccountId: 'cash',

    pinEnabled: false,
    pinCode: '',
    appLocked: false,
    pinSetupOpen: false,
    pinSetupValue: '',
    pinEntryValue: '',
    pinError: '',

    referralCount: 0,
    referralCopyDone: false,

    voiceListening: false,

    resetFrequency: 'manual',
  };
}

// -------------------- Actions --------------------

type Action =
  | { type: 'OPEN_ADD'; txType: TxType }
  | { type: 'OPEN_EDIT'; tx: Transaction }
  | { type: 'CLOSE_ADD' }
  | { type: 'SET_ADD_FORM'; patch: Partial<Pick<AppState, 'addType' | 'addCategoryId' | 'addAmount' | 'addNote' | 'addDate' | 'addMethod' | 'addPerson' | 'addCurrency' | 'addAccountId'>> }
  | { type: 'SAVE_TRANSACTION' }
  | { type: 'DELETE_TRANSACTION' }
  | { type: 'ADD_EXPENSE_CATEGORY'; name: string; icon: string }
  | { type: 'SET_BUDGET'; categoryId: string; value: number }

  | { type: 'ADD_DEBT'; id: number; person: string; amount: number; direction: DebtDirection; note: string; accountId: string; date?: string; dueDate?: string | null; notificationId?: string | null }
  | { type: 'CREATE_TRANSFER'; from: string; to: string; amount: number; currency: 'IQD' | 'USD'; note: string }
  | { type: 'PAY_DEBT_INSTALLMENT'; id: number; amount: number }
  | { type: 'WRITE_OFF_DEBT'; id: number }
  | { type: 'COLLECT_DEBT_PARTIAL'; id: number; amount: number }
  | { type: 'WRITE_OFF_OWED_TO_ME'; id: number }

  | { type: 'ADD_TASK'; id: number; title: string; date: string; priority: TaskPriority; notificationId?: string | null }
  | { type: 'TOGGLE_MANUAL_TASK'; id: number | string }
  | { type: 'TOGGLE_AUTO_TASK'; id: string }
  | { type: 'OPEN_QUICK_LOG'; task: Task }
  | { type: 'CLOSE_QUICK_LOG' }
  | { type: 'SET_QUICK_LOG_AMOUNT'; value: string }
  | { type: 'CONFIRM_QUICK_LOG' }

  | { type: 'CREATE_SHARED_LOAN'; id: number; name: string; amount: number; start: string; end: string; freq: LoanFrequency; participants: { name: string; phone?: string; share: number }[] }
  | { type: 'DELETE_SHARED_LOAN'; loanId: number }
  | { type: 'TOGGLE_LOAN_PAYMENT'; loanId: number; participantId: number; periodIndex: number }
  | { type: 'SET_LOAN_ORDER'; loanId: number; order: number[] }
  | { type: 'ACCEPT_INVITE'; loanId: number; participantId: number }

  | { type: 'CREATE_UPFRONT_EXPENSE'; title: string; amount: number; periodsCount: number; startDate: string; categoryId: string }

  | { type: 'CREATE_INSTALLMENT_PLAN'; id: number; customerName: string; amount: number; periodsCount: number; startDate: string; item: string; periodNotificationIds?: (string | null)[] }
  | { type: 'RECORD_PERIOD_PAYMENT'; planId: number; periodIndex: number }

  | { type: 'CREATE_SAVINGS_GOAL'; name: string; target: number; date: string }
  | { type: 'ADD_CONTRIBUTION'; goalId: number; amount: number }
  | { type: 'COMPLETE_SAVINGS_GOAL'; goalId: number }
  | { type: 'WITHDRAW_FROM_GOAL'; goalId: number }

  | { type: 'TOGGLE_CHARITY_ENABLED' }
  | { type: 'SET_CHARITY_PERCENT'; value: number }
  | { type: 'MARK_CHARITY_GIVEN' }

  | { type: 'TOGGLE_PIN_ENABLED' }
  | { type: 'SET_PIN_SETUP_VALUE'; value: string }
  | { type: 'CONFIRM_PIN_SETUP' }
  | { type: 'CANCEL_PIN_SETUP' }
  | { type: 'LOCK_APP_NOW' }
  | { type: 'SET_PIN_ENTRY_VALUE'; value: string }

  | { type: 'START_VOICE_INPUT' }
  | { type: 'APPLY_VOICE_RESULT'; amount: string; txType: TxType; categoryId: string; note: string }

  | { type: 'COPY_REFERRAL_CODE' }

  | { type: 'SET_RESET_FREQUENCY'; freq: AppState['resetFrequency'] }
  | { type: 'RUN_PERIOD_RESET'; transactions: Transaction[] }

  | { type: 'SET_RATES_EXPANDED'; value: boolean }
  | { type: 'REFRESH_RATES_START' }
  | { type: 'REFRESH_RATES_APPLY' }

  | { type: 'REQUEST_WEATHER_START' }
  | { type: 'APPLY_WEATHER'; temp: number; condition: 'sunny' | 'cloudy' | 'other'; city: string }
  | { type: 'WEATHER_DENIED' }

  | { type: 'SET_LANG'; lang: 'ar' | 'en' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_BALANCE_HIDDEN' }
  | { type: 'PICK_CURRENCY'; currency: Currency }
  | { type: 'SET_TIP_INDEX'; index: number }
  | { type: 'SET_ANALYTICS_PERIOD'; period: 'week' | 'month' | 'year' }
  | { type: 'SET_CATEGORY_FILTER'; id: string }
  | { type: 'IMPORT_STATE'; payload: Partial<AppState> };

function catList(state: AppState, type: TxType): Category[] {
  return type === 'expense' ? [...EXPENSE_CATS, ...state.customExpenseCats] : INCOME_CATS;
}

const SPECIAL_CATS: Record<string, { name: string; icon: string }> = {
  transfer: { name: 'تحويل بين الحسابات', icon: 'card' },
  loan_given: { name: 'قرض مُعطى', icon: 'card' },
  loan_received: { name: 'قرض مُستلم', icon: 'card' },
};

function catName(state: AppState, type: TxType, id: string): string {
  if (SPECIAL_CATS[id]) return SPECIAL_CATS[id].name;
  return catList(state, type).find((c) => c.id === id)?.name ?? 'أخرى';
}

function applyCharity(state: AppState, amount: number): Pick<AppState, 'charityPending'> {
  if (!state.charityEnabled) return { charityPending: state.charityPending };
  const add = amount * (state.charityPercent / 100);
  return { charityPending: add > 0 ? state.charityPending + add : state.charityPending };
}

function reducer(state: AppState, action: Action): AppState {
  const TODAY = today();
  switch (action.type) {
    case 'OPEN_ADD':
      return { ...state, showAdd: true, editingId: null, addType: action.txType, addCategoryId: null, addAmount: '', addNote: '', addDate: TODAY, addMethod: 'cash', addPerson: '' };
    case 'OPEN_EDIT':
      return {
        ...state, showAdd: true, editingId: action.tx.id, addType: action.tx.type, addCategoryId: action.tx.categoryId,
        addAmount: String(action.tx.amount), addNote: action.tx.note, addDate: action.tx.date, addMethod: action.tx.method || 'cash', addPerson: '',
      };
    case 'CLOSE_ADD':
      return { ...state, showAdd: false };
    case 'SET_ADD_FORM':
      return { ...state, ...action.patch };
    case 'SAVE_TRANSACTION': {
      const { addType, addCategoryId, addAmount, addNote, addDate, addMethod, addPerson, addCurrency, addAccountId, transactions, debts, editingId } = state;
      const amountNum = Number(addAmount);
      if (!addCategoryId || !(amountNum > 0)) return state;
      const date = addDate || TODAY;
      if (editingId) {
        return {
          ...state, showAdd: false, editingId: null,
          transactions: transactions.map((t) => t.id === editingId
            ? { ...t, type: addType, categoryId: addCategoryId, amount: amountNum, note: addNote || catName(state, addType, addCategoryId), date, method: addMethod }
            : t),
        };
      }
      if (addType === 'income' && addMethod === 'debt') {
        const tx: Transaction = {
          id: Date.now(), type: 'income', categoryId: 'loan', amount: amountNum, currency: addCurrency, accountId: addAccountId,
          note: addNote || ('قرض من ' + (addPerson || 'غير محدد')), date, method: 'debt', isTransfer: true,
        };
        const entry: Debt = { id: Date.now() + 1, person: addPerson || 'غير محدد', type: 'i_owe', amount: amountNum, note: addNote || 'قرض مستلم', date, settled: false, paidSoFar: 0, payments: [], linkedTransactionId: tx.id };
        return { ...state, showAdd: false, debts: [entry, ...debts], transactions: [tx, ...transactions] };
      }
      const tx: Transaction = { id: Date.now(), type: addType, categoryId: addCategoryId, amount: amountNum, note: addNote || catName(state, addType, addCategoryId), date, method: addMethod, currency: addCurrency, accountId: addAccountId };
      let newDebts = debts;
      if (addMethod === 'debt') {
        newDebts = [{ id: Date.now() + 1, person: addPerson || 'غير محدد', type: 'i_owe', amount: amountNum, note: addNote || catName(state, addType, addCategoryId), date, settled: false, paidSoFar: 0, payments: [] }, ...debts];
      }
      const charityPatch = addType === 'income' ? applyCharity(state, amountNum) : {};
      return { ...state, showAdd: false, transactions: [tx, ...transactions], debts: newDebts, ...charityPatch };
    }
    case 'DELETE_TRANSACTION': {
      if (!state.editingId) return state;
      return { ...state, transactions: state.transactions.filter((t) => t.id !== state.editingId), showAdd: false, editingId: null };
    }
    case 'ADD_EXPENSE_CATEGORY': {
      if (!action.name) return state;
      const id = 'c_' + Date.now();
      return {
        ...state,
        customExpenseCats: [...state.customExpenseCats, { id, name: action.name, icon: action.icon }],
        budgets: { ...state.budgets, [id]: 300 },
        addCategoryId: id,
      };
    }
    case 'SET_BUDGET':
      return { ...state, budgets: { ...state.budgets, [action.categoryId]: action.value } };

    case 'ADD_DEBT': {
      if (!action.person || !(action.amount > 0)) return state;
      const isLoanGiven = action.direction === 'owed_to_me';
      const date = action.date || TODAY;
      const tx: Transaction = {
        id: action.id + 1, type: isLoanGiven ? 'expense' : 'income',
        categoryId: isLoanGiven ? 'loan_given' : 'loan_received',
        amount: action.amount, currency: 'IQD', accountId: action.accountId, isTransfer: true, method: 'cash',
        note: (isLoanGiven ? 'قرض إلى ' : 'قرض من ') + action.person + (action.note ? ' — ' + action.note : ''),
        date,
      };
      const entry: Debt = {
        id: action.id, person: action.person, type: action.direction, amount: action.amount, note: action.note, date,
        settled: false, paidSoFar: 0, payments: [], linkedTransactionId: tx.id,
        dueDate: action.dueDate ?? null, notificationId: action.notificationId ?? null,
      };
      return { ...state, debts: [entry, ...state.debts], transactions: [tx, ...state.transactions] };
    }
    case 'CREATE_TRANSFER': {
      const { from, to, amount, currency, note } = action;
      if (!(amount > 0) || from === to) return state;
      const base = Date.now();
      const noteSuffix = note ? ' — ' + note : '';
      const fromName = state.accounts.find((a) => a.id === from)?.name ?? from;
      const toName = state.accounts.find((a) => a.id === to)?.name ?? to;
      const out: Transaction = { id: base, type: 'expense', categoryId: 'transfer', amount, currency, accountId: from, note: 'تحويل إلى ' + toName + noteSuffix, date: TODAY, method: 'cash', isTransfer: true };
      const inn: Transaction = { id: base + 1, type: 'income', categoryId: 'transfer', amount, currency, accountId: to, note: 'تحويل من ' + fromName + noteSuffix, date: TODAY, method: 'cash', isTransfer: true };
      return { ...state, transactions: [inn, out, ...state.transactions] };
    }
    case 'PAY_DEBT_INSTALLMENT': {
      const d = state.debts.find((x) => x.id === action.id);
      if (!d) return state;
      const remaining = d.amount - (d.paidSoFar || 0);
      const amount = Math.min(action.amount, remaining);
      if (!(amount > 0)) return state;
      const tx: Transaction = { id: Date.now(), type: 'expense', categoryId: d.categoryId || 'other', amount, note: 'دفعة دين لـ' + d.person, date: TODAY, method: 'cash' };
      const paidSoFar = (d.paidSoFar || 0) + amount;
      const settled = paidSoFar >= d.amount;
      return {
        ...state, transactions: [tx, ...state.transactions],
        debts: state.debts.map((x) => x.id === action.id ? { ...x, paidSoFar, settled, notificationId: settled ? null : x.notificationId, payments: [...(x.payments || []), { date: TODAY, amount, linkedTransactionId: tx.id }] } : x),
      };
    }
    case 'WRITE_OFF_DEBT': {
      const d = state.debts.find((x) => x.id === action.id);
      if (!d || d.settled) return state;
      const remaining = d.amount - (d.paidSoFar || 0);
      if (remaining <= 0) return { ...state, debts: state.debts.map((x) => x.id === action.id ? { ...x, settled: true, notificationId: null } : x) };
      const tx: Transaction = { id: Date.now(), type: 'expense', categoryId: d.categoryId || 'other', amount: remaining, note: 'تسديد كامل دين لـ' + d.person, date: TODAY, method: 'cash' };
      return {
        ...state, transactions: [tx, ...state.transactions],
        debts: state.debts.map((x) => x.id === action.id ? { ...x, paidSoFar: x.amount, settled: true, notificationId: null, payments: [...(x.payments || []), { date: TODAY, amount: remaining, linkedTransactionId: tx.id }] } : x),
      };
    }
    case 'COLLECT_DEBT_PARTIAL': {
      const d = state.debts.find((x) => x.id === action.id);
      if (!d) return state;
      const remaining = d.amount - (d.paidSoFar || 0);
      const amount = Math.min(action.amount, remaining);
      if (!(amount > 0)) return state;
      const tx: Transaction = { id: Date.now(), type: 'income', categoryId: d.categoryId || 'other_income', amount, note: 'دفعة تحصيل من ' + d.person, date: TODAY, method: 'cash' };
      const paidSoFar = (d.paidSoFar || 0) + amount;
      const settled = paidSoFar >= d.amount;
      const charityPatch = applyCharity(state, amount);
      return {
        ...state, transactions: [tx, ...state.transactions], ...charityPatch,
        debts: state.debts.map((x) => x.id === action.id ? { ...x, paidSoFar, settled, notificationId: settled ? null : x.notificationId, payments: [...(x.payments || []), { date: TODAY, amount, linkedTransactionId: tx.id }] } : x),
      };
    }
    case 'WRITE_OFF_OWED_TO_ME': {
      const d = state.debts.find((x) => x.id === action.id);
      if (!d || d.settled) return state;
      const remaining = d.amount - (d.paidSoFar || 0);
      if (remaining <= 0) return { ...state, debts: state.debts.map((x) => x.id === action.id ? { ...x, settled: true, notificationId: null } : x) };
      const tx: Transaction = { id: Date.now(), type: 'income', categoryId: d.categoryId || 'other_income', amount: remaining, note: 'تحصيل كامل من ' + d.person, date: TODAY, method: 'cash' };
      const charityPatch = applyCharity(state, remaining);
      return {
        ...state, transactions: [tx, ...state.transactions], ...charityPatch,
        debts: state.debts.map((x) => x.id === action.id ? { ...x, paidSoFar: x.amount, settled: true, notificationId: null, payments: [...(x.payments || []), { date: TODAY, amount: remaining, linkedTransactionId: tx.id }] } : x),
      };
    }

    case 'ADD_TASK': {
      if (!action.title) return state;
      const entry: Task = { id: action.id, title: action.title, date: action.date || TODAY, priority: action.priority, done: false, notificationId: action.notificationId ?? null };
      return { ...state, tasks: [entry, ...state.tasks] };
    }
    case 'TOGGLE_MANUAL_TASK':
      return { ...state, tasks: state.tasks.map((t) => t.id === action.id ? { ...t, done: !t.done, notificationId: !t.done ? null : t.notificationId } : t) };
    case 'TOGGLE_AUTO_TASK':
      return { ...state, autoTaskOverrides: { ...state.autoTaskOverrides, [action.id]: !state.autoTaskOverrides[action.id] } };
    case 'OPEN_QUICK_LOG':
      return { ...state, quickLogTask: action.task, quickLogAmount: '' };
    case 'CLOSE_QUICK_LOG':
      return { ...state, quickLogTask: null, quickLogAmount: '' };
    case 'SET_QUICK_LOG_AMOUNT':
      return { ...state, quickLogAmount: action.value };
    case 'CONFIRM_QUICK_LOG': {
      const task = state.quickLogTask;
      if (!task) return state;
      const amount = Number(state.quickLogAmount) || task.amount || 0;
      const tx: Transaction = { id: Date.now(), type: 'expense', categoryId: task.categoryId || 'other', amount, note: task.title, date: TODAY, method: 'cash' };
      return {
        ...state, transactions: [tx, ...state.transactions], quickLogTask: null, quickLogAmount: '',
        autoTaskOverrides: { ...state.autoTaskOverrides, [String(task.id)]: true },
      };
    }

    case 'CREATE_SHARED_LOAN': {
      const id = action.id;
      const participants: LoanParticipant[] = action.participants.map((p, i) => ({
        id: id + i + 1, name: p.name, phone: p.phone || '', share: p.share, inviteStatus: p.phone ? 'pending' : 'accepted',
      }));
      const loan: SharedLoan = { id, name: action.name, totalAmount: action.amount, startDate: action.start, endDate: action.end, frequency: action.freq, participants, order: [], payments: {} };
      return { ...state, sharedLoans: [loan, ...state.sharedLoans] };
    }
    case 'DELETE_SHARED_LOAN':
      return { ...state, sharedLoans: state.sharedLoans.filter((l) => l.id !== action.loanId) };
    case 'TOGGLE_LOAN_PAYMENT':
      return {
        ...state,
        sharedLoans: state.sharedLoans.map((l) => {
          if (l.id !== action.loanId) return l;
          const payments = { ...l.payments };
          const p = { ...(payments[action.participantId] || {}) };
          p[action.periodIndex] = !p[action.periodIndex];
          payments[action.participantId] = p;
          return { ...l, payments };
        }),
      };
    case 'SET_LOAN_ORDER':
      return { ...state, sharedLoans: state.sharedLoans.map((l) => l.id === action.loanId ? { ...l, order: action.order } : l) };
    case 'ACCEPT_INVITE':
      return {
        ...state,
        sharedLoans: state.sharedLoans.map((l) => l.id !== action.loanId ? l : {
          ...l, participants: l.participants.map((p) => p.id === action.participantId ? { ...p, inviteStatus: 'accepted' } : p),
        }),
      };

    case 'CREATE_UPFRONT_EXPENSE': {
      const periodAmount = action.amount / action.periodsCount;
      const entry: UpfrontExpense = {
        id: Date.now(), title: action.title, totalAmount: action.amount, periodsCount: action.periodsCount, periodAmount,
        startDate: action.startDate, categoryId: action.categoryId, periods: monthlyPeriods(action.periodsCount, action.startDate, periodAmount),
      };
      const tx: Transaction = { id: Date.now() + 1, type: 'expense', categoryId: action.categoryId, amount: action.amount, note: action.title, date: action.startDate, method: 'cash' };
      return { ...state, upfrontExpenses: [entry, ...state.upfrontExpenses], transactions: [tx, ...state.transactions] };
    }

    case 'CREATE_INSTALLMENT_PLAN': {
      const periodAmount = action.amount / action.periodsCount;
      const id = action.id;
      const plan: InstallmentPlan = {
        id, customerName: action.customerName, itemDescription: action.item, totalAmount: action.amount, periodsCount: action.periodsCount,
        periodAmount, startDate: action.startDate,
        periods: monthlyPeriods(action.periodsCount, action.startDate, periodAmount).map((p, i) => ({
          ...p, status: 'pending' as const, notificationId: action.periodNotificationIds?.[i] ?? null,
        })),
        status: 'active',
      };
      return { ...state, installmentPlans: [plan, ...state.installmentPlans] };
    }
    case 'RECORD_PERIOD_PAYMENT': {
      const plan = state.installmentPlans.find((p) => p.id === action.planId);
      if (!plan) return state;
      const period = plan.periods.find((p) => p.index === action.periodIndex);
      if (!period || period.status === 'paid') return state;
      const tx: Transaction = { id: Date.now(), type: 'income', categoryId: 'installment_income', note: 'قسط من ' + plan.customerName, date: TODAY, method: 'cash', amount: period.amount };
      const allPaid = plan.periods.every((p) => p.index === action.periodIndex || p.status === 'paid');
      const charityPatch = applyCharity(state, period.amount);
      return {
        ...state, transactions: [tx, ...state.transactions], ...charityPatch,
        installmentPlans: state.installmentPlans.map((p) => p.id !== action.planId ? p : {
          ...p, status: allPaid ? 'completed' : p.status,
          periods: p.periods.map((per) => per.index === action.periodIndex ? { ...per, status: 'paid' as const, paidDate: TODAY, linkedTransactionId: tx.id, notificationId: null } : per),
        }),
      };
    }

    case 'CREATE_SAVINGS_GOAL': {
      if (!action.name || !(action.target > 0)) return state;
      const goal: SavingsGoal = { id: Date.now(), name: action.name, targetAmount: action.target, currentSaved: 0, targetDate: action.date || null, status: 'active', contributions: [] };
      return { ...state, savingsGoals: [goal, ...state.savingsGoals] };
    }
    case 'ADD_CONTRIBUTION': {
      if (!(action.amount > 0)) return state;
      const g = state.savingsGoals.find((x) => x.id === action.goalId);
      const tx: Transaction = { id: Date.now(), type: 'expense', categoryId: 'savings', note: 'مساهمة في هدف ' + (g ? g.name : ''), date: TODAY, method: 'cash', amount: action.amount };
      return {
        ...state, transactions: [tx, ...state.transactions],
        savingsGoals: state.savingsGoals.map((gg) => {
          if (gg.id !== action.goalId) return gg;
          const currentSaved = gg.currentSaved + action.amount;
          return { ...gg, currentSaved, status: currentSaved >= gg.targetAmount ? 'achieved' as const : 'active' as const, contributions: [{ date: TODAY, amount: action.amount }, ...gg.contributions] };
        }),
      };
    }
    case 'COMPLETE_SAVINGS_GOAL': {
      const g = state.savingsGoals.find((x) => x.id === action.goalId);
      if (!g) return state;
      const tx: Transaction = { id: Date.now(), type: 'expense', categoryId: 'savings_purchase', note: 'شراء: ' + g.name, date: TODAY, method: 'cash', amount: g.currentSaved };
      return { ...state, transactions: [tx, ...state.transactions], savingsGoals: state.savingsGoals.filter((x) => x.id !== action.goalId) };
    }
    case 'WITHDRAW_FROM_GOAL': {
      const g = state.savingsGoals.find((x) => x.id === action.goalId);
      if (!g || g.currentSaved <= 0) return state;
      const tx: Transaction = { id: Date.now(), type: 'income', categoryId: 'other_income', note: 'سحب من هدف ' + g.name, date: TODAY, method: 'cash', amount: g.currentSaved };
      return { ...state, transactions: [tx, ...state.transactions], savingsGoals: state.savingsGoals.map((x) => x.id === action.goalId ? { ...x, currentSaved: 0, status: 'active' as const } : x) };
    }

    case 'TOGGLE_CHARITY_ENABLED':
      return { ...state, charityEnabled: !state.charityEnabled };
    case 'SET_CHARITY_PERCENT':
      return { ...state, charityPercent: action.value };
    case 'MARK_CHARITY_GIVEN': {
      if (state.charityPending <= 0) return state;
      return {
        ...state, charityPending: 0,
        charityLog: [{ id: Date.now(), date: TODAY, amount: Math.round(state.charityPending), note: '' }, ...state.charityLog],
      };
    }

    case 'TOGGLE_PIN_ENABLED':
      return state.pinEnabled
        ? { ...state, pinEnabled: false, pinCode: '' }
        : { ...state, pinSetupOpen: true, pinSetupValue: '' };
    case 'SET_PIN_SETUP_VALUE':
      return { ...state, pinSetupValue: action.value.replace(/\D/g, '').slice(0, 4) };
    case 'CONFIRM_PIN_SETUP':
      if (state.pinSetupValue.length !== 4) return { ...state, pinError: 'أدخل 4 أرقام' };
      return { ...state, pinEnabled: true, pinCode: state.pinSetupValue, pinSetupOpen: false, pinError: '' };
    case 'CANCEL_PIN_SETUP':
      return { ...state, pinSetupOpen: false, pinError: '' };
    case 'LOCK_APP_NOW':
      return { ...state, appLocked: true, pinEntryValue: '', pinError: '' };
    case 'SET_PIN_ENTRY_VALUE': {
      const v = action.value.replace(/\D/g, '').slice(0, 4);
      if (v.length === 4) {
        return v === state.pinCode
          ? { ...state, appLocked: false, pinEntryValue: '', pinError: '' }
          : { ...state, pinError: 'رمز غير صحيح', pinEntryValue: '' };
      }
      return { ...state, pinEntryValue: v };
    }

    case 'START_VOICE_INPUT':
      return state.voiceListening ? state : { ...state, voiceListening: true };
    case 'APPLY_VOICE_RESULT':
      return {
        ...state, voiceListening: false,
        addAmount: action.amount, addType: action.txType, addCategoryId: action.categoryId, addNote: action.note,
      };

    case 'COPY_REFERRAL_CODE':
      return { ...state, referralCopyDone: true };

    case 'SET_RESET_FREQUENCY':
      return { ...state, resetFrequency: action.freq };
    case 'RUN_PERIOD_RESET':
      return { ...state, transactions: action.transactions, editingId: null };

    case 'SET_RATES_EXPANDED':
      return { ...state, ratesExpanded: action.value };
    case 'REFRESH_RATES_START':
      return state.ratesLoading ? state : { ...state, ratesLoading: true };
    case 'REFRESH_RATES_APPLY': {
      if (state.ratesOffline) return { ...state, ratesLoading: false };
      const usdDelta = Math.round((Math.random() - 0.5) * 6);
      const goldDelta = Math.round((Math.random() - 0.5) * 800);
      return {
        ...state, ratesLoading: false,
        usdParallel: state.usdParallel + usdDelta,
        usdTrend: usdDelta === 0 ? 'flat' : usdDelta > 0 ? 'up' : 'down',
        gold21: state.gold21 + goldDelta,
        gold24: state.gold24 + Math.round(goldDelta * 1.14),
        gold18: state.gold18 + Math.round(goldDelta * 0.86),
        goldTrend: goldDelta === 0 ? 'flat' : goldDelta > 0 ? 'up' : 'down',
        ratesUpdatedLabel: 'الآن',
      };
    }

    case 'REQUEST_WEATHER_START':
      return { ...state, weatherLoading: true, weatherDenied: false };
    case 'APPLY_WEATHER':
      return { ...state, weatherLoading: false, weatherDenied: false, weatherTemp: action.temp, weatherCondition: action.condition, weatherCity: action.city };
    case 'WEATHER_DENIED':
      return { ...state, weatherLoading: false, weatherDenied: true };

    case 'SET_LANG':
      return { ...state, lang: action.lang };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsOn: !state.notificationsOn };
    case 'TOGGLE_BALANCE_HIDDEN':
      return { ...state, balanceHidden: !state.balanceHidden };
    case 'PICK_CURRENCY':
      return { ...state, selectedCurrency: action.currency };
    case 'SET_TIP_INDEX':
      return { ...state, tipIndex: action.index };
    case 'SET_ANALYTICS_PERIOD':
      return { ...state, analyticsPeriod: action.period };
    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.id };
    case 'IMPORT_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// -------------------- Context --------------------

interface StoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreCtx = createContext<StoreValue | null>(null);

const STORAGE_KEY = 'daftar_state_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously-saved state once on mount, before the first persist-write below can run.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            dispatch({ type: 'IMPORT_STATE', payload: JSON.parse(raw) });
          } catch {
            // Corrupted save -- fall back to the default seed state.
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  // Persist on change, once hydration has settled (so we never overwrite a real save with the
  // transient default state that exists before the read above resolves). Debounced -- state
  // changes on every keystroke (e.g. typing in the add-transaction amount field), and
  // JSON.stringify-ing the whole app state (transactions included) on each one caused visible
  // jank; writing only after things settle for a moment keeps saves reliable without the cost.
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [state, hydrated]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f5fb' }}>
        <ActivityIndicator color="#6c5ce7" size="large" />
      </View>
    );
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStoreState(): AppState {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStoreState must be used within StoreProvider');
  return ctx.state;
}

export function useDispatch(): React.Dispatch<Action> {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useDispatch must be used within StoreProvider');
  return ctx.dispatch;
}

export { catList, catName, SPECIAL_CATS };
export type { Action };
