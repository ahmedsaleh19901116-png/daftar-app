import * as Location from 'expo-location';
import { Action } from '../data/store';
import { WeatherCondition } from '../data/types';

const CODE_MAP: Record<number, { condition: WeatherCondition; label: string }> = {
  0: { condition: 'sunny', label: 'صافي' },
  1: { condition: 'sunny', label: 'صافٍ غالباً' },
  2: { condition: 'cloudy', label: 'غائم جزئياً' },
  3: { condition: 'cloudy', label: 'غائم' },
  45: { condition: 'foggy', label: 'ضباب' },
  48: { condition: 'foggy', label: 'ضباب متجمد' },
  51: { condition: 'rainy', label: 'رذاذ خفيف' },
  53: { condition: 'rainy', label: 'رذاذ' },
  55: { condition: 'rainy', label: 'رذاذ كثيف' },
  56: { condition: 'rainy', label: 'رذاذ متجمد' },
  57: { condition: 'rainy', label: 'رذاذ متجمد كثيف' },
  61: { condition: 'rainy', label: 'أمطار خفيفة' },
  63: { condition: 'rainy', label: 'أمطار' },
  65: { condition: 'rainy', label: 'أمطار غزيرة' },
  66: { condition: 'rainy', label: 'أمطار متجمدة' },
  67: { condition: 'rainy', label: 'أمطار متجمدة غزيرة' },
  71: { condition: 'snowy', label: 'ثلوج خفيفة' },
  73: { condition: 'snowy', label: 'ثلوج' },
  75: { condition: 'snowy', label: 'ثلوج غزيرة' },
  77: { condition: 'snowy', label: 'حبيبات ثلج' },
  80: { condition: 'rainy', label: 'زخات مطر خفيفة' },
  81: { condition: 'rainy', label: 'زخات مطر' },
  82: { condition: 'rainy', label: 'زخات مطر غزيرة' },
  85: { condition: 'snowy', label: 'زخات ثلج' },
  86: { condition: 'snowy', label: 'زخات ثلج غزيرة' },
  95: { condition: 'stormy', label: 'عاصفة رعدية' },
  96: { condition: 'stormy', label: 'عاصفة رعدية وبرد' },
  99: { condition: 'stormy', label: 'عاصفة رعدية شديدة' },
};

function describeCode(code: number) {
  return CODE_MAP[code] ?? { condition: 'other' as WeatherCondition, label: 'غير معروف' };
}

/** Uses the device's real location + Open-Meteo (free, no API key) for a live current-conditions reading. */
export async function requestWeather(dispatch: React.Dispatch<Action>) {
  dispatch({ type: 'REQUEST_WEATHER_START' });
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      dispatch({ type: 'WEATHER_DENIED' });
      return;
    }
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
    const { latitude, longitude } = position.coords;

    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => [] as Location.LocationGeocodedAddress[]);
    const city = place?.city || place?.subregion || place?.region || 'موقعك';

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    );
    if (!res.ok) throw new Error('weather fetch failed');
    const json = await res.json();
    const current = json.current;
    const { condition, label } = describeCode(current.weather_code);

    dispatch({
      type: 'APPLY_WEATHER',
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      wind: Math.round(current.wind_speed_10m),
      condition,
      descLabel: label,
      city,
    });
  } catch {
    dispatch({ type: 'WEATHER_DENIED' });
  }
}
