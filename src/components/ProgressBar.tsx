import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  pct: number; // 0-100
  height?: number;
  trackColor?: string;
  fillColor?: string;
}

export function ProgressBar({ pct, height = 8, trackColor, fillColor }: Props) {
  const { colors, radius } = useTheme();
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View style={{ height, borderRadius: radius.pill, backgroundColor: trackColor ?? colors.neutral[200], overflow: 'hidden' }}>
      <View style={{ width: `${clamped}%`, height: '100%', borderRadius: radius.pill, backgroundColor: fillColor ?? colors.accent }} />
    </View>
  );
}
