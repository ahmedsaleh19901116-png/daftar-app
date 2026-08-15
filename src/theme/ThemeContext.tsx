import React, { createContext, useContext, useMemo } from 'react';
import { darkColors, lightColors, radius, shadow, ThemeColors } from './tokens';

type Theme = {
  colors: ThemeColors;
  radius: typeof radius;
  shadow: typeof shadow;
  dark: boolean;
};

const ThemeCtx = createContext<Theme>({ colors: lightColors, radius, shadow, dark: false });

export function ThemeProvider({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  const value = useMemo<Theme>(
    () => ({ colors: dark ? darkColors : lightColors, radius, shadow, dark }),
    [dark]
  );
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
