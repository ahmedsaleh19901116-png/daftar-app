import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props extends ViewProps {
  padding?: number;
  radius?: number;
  elevation?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ padding = 16, radius, elevation = 'sm', style, children, ...rest }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius ?? theme.radius.card,
          padding,
        },
        elevation !== 'none' ? theme.shadow[elevation] : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
