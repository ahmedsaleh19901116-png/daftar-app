import { Directory, File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { catName } from './store';
import { DatePeriod, filterByPeriod, today } from './helpers';
import { totalBalance } from './selectors';
import { AppState, Transaction } from './types';

export type ExportPeriod = DatePeriod;

function accountName(state: AppState, id?: string): string {
  return state.accounts.find((a) => a.id === (id || 'cash'))?.name ?? 'نقد';
}

function csvRows(state: AppState, period: ExportPeriod): string[][] {
  const list = [...filterByPeriod(state.transactions, period)].sort((a, b) => a.date.localeCompare(b.date));
  const rows = [['التاريخ', 'النوع', 'الفئة', 'الملاحظة', 'المبلغ', 'عملة العملية', 'المكان']];
  list.forEach((t) => {
    rows.push([t.date, t.type === 'income' ? 'دخل' : 'مصروف', catName(state, t.type, t.categoryId), t.note || '', String(t.amount), t.currency || 'IQD', accountName(state, t.accountId)]);
  });
  return rows;
}

/** Settings > "تصدير نسخة احتياطية" -- writes the full app state as JSON and opens the share sheet. */
export async function exportBackup(state: AppState): Promise<void> {
  const json = JSON.stringify(state, null, 2);
  const file = new File(Paths.cache as Directory, `دفتر-نسخة-احتياطية-${today()}.json`);
  if (file.exists) file.delete();
  file.create();
  file.write(json);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'تصدير نسخة احتياطية' });
  }
}

/** Settings > "استيراد" -- opens the system file picker and parses the chosen JSON backup. */
export async function importBackup(): Promise<Partial<AppState> | null> {
  const result = await File.pickFileAsync({ mimeTypes: ['application/json'] });
  if (result.canceled || !result.result) return null;
  const text = await result.result.text();
  try {
    return JSON.parse(text) as Partial<AppState>;
  } catch {
    throw new Error('ملف غير صالح');
  }
}

/** Settings > "تصدير التقرير" (CSV) -- and the export step of period reset. */
export async function exportTransactionsCsv(state: AppState, period: ExportPeriod): Promise<void> {
  const rows = csvRows(state, period);
  const csv = '﻿' + rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  const file = new File(Paths.cache as Directory, `دفتر-تقرير-${today()}.csv`);
  if (file.exists) file.delete();
  file.create();
  file.write(csv);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: 'تصدير التقرير' });
  }
}

/** Settings > "تصدير التقرير" (PDF). */
export async function exportTransactionsPdf(state: AppState, period: ExportPeriod): Promise<void> {
  const rows = csvRows(state, period);
  const [header, ...body] = rows;
  const html = `
    <html dir="rtl"><head><meta charset="utf-8"><style>
      body { font-family: -apple-system, sans-serif; padding: 16px; }
      h1 { font-size: 18px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: right; }
      th { background: #f0eef9; }
    </style></head><body>
      <h1>تقرير عمليات دفتر — ${today()}</h1>
      <table>
        <tr>${header.map((h) => `<th>${h}</th>`).join('')}</tr>
        ${body.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}
      </table>
    </body></html>`;
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'تصدير التقرير' });
  }
}

/**
 * Settings > "تصفير الحركات وبدء سجل جديد" -- exports the full history first, then returns a
 * new transactions array collapsed to a single carried-forward opening transaction (or empty if
 * the balance is zero). Debts/loans/installments/goals are untouched, matching the prototype.
 */
export async function runPeriodReset(state: AppState): Promise<Transaction[]> {
  await exportTransactionsCsv(state, 'all');
  const balance = totalBalance(state);
  if (balance === 0) return [];
  return [{
    id: Date.now(), type: balance >= 0 ? 'income' : 'expense', categoryId: 'other',
    amount: Math.abs(balance), currency: 'IQD', accountId: 'cash',
    note: 'رصيد مرحّل من السجل السابق', date: today(), method: 'cash',
  }];
}
