import { ARABIC_MONTHS } from './constants';
import { InstallmentPeriod, LoanFrequency, SharedLoan, UpfrontPeriod } from './types';

/** Real device "today" as YYYY-MM-DD, per README: "replace with real device date in production". */
export function today(): string {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function fmt(n: number, currencySymbol: string): string {
  const rounded = Math.round(n);
  return rounded.toLocaleString('en-US') + ' ' + currencySymbol;
}

export function dayLabel(d: string): string {
  return String(Number(d.slice(8, 10)));
}

export function monthNameOf(d: string): string {
  return ARABIC_MONTHS[Number(d.slice(5, 7)) - 1];
}

export function dateWithMonth(d: string): string {
  return dayLabel(d) + ' ' + monthNameOf(d);
}

export function formatDate(d?: string): string {
  if (!d) return '';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
}

export interface LoanPeriodLabel {
  index: number;
  label: string;
}

/** Ported 1:1 from prototype's periodsFor(loan). */
export function periodsFor(loan: Pick<SharedLoan, 'frequency' | 'startDate' | 'endDate'>): LoanPeriodLabel[] {
  const start = new Date(loan.startDate);
  const end = new Date(loan.endDate);
  const periods: LoanPeriodLabel[] = [];
  if (loan.frequency === 'monthly') {
    let d = new Date(start.getFullYear(), start.getMonth(), 1);
    const endD = new Date(end.getFullYear(), end.getMonth(), 1);
    let i = 1;
    while (d <= endD && i <= 36) {
      periods.push({ index: i - 1, label: 'دفعة ' + i });
      d.setMonth(d.getMonth() + 1);
      i++;
    }
  } else {
    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
    const weeks = Math.max(1, Math.ceil(diffDays / 7));
    for (let i = 1; i <= Math.min(weeks, 52); i++) periods.push({ index: i - 1, label: 'أسبوع ' + i });
  }
  return periods.length ? periods : [{ index: 0, label: 'دفعة 1' }];
}

/** Ported 1:1 from prototype's monthlyPeriods(count, startDate, amount) -- used for upfront expenses & installments. */
export function monthlyPeriods(count: number, startDate: string, amount: number): (UpfrontPeriod & InstallmentPeriod)[] {
  const start = new Date(startDate);
  const periods: any[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const due = new Date(start.getFullYear(), start.getMonth() + i, start.getDate());
    periods.push({
      index: i,
      monthLabel: ARABIC_MONTHS[d.getMonth()] + ' ' + d.getFullYear(),
      dueDate: due.getFullYear() + '-' + String(due.getMonth() + 1).padStart(2, '0') + '-' + String(due.getDate()).padStart(2, '0'),
      amount,
    });
  }
  return periods;
}

export function isOverdue(period: { status: string; dueDate: string }, todayStr: string): boolean {
  return period.status === 'pending' && period.dueDate < todayStr;
}
