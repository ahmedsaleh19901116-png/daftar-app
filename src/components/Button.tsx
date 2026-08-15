import React from 'react';
import { ActivityIndicator, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  size?: 'md' | 'lg';
}

export function Button({ label, onPress, variant = 'primary', block, disabled, loading, style, size = 'md' }: Props) {
  const { colors, radius } = useTheme();
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const bg = isPrimary ? colors.accent : isDanger ? '#ffd9df' : isSecondary ? colors.neutral[200] : 'transparent';
  const textColor = isPrimary ? '#ffffff' : isDanger ? '#c23566' : colors.text;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.pill,
          paddingVertical: size === 'lg' ? 15 : 12,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          width: block ? '100%' : undefined,
          borderWidth: isGhost ? 1.5 : 0,
          borderColor: colors.divider,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <AppText weight="bold" size={15} color={textColor}>{label}</AppText>}
    </TouchableOpacity>
  );
}
