import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ExchangeRateDoc } from '../types/exchangeRate';

export async function fetchExchangeRate(): Promise<ExchangeRateDoc | null> {
  try {
    const snapshot = await getDoc(doc(db, 'exchange_rates', 'current'));
    return snapshot.exists() ? (snapshot.data() as ExchangeRateDoc) : null;
  } catch (error) {
    console.error('فشل الاتصال بـ Firestore:', error);
    return null;
  }
}
