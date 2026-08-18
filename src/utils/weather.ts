import * as Location from 'expo-location';
import { Action } from '../data/store';

/**
 * Prototype behavior (app.dc.html): only checks that location access is granted, then always
 * simulates the same reading (Baghdad, 41°, sunny) -- the resolved coordinates are discarded.
 * Real weather-API wiring is explicitly out of scope per the design handoff README.
 */
export async function requestWeather(dispatch: React.Dispatch<Action>) {
  dispatch({ type: 'REQUEST_WEATHER_START' });
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      dispatch({ type: 'WEATHER_DENIED' });
      return;
    }
    setTimeout(() => {
      dispatch({ type: 'APPLY_WEATHER', temp: 41, condition: 'sunny', city: 'بغداد' });
    }, 500);
  } catch {
    dispatch({ type: 'WEATHER_DENIED' });
  }
}
