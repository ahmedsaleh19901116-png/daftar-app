import { useMemo } from 'react';
import { CURRENCIES, EXPENSE_CATS, INCOME_CATS, INCOME_GROWTH_TIPS, TIPS } from './constants';
import { DatePeriod, dateWithMonth, daysSince, daysSinceLabel, filterByPeriod, fmt as fmtHelper, formatDate, isOverdue, periodsFor, today } from './helpers';
import { catList, catName, SPECIAL_CATS } from './store';
import { AppState, Category, Debt, Task, Transaction } from './types';

export function useCurrencySymbol(state: AppState): string {
  return state.selectedCurrency ? state.selectedCurrency.symbol : 'د.ع';
}

export function useFmt(state: AppState) {
  const symbol = useCurrencySymbol(state);
  return useMemo(() => (n: number) => fmtHelper(n, symbol), [symbol]);
}

export function catIcon(state: AppState, type: 'income' | 'expense', id: string): string {
  if (SPECIAL_CATS[id]) return SPECIAL_CATS[id].icon;
  const list = catList(state, type);
  return list.find((c) => c.id === id)?.icon ?? 'tag';
}

// ---------- Multi-currency / multi-account ----------

export function toBase(state: AppState, amount: number, currency?: 'IQD' | 'USD'): number {
  return currency === 'USD' ? Math.round(amount * state.usdParallel) : amount;
}

export function txBase(state: AppState, t: Transaction): number {
  return toBase(state, t.amount, t.currency || 'IQD');
}

export function fmtTx(state: AppState, t: Transaction): string {
  const r = Math.round(t.amount);
  const symbol = (t.currency || 'IQD') === 'USD' ? '$' : useCurrencySymbol(state);
  return r.toLocaleString('en-US') + ' ' + symbol;
}

export function accountBalance(state: AppState, id: string): number {
  const income = state.transactions.filter((t) => t.type === 'income' && (t.accountId || 'cash') === id).reduce((a, t) => a + txBase(state, t), 0);
  const expense = state.transactions.filter((t) => t.type === 'expense' && (t.accountId || 'cash') === id).reduce((a, t) => a + txBase(state, t), 0);
  return income - expense;
}

export function totalBalance(state: AppState): number {
  return state.accounts.reduce((a, acc) => a + accountBalance(state, acc.id), 0);
}

export interface AccountBalanceRow {
  id: string;
  icon: string;
  name: string;
  balanceLabel: string;
}

export function accountBalanceRows(state: AppState, fmt: (n: number) => string): AccountBalanceRow[] {
  return state.accounts.map((a) => ({ id: a.id, icon: a.icon, name: a.name, balanceLabel: fmt(accountBalance(state, a.id)) }));
}

export function allExpenseCats(state: AppState): Category[] {
  return [...EXPENSE_CATS, ...state.customExpenseCats];
}

// ---------- Home / recent transactions ----------

export interface RecentTxRow {
  tx: Transaction;
  icon: string;
  title: string;
  meta: string;
  amountLabel: string;
  isIncome: boolean;
}

export function recentTransactions(state: AppState, fmt: (n: number) => string, limit = 6): RecentTxRow[] {
  return [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((t) => ({
      tx: t,
      icon: catIcon(state, t.type, t.categoryId),
      title: t.note,
      meta: catName(state, t.type, t.categoryId) + ' · ' + dateWithMonth(t.date),
      amountLabel: (t.type === 'income' ? '+' : '-') + fmtTx(state, t),
      isIncome: t.type === 'income',
    }));
}

export function allTransactionsSorted(state: AppState): Transaction[] {
  return [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));
}

export interface FilteredTxRow {
  tx: Transaction;
  icon: string;
  title: string;
  meta: string;
  amountLabel: string;
  isIncome: boolean;
}

export interface FilteredTransactionsResult {
  rows: FilteredTxRow[];
  incomeTotal: number;
  expenseTotal: number;
}

export function filteredTransactions(
  state: AppState,
  filters: { type: 'all' | 'income' | 'expense'; categoryId: string; accountId: string; period: DatePeriod },
): FilteredTransactionsResult {
  let list = state.transactions;
  if (filters.type !== 'all') list = list.filter((t) => t.type === filters.type);
  if (filters.categoryId !== 'all') list = list.filter((t) => t.categoryId === filters.categoryId);
  if (filters.accountId !== 'all') list = list.filter((t) => (t.accountId || 'cash') === filters.accountId);
  list = filterByPeriod(list, filters.period);
  const incomeTotalV = list.filter((t) => t.type === 'income').reduce((a, t) => a + txBase(state, t), 0);
  const expenseTotalV = list.filter((t) => t.type === 'expense').reduce((a, t) => a + txBase(state, t), 0);
  const rows = [...list].sort((a, b) => b.date.localeCompare(a.date)).map((t) => ({
    tx: t,
    icon: catIcon(state, t.type, t.categoryId),
    title: t.note,
    meta: catName(state, t.type, t.categoryId) + ' · ' + dateWithMonth(t.date),
    amountLabel: (t.type === 'income' ? '+' : '-') + fmtTx(state, t),
    isIncome: t.type === 'income',
  }));
  return { rows, incomeTotal: incomeTotalV, expenseTotal: expenseTotalV };
}

export function incomeTotal(state: AppState): number {
  return state.transactions.filter((t) => t.type === 'income' && !t.isTransfer).reduce((a, t) => a + txBase(state, t), 0);
}
export function expenseTotal(state: AppState): number {
  return state.transactions.filter((t) => t.type === 'expense' && !t.isTransfer).reduce((a, t) => a + txBase(state, t), 0);
}

// ---------- Analytics ----------

export interface CategoryBreakdownRow {
  id: string;
  name: string;
  icon: string;
  amount: number;
  pct: number;
  barPct: number;
}

export function expenseByCategory(state: AppState): Record<string, number> {
  const byCat: Record<string, number> = {};
  state.transactions.filter((t) => t.type === 'expense' && !t.isTransfer).forEach((t) => { byCat[t.categoryId] = (byCat[t.categoryId] || 0) + txBase(state, t); });
  return byCat;
}

export function categoryBreakdown(state: AppState): CategoryBreakdownRow[] {
  const byCat = expenseByCategory(state);
  const expense = expenseTotal(state);
  const raw = Object.keys(byCat).map((id) => ({ id, name: catName(state, 'expense', id), icon: catIcon(state, 'expense', id), amount: byCat[id] }))
    .sort((a, b) => b.amount - a.amount);
  const maxB = raw.length ? raw[0].amount : 1;
  return raw.map((c) => ({ ...c, pct: expense ? Math.round((c.amount / expense) * 100) : 0, barPct: Math.round((c.amount / maxB) * 100) }));
}

export interface CategoryDetail {
  name: string;
  icon: string;
  total: number;
  count: number;
  avg: number;
  pctOfTotal: number;
  txs: { id: number; note: string; dateLabel: string; amount: number }[];
}

export function categoryDetail(state: AppState, categoryFilter: string): CategoryDetail | null {
  if (categoryFilter === 'all') return null;
  const expense = expenseTotal(state);
  const catTxs = state.transactions.filter((t) => t.type === 'expense' && t.categoryId === categoryFilter);
  const total = catTxs.reduce((a, t) => a + t.amount, 0);
  return {
    name: catName(state, 'expense', categoryFilter),
    icon: catIcon(state, 'expense', categoryFilter),
    total, count: catTxs.length, avg: catTxs.length ? total / catTxs.length : 0,
    pctOfTotal: expense ? Math.round((total / expense) * 100) : 0,
    txs: catTxs.sort((a, b) => b.date.localeCompare(a.date)).map((t) => ({ id: t.id, note: t.note, dateLabel: dateWithMonth(t.date), amount: t.amount })),
  };
}

export interface WeekBar {
  label: string;
  heightPct: number;
}

/** Weekly trend: last 7 calendar days ending today, matching the prototype's fixed 7-day window shape. */
export function weeklyTrend(state: AppState): WeekBar[] {
  const t = new Date(today());
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(t);
    d.setDate(d.getDate() - i);
    days.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
  }
  const dayTotals = days.map((d) => state.transactions.filter((tx) => tx.type === 'expense' && !tx.isTransfer && tx.date === d).reduce((a, tx) => a + txBase(state, tx), 0));
  const maxDay = Math.max(...dayTotals, 1);
  return days.map((d, i) => ({ label: String(Number(d.slice(8, 10))), heightPct: Math.max(6, Math.round((dayTotals[i] / maxDay) * 100)) }));
}

// ---------- Budget ----------

export interface BudgetRow {
  id: string;
  name: string;
  icon: string;
  spent: number;
  limit: number;
  pct: number;
}

export function budgetRows(state: AppState): BudgetRow[] {
  const byCat = expenseByCategory(state);
  return allExpenseCats(state).map((c) => {
    const spent = byCat[c.id] || 0;
    const limit = state.budgets[c.id] || 1;
    return { id: c.id, name: c.name, icon: c.icon, spent, limit, pct: Math.min(100, Math.round((spent / limit) * 100)) };
  });
}

export function totalBudget(state: AppState): number {
  return allExpenseCats(state).reduce((a, c) => a + (state.budgets[c.id] || 0), 0);
}

export interface ForecastInfo {
  forecastNet: number;
  upfrontMonthlyShare: number;
  pendingIOweTotal: number;
  expectedInflows: number;
  hasFactors: boolean;
  savingsSuggestion: { name: string; monthly: number; months: number } | null;
}

export function forecast(state: AppState): ForecastInfo {
  const income = incomeTotal(state);
  const expense = expenseTotal(state);
  const upfrontMonthlyShare = state.upfrontExpenses.reduce((a, u) => a + u.periodAmount, 0);
  const pendingIOweTotal = state.debts.filter((d) => d.type === 'i_owe' && !d.settled).reduce((a, d) => a + (d.amount - (d.paidSoFar || 0)), 0);
  const expectedInstallmentIncome = state.installmentPlans.reduce((a, p) => a + p.periods.filter((per) => per.status === 'pending' && !isOverdue(per, today())).reduce((b, per) => b + per.amount, 0), 0);
  const expectedOwedToMe = state.debts.filter((d) => d.type === 'owed_to_me' && !d.settled).reduce((a, d) => a + (d.amount - (d.paidSoFar || 0)), 0);
  const forecastNet = income - expense - upfrontMonthlyShare - pendingIOweTotal + expectedInstallmentIncome + expectedOwedToMe;
  const active = state.savingsGoals.filter((g) => g.status === 'active' && g.targetDate);
  let savingsSuggestion: ForecastInfo['savingsSuggestion'] = null;
  if (active.length) {
    const g = active[0];
    const months = Math.max(1, Math.round((new Date(g.targetDate as string).getTime() - new Date(today()).getTime()) / (30 * 86400000)));
    const monthly = (g.targetAmount - g.currentSaved) / months;
    if (monthly > 0) savingsSuggestion = { name: g.name, monthly, months };
  }
  return {
    forecastNet, upfrontMonthlyShare, pendingIOweTotal,
    expectedInflows: expectedInstallmentIncome + expectedOwedToMe,
    hasFactors: upfrontMonthlyShare > 0 || pendingIOweTotal > 0 || (expectedInstallmentIncome + expectedOwedToMe) > 0,
    savingsSuggestion,
  };
}

// ---------- Tips ----------

export interface TipEntry {
  title: string;
  body: string;
}

export function combinedTips(state: AppState, fmt: (n: number) => string): TipEntry[] {
  const income = incomeTotal(state);
  const expense = expenseTotal(state);
  const balance = income - expense;
  const breakdown = categoryBreakdown(state);
  const dynTips: TipEntry[] = [];
  if (breakdown.length) {
    const top = breakdown[0];
    const topPct = expense ? Math.round((top.amount / expense) * 100) : 0;
    dynTips.push({ title: 'أعلى بند إنفاق: ' + top.name, body: 'أنفقت ' + fmt(top.amount) + ' على ' + top.name + ' هذا الشهر (' + topPct + '% من مصروفك). حاول خفضه 10% الشهر القادم.' });
  }
  if (income > 0) {
    const savingsPct = Math.round((balance / income) * 100);
    dynTips.push({
      title: 'معدل ادخارك الشهري',
      body: savingsPct >= 20
        ? 'وفّرت ' + savingsPct + '% من دخلك هذا الشهر (' + fmt(balance) + '). معدل صحي، فكّر باستثمار الفائض.'
        : 'وفّرت ' + savingsPct + '% فقط من دخلك هذا الشهر. المعدل الصحي 20% فأكثر — راجع بند الإنفاق الأعلى.',
    });
  }
  const rows = budgetRows(state);
  const worst = [...rows].sort((a, b) => b.pct - a.pct)[0];
  if (worst && worst.pct >= 80) {
    dynTips.push({ title: 'قاربت على تجاوز ميزانية ' + worst.name, body: 'استخدمت ' + worst.pct + '% من حد ' + worst.name + ' (' + fmt(worst.spent) + ' من ' + fmt(worst.limit) + '). قلّل الإنفاق فيها لبقية الشهر.' });
  } else {
    dynTips.push({ title: 'ميزانيتك تحت السيطرة', body: 'كل فئاتك ضمن الحدود المحددة هذا الشهر. حافظ على هذا المستوى وراجع الحدود كل شهر.' });
  }
  const unsettledIOwe = state.debts.filter((d) => d.type === 'i_owe' && !d.settled).reduce((a, d) => a + d.amount, 0);
  if (unsettledIOwe > 0) {
    dynTips.push({ title: 'لديك ديون مستحقة', body: 'عليك ' + fmt(unsettledIOwe) + ' لأشخاص/جهات. خصص جزءًا من دخلك القادم لتسديدها قبل أي إنفاق كماليات.' });
  }
  return [...dynTips, ...INCOME_GROWTH_TIPS, ...TIPS];
}

// ---------- AI assistant ----------

export interface AssistantInsight {
  icon: string;
  title: string;
  body: string;
}

export function assistantInsightRows(state: AppState, fmt: (n: number) => string): AssistantInsight[] {
  const income = incomeTotal(state);
  const expense = expenseTotal(state);
  const byCat = expenseByCategory(state);
  const insights: AssistantInsight[] = [];

  const topCatId = Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a])[0];
  if (topCatId) {
    const pct = expense ? Math.round((byCat[topCatId] / expense) * 100) : 0;
    insights.push({ icon: '📊', title: 'أكبر بند إنفاق', body: 'فئة "' + catName(state, 'expense', topCatId) + '" تستحوذ على ' + pct + '% من مصروفك الكلي (' + fmt(byCat[topCatId]) + '). راقبها إذا تجاوزت حدها بالميزانية.' });
  }
  if (expense > income) {
    insights.push({ icon: '⚠️', title: 'إنفاق أعلى من الدخل', body: 'مصروفك (' + fmt(expense) + ') تجاوز دخلك المسجّل (' + fmt(income) + '). راجع الفئات غير الضرورية هذا الشهر.' });
  } else if (income > 0) {
    const savedPct = Math.round(((income - expense) / income) * 100);
    insights.push({ icon: '✅', title: 'أداء جيد هذا الشهر', body: 'وفّرت تقريباً ' + savedPct + '% من دخلك. استمر وحوّل جزءًا منها لهدف ادخار.' });
  }
  Object.keys(state.budgets).forEach((catId) => {
    const spent = byCat[catId] || 0;
    const limit = state.budgets[catId];
    if (limit && spent > limit) {
      insights.push({ icon: '🔴', title: 'تجاوزت ميزانية ' + catName(state, 'expense', catId), body: 'صرفت ' + fmt(spent) + ' مقابل حد ' + fmt(limit) + '. فكّر برفع الحد أو تقليل الصرف بهذه الفئة.' });
    }
  });
  const TODAY = today();
  const soonTasks = collectAutoTasks(state).filter((t) => t.date <= TODAY);
  if (soonTasks.length) {
    insights.push({ icon: '⏰', title: soonTasks.length + ' التزام مالي يستحق قريباً', body: soonTasks.slice(0, 3).map((t) => t.title).join('، ') });
  }
  const pendingIOwe = state.debts.filter((d) => d.type === 'i_owe' && !d.settled).reduce((a, d) => a + (d.amount - (d.paidSoFar || 0)), 0);
  if (pendingIOwe > 0) {
    insights.push({ icon: '💳', title: 'لديك ديون مستحقة عليك', body: 'إجمالي ' + fmt(pendingIOwe) + ' لسه ما اتسدد. خطط لتسديدها ضمن ميزانية الشهر.' });
  }
  const activeGoal = state.savingsGoals.find((g) => g.status === 'active');
  if (activeGoal) {
    const pct = Math.round((activeGoal.currentSaved / activeGoal.targetAmount) * 100);
    insights.push({ icon: '🎯', title: 'هدف "' + activeGoal.name + '"', body: 'وصلت ' + pct + '% من هدفك. استمر بالمساهمة الشهرية لتحقيقه أسرع.' });
  }
  if (!insights.length) insights.push({ icon: '👋', title: 'ابدأ بتسجيل عملياتك', body: 'كل ما تسجّل مصروف أو دخل أكثر، أقدر أعطيك تحليل وتوصيات أدق.' });
  return insights;
}

// ---------- Debts ----------

export interface DebtRow {
  debt: Debt;
  paidPct: number;
  dateLabel: string;
  daysAgoLabel: string;
  overdue: boolean;
}

export function debtRows(state: AppState, type: 'owed_to_me' | 'i_owe'): DebtRow[] {
  return state.debts
    .filter((d) => d.type === type)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      debt: d,
      paidPct: Math.min(100, Math.round(((d.paidSoFar || 0) / d.amount) * 100)),
      dateLabel: dateWithMonth(d.date),
      daysAgoLabel: daysSinceLabel(d.date),
      overdue: !d.settled && daysSince(d.date) >= 30,
    }));
}

export function debtsTotal(state: AppState, type: 'owed_to_me' | 'i_owe'): number {
  return state.debts.filter((d) => d.type === type && !d.settled).reduce((a, d) => a + d.amount, 0);
}

// ---------- Tasks (manual + auto-generated) ----------

export interface MergedTask extends Task {
  sourceEmoji?: string;
}

const SOURCE_ICON: Record<string, string> = { commitment: '🏠', installment: '🧾', debt: '💳', goal: '🎯', debt_collect: '📞' };

export function collectAutoTasks(state: AppState): Task[] {
  const TODAY = today();
  const soon = (d: string) => (new Date(d).getTime() - new Date(TODAY).getTime()) / 86400000 <= 3;
  const items: Task[] = [];
  state.upfrontExpenses.forEach((u) => u.periods.forEach((p) => {
    if (p.dueDate && soon(p.dueDate)) {
      items.push({ id: 'commitment_' + u.id + '_' + p.index, title: 'حصة ' + u.title + ' — ' + p.monthLabel, date: p.dueDate, priority: 'medium', source: 'commitment', linkedEntityId: u.id, amount: p.amount, categoryId: u.categoryId, done: false });
    }
  }));
  state.installmentPlans.forEach((p) => p.periods.forEach((per) => {
    if (per.status === 'pending' && soon(per.dueDate)) {
      items.push({ id: 'installment_' + p.id + '_' + per.index, title: 'تحصيل قسط ' + p.customerName + ' — ' + per.monthLabel, date: per.dueDate, priority: isOverdue(per, TODAY) ? 'high' : 'medium', source: 'installment', linkedEntityId: p.id, amount: per.amount, done: false });
    }
  }));
  state.debts.filter((d) => d.type === 'i_owe' && !d.settled).forEach((d) => {
    items.push({ id: 'debt_' + d.id, title: 'سداد دين لـ' + d.person, date: d.date, priority: 'medium', source: 'debt', linkedEntityId: d.id, amount: d.amount, categoryId: d.categoryId, done: false });
  });
  state.savingsGoals.filter((g) => g.status === 'active' && g.targetDate).forEach((g) => {
    items.push({ id: 'goal_' + g.id, title: 'مساهمة شهرية في ' + g.name, date: TODAY, priority: 'low', source: 'goal', linkedEntityId: g.id, done: false });
  });
  state.debts.filter((d) => d.type === 'owed_to_me' && !d.settled && daysSince(d.date) >= 14).forEach((d) => {
    items.push({ id: 'debt_collect_' + d.id, title: 'تذكير بتحصيل دين من ' + d.person, date: TODAY, priority: daysSince(d.date) >= 30 ? 'high' : 'low', source: 'debt_collect', linkedEntityId: d.id, amount: d.amount, done: false });
  });
  return items;
}

export function allTasksMerged(state: AppState): MergedTask[] {
  const auto = collectAutoTasks(state).map((a) => ({
    ...a,
    done: state.autoTaskOverrides[String(a.id)] ?? a.done,
    sourceEmoji: SOURCE_ICON[a.source as string],
  }));
  const manual = state.tasks.map((t) => ({ ...t }));
  return [...manual, ...auto];
}

export function taskProgress(state: AppState) {
  const TODAY = today();
  const merged = allTasksMerged(state);
  const todayTasks = merged.filter((t) => t.date === TODAY);
  const done = todayTasks.filter((t) => t.done).length;
  return { done, total: todayTasks.length, pct: todayTasks.length ? Math.round((done / todayTasks.length) * 100) : 0 };
}

// ---------- Shared loans ----------

export interface LoanListRow {
  id: number;
  name: string;
  totalAmount: number;
  participantsCount: number;
  freqLabel: string;
  progressLabel: string;
  progressPct: number;
}

export function loansList(state: AppState): LoanListRow[] {
  return state.sharedLoans.map((l) => {
    const periods = periodsFor(l);
    const totalSlots = l.participants.length * periods.length;
    let paidSlots = 0;
    l.participants.forEach((p) => periods.forEach((per) => { if (l.payments[p.id]?.[per.index]) paidSlots++; }));
    return {
      id: l.id, name: l.name, totalAmount: l.totalAmount, participantsCount: l.participants.length,
      freqLabel: l.frequency === 'monthly' ? 'شهري' : 'أسبوعي',
      progressLabel: paidSlots + ' / ' + totalSlots + ' دفعات',
      progressPct: totalSlots ? Math.round((paidSlots / totalSlots) * 100) : 0,
    };
  });
}

export interface LoanDetailRow {
  participantId: number;
  name: string;
  share: number;
  orderLabel: string;
  cells: { periodIndex: number; paid: boolean }[];
  progressLabel: string;
  inviteStatus?: string;
}

export interface LoanDetailInfo {
  loan: NonNullable<AppState['sharedLoans'][number]>;
  periods: { index: number; label: string }[];
  rangeLabel: string;
  freqLabel: string;
  periodCountLabel: string;
  rows: LoanDetailRow[];
  orderList: { rank: number; name: string }[];
  hasOrder: boolean;
}

export function loanDetail(state: AppState, loanId: number): LoanDetailInfo | null {
  const loan = state.sharedLoans.find((l) => l.id === loanId);
  if (!loan) return null;
  const periods = periodsFor(loan);
  const rows: LoanDetailRow[] = loan.participants.map((p) => {
    const orderIdx = loan.order.indexOf(p.id);
    const cells = periods.map((per) => ({ periodIndex: per.index, paid: !!loan.payments[p.id]?.[per.index] }));
    const paidCount = cells.filter((c) => c.paid).length;
    return {
      participantId: p.id, name: p.name, share: p.share,
      orderLabel: orderIdx >= 0 ? '#' + (orderIdx + 1) : '—', cells,
      progressLabel: paidCount + ' / ' + periods.length,
      inviteStatus: p.inviteStatus,
    };
  });
  return {
    loan, periods,
    rangeLabel: formatDate(loan.startDate) + ' – ' + formatDate(loan.endDate),
    freqLabel: loan.frequency === 'monthly' ? 'شهري' : 'أسبوعي',
    periodCountLabel: periods.length + ' دفعة',
    rows,
    orderList: loan.order.map((pid, i) => ({ rank: i + 1, name: loan.participants.find((x) => x.id === pid)?.name ?? '' })),
    hasOrder: loan.order.length > 0,
  };
}

export function loanHasPayments(loan: AppState['sharedLoans'][number]): boolean {
  return Object.values(loan.payments || {}).some((rec) => Object.values(rec).some(Boolean));
}

// ---------- Installments ----------

export function installmentRemaining(plan: AppState['installmentPlans'][number]): number {
  return plan.periods.filter((p) => p.status === 'pending').reduce((a, p) => a + p.amount, 0);
}

// ---------- Analytics overview tiles ----------

export function netWorth(state: AppState): number {
  const balance = totalBalance(state);
  const owedToMe = state.debts.filter((d) => d.type === 'owed_to_me' && !d.settled).reduce((a, d) => a + (d.amount - (d.paidSoFar || 0)), 0);
  const savings = state.savingsGoals.reduce((a, g) => a + g.currentSaved, 0);
  const iOwe = state.debts.filter((d) => d.type === 'i_owe' && !d.settled).reduce((a, d) => a + (d.amount - (d.paidSoFar || 0)), 0);
  return balance + owedToMe + savings - iOwe;
}

export { CURRENCIES, EXPENSE_CATS, INCOME_CATS };
