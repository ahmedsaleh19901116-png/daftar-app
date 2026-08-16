import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebase';
import { ExchangeRateDoc } from '../types/exchangeRate';

const CACHE_KEY = 'exchange_rate_cache';

export function useExchangeRate() {
  const [data, setData] = useState<ExchangeRateDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // حمّل آخر قيمة محفوظة محلياً فوراً (لتجربة أسرع + دعم أوفلاين)
    AsyncStorage.getItem(CACHE_KEY).then((cached) => {
      if (cached) {
        try {
          setData(JSON.parse(cached));
        } catch {
          // تجاهل كاش تالف
        }
      }
    });

    const unsubscribe = onSnapshot(
      doc(db, 'exchange_rates', 'current'),
      (snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const docData = snapshot.data() as ExchangeRateDoc;
          setData(docData);
          setError(null);
          AsyncStorage.setItem(CACHE_KEY, JSON.stringify(docData)).catch(() => {});
        }
      },
      (err) => {
        setLoading(false);
        setError(err.message);
        // لا نمسح البيانات المحفوظة بالكاش عند فشل الاتصال — نعرضها كما هي
      }
    );

    return () => unsubscribe();
  }, []);

  const isStale = data ? Date.now() - data.updatedAt > 24 * 60 * 60 * 1000 : false;

  return { data, loading, error, isStale };
}
